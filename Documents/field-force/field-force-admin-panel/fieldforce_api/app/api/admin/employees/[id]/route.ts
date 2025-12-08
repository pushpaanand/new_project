import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { UpdateEmployeeDto } from '@/types/employee';
import bcrypt from 'bcryptjs';

// GET /api/admin/employees/[id] - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const employeeQuery = `
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
        e.branch_id,
        e.department_id,
        e.role_id,
        e.manager_id,
        e.jobtitle_id,
        e.gender,
        b.name as branch_name,
        d.name as department_name,
        r.name as role_name,
        m.first_name || ' ' || m.last_name as manager_name,
        m.employee_id as manager_employee_id,
        l.name as jobtitle_name,
        g.name as gender_name
      FROM employees e
      LEFT JOIN branches b ON b.id = e.branch_id
      LEFT JOIN departments d ON d.id = e.department_id
      LEFT JOIN roles r ON r.id = e.role_id
      LEFT JOIN employees m ON m.employee_id = e.manager_id
      LEFT JOIN lookup l ON l.id = e.jobtitle_id AND l.key = 'jobtitle'
      LEFT JOIN lookup g ON g.id = e.gender AND g.key = 'gender'
      WHERE e.id::text = $1 OR e.employee_id = $1
    `;

    const result = await query(employeeQuery, [params.id]);

    if (result.rows.length === 0) {
      return errorResponse('Employee not found', 404, origin);
    }

    // Don't return password_hash
    const { password_hash, ...employee } = result.rows[0];

    return successResponse(employee, '', origin);
  } catch (error: any) {
    console.error('Error fetching employee:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch employee', 500, origin);
  }
}

// OPTIONS handler for CORS preflight
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

// PUT /api/admin/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const body: UpdateEmployeeDto & { password?: string } = await request.json();

    // Check if employee exists
    const existingCheck = await query(
      'SELECT id FROM employees WHERE id::text = $1 OR employee_id = $1',
      [params.id]
    );

    if (existingCheck.rows.length === 0) {
      return errorResponse('Employee not found', 404, origin);
    }

    const employeeId = existingCheck.rows[0].id;

    // Build update query dynamically
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Handle password update separately
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateFields.push(`password_hash = $${paramIndex}`);
      values.push(hashedPassword);
      paramIndex++;
    }

    // Update other fields
    // Note: manager_id is now VARCHAR storing employee_id directly
    const allowedFields: (keyof UpdateEmployeeDto)[] = [
      'first_name', 'last_name', 'gender', 'email', 'phone',
      'date_of_birth', 'joining_date', 'address', 'branch_id',
      'department_id', 'role_id', 'manager_id', 'jobtitle_id',
      'is_active', 'updated_by'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // For manager_id, trim and validate if provided
        if (field === 'manager_id' && body[field]) {
          const managerEmployeeId = String(body[field]).trim();
          // Optional: Verify the manager employee_id exists
          try {
            const managerCheck = await query(
              'SELECT employee_id FROM employees WHERE employee_id = $1 AND is_active = true LIMIT 1',
              [managerEmployeeId]
            );
            if (managerCheck.rows.length === 0) {
              console.warn(`Manager with employee_id "${managerEmployeeId}" not found in database`);
              // Still allow update - validation will happen at database level
            }
          } catch (err) {
            console.error('Error checking manager employee_id:', err);
          }
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(managerEmployeeId);
        } else {
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(body[field]);
        }
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return errorResponse('No fields to update', 400, origin);
    }

    // Add updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add employee id for WHERE clause
    values.push(employeeId);

    const updateQuery = `
      UPDATE employees
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, employee_id, first_name, last_name, email, phone, 
                joining_date, is_active, updated_at
    `;

    const result = await query(updateQuery, values);

    return successResponse(result.rows[0], 'Employee updated successfully', origin);
  } catch (error: any) {
    console.error('Error updating employee:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    if (error.code === '23505') {
      return errorResponse('Employee ID already exists', 409, origin);
    }
    
    return errorResponse(error.message || 'Failed to update employee', 500, origin);
  }
}

// DELETE /api/admin/employees/[id] - Soft delete employee (set is_active = false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    // Check if employee exists
    const existingCheck = await query(
      'SELECT id FROM employees WHERE id::text = $1 OR employee_id = $1',
      [params.id]
    );

    if (existingCheck.rows.length === 0) {
      return errorResponse('Employee not found', 404, origin);
    }

    const employeeId = existingCheck.rows[0].id;

    // Soft delete (set is_active = false)
    const deleteQuery = `
      UPDATE employees
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, employee_id, first_name, last_name
    `;

    const result = await query(deleteQuery, [employeeId]);

    return successResponse(result.rows[0], 'Employee deactivated successfully', origin);
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to delete employee', 500, origin);
  }
}

