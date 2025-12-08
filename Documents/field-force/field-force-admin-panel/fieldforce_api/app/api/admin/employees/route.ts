import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { CreateEmployeeDto } from '@/types/employee';
import bcrypt from 'bcryptjs';
import { mapDepartmentToId, mapManagerToId, mapJobTitleToId, mapBranchToId, mapRoleToId } from '@/lib/fieldMapper';

// GET /api/admin/employees - Get all employees
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('is_active');
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (e.first_name ILIKE $${paramIndex} OR e.last_name ILIKE $${paramIndex} OR e.employee_id ILIKE $${paramIndex} OR e.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (isActive !== null && isActive !== undefined) {
      whereClause += ` AND e.is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM employees e
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get employees with related data
    const employeesQuery = `
      SELECT 
        e.id,
        e.employee_id,
        e.first_name,
        e.last_name,
        e.email,
        e.phone,
        e.date_of_birth,
        e.joining_date,
        e.address,
        e.is_active,
        e.last_login,
        e.created_at,
        e.updated_at,
        b.name as branch_name,
        d.name as department_name,
        r.name as role_name,
        m.first_name || ' ' || m.last_name as manager_name,
        l.name as jobtitle_name,
        g.name as gender_name
      FROM employees e
      LEFT JOIN branches b ON b.id = e.branch_id
      LEFT JOIN departments d ON d.id = e.department_id
      LEFT JOIN roles r ON r.id = e.role_id
      LEFT JOIN employees m ON m.employee_id = e.manager_id
      LEFT JOIN lookup l ON l.id = e.jobtitle_id AND l.key = 'jobtitle'
      LEFT JOIN lookup g ON g.id = e.gender AND g.key = 'gender'
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const result = await query(employeesQuery, params);

    return successResponse({
      employees: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, undefined, origin);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return errorResponse('Failed to fetch employees', 500, origin);
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// POST /api/admin/employees - Create new employee
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const body: any = await request.json(); // Use any to accept additional fields from HRMS
    
    // Validate required fields
    if (!body.employee_id || !body.first_name || !body.last_name || !body.phone || !body.joining_date) {
      return errorResponse('Missing required fields', 400, origin);
    }

    // Check if employee_id already exists
    const existingCheck = await query(
      'SELECT id FROM employees WHERE employee_id = $1',
      [body.employee_id]
    );
    
    if (existingCheck.rows.length > 0) {
      return errorResponse('Employee ID already exists', 409, origin);
    }

    // Hash password if provided
    let passwordHash = body.password_hash;
    if (passwordHash && !passwordHash.startsWith('$2')) {
      // Only hash if not already hashed
      passwordHash = await bcrypt.hash(passwordHash, 10);
    }

    // Use IDs directly from frontend (branches, departments come from our DB dropdowns)
    // Manager: body.manager_id is VARCHAR storing employee_id (6 digits) directly
    const departmentId = body.department_id;
    const branchId = body.branch_id;
    
    // Manager: Use employee_id directly (no conversion needed)
    // Validate that manager employee_id exists if provided
    let managerId = body.manager_id;
    if (managerId && managerId.trim().length > 0) {
      managerId = managerId.trim();
      // Optional: Verify the manager employee_id exists
      try {
        const managerCheck = await query(
          'SELECT employee_id FROM employees WHERE employee_id = $1 AND is_active = true LIMIT 1',
          [managerId]
        );
        if (managerCheck.rows.length === 0) {
          console.warn(`Manager with employee_id "${managerId}" not found in database`);
          // Still allow it to be saved (might be added later), but log a warning
        }
      } catch (err) {
        console.error('Error checking manager employee_id:', err);
        // Continue anyway - validation will happen at database level
      }
    } else {
      managerId = null;
    }
    
    // Map jobtitle text to UUID if provided
    let jobTitleId = body.jobtitle_id;
    if (!jobTitleId && body.jobtitle) {
      jobTitleId = await mapJobTitleToId(body.jobtitle);
    }

    // Map role name to UUID if provided as text
    let roleId = body.role_id;
    if (!roleId && body.role) {
      roleId = await mapRoleToId(body.role);
    }

    // Map gender text to UUID if provided as text
    let genderId = body.gender;
    if (genderId && typeof genderId === 'string' && !genderId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // It's a text value, not a UUID - try to find in lookup
      const genderResult = await query(
        `SELECT id FROM lookup WHERE LOWER(name) = LOWER($1) AND key = 'gender' AND is_active = true LIMIT 1`,
        [genderId]
      );
      if (genderResult.rows.length > 0) {
        genderId = genderResult.rows[0].id;
      } else {
        genderId = null;
      }
    }

    // Insert employee into fieldforce database
    const insertQuery = `
      INSERT INTO employees (
        employee_id, password_hash, first_name, last_name, gender, email, phone,
        date_of_birth, joining_date, address, branch_id, department_id, role_id,
        manager_id, jobtitle_id, created_by, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, employee_id, first_name, last_name, email, phone, joining_date, created_at
    `;

    const result = await query(insertQuery, [
      body.employee_id,
      passwordHash || null,
      body.first_name,
      body.last_name,
      genderId || null,
      body.email || null,
      body.phone,
      body.date_of_birth || null,
      body.joining_date,
      body.address || null,
      branchId || null,
      departmentId || null,
      roleId || null,
      managerId || null,
      jobTitleId || null,
      body.created_by || null,
      true, // is_active default
    ]);

    return successResponse(result.rows[0], 'Employee created successfully', origin);
  } catch (error: any) {
    console.error('Error creating employee:', error);
    
    // Handle connection errors
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      return errorResponse('Employee ID already exists', 409, origin);
    }
    
    // Handle foreign key violations
    if (error.code === '23503') {
      // Check if it's a manager_id constraint issue
      if (error.message?.includes('manager_id')) {
        return errorResponse('Manager employee ID does not exist in the system. Please ensure the manager is added first or leave the manager field empty.', 400, origin);
      }
      return errorResponse('Invalid reference (branch, department, or role does not exist)', 400, origin);
    }
    
    return errorResponse(error.message || 'Failed to create employee', 500, origin);
  }
}

