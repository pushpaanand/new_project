import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  password: z.string().min(1, 'Password is required'),
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.flatten().fieldErrors, origin);
    }

    const { employee_id, password } = validationResult.data;

    // Find employee by employee_id
    const employeeResult = await query(
      `SELECT 
        e.id,
        e.employee_id,
        e.password_hash,
        e.first_name,
        e.last_name,
        e.email,
        e.phone,
        e.role_id,
        e.is_active,
        r.id as role_id,
        r.name as role_name
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
      WHERE e.employee_id = $1 AND e.is_active = true`,
      [employee_id]
    );

    if (employeeResult.rows.length === 0) {
      return errorResponse('Invalid employee ID or password', 401, origin);
    }

    const employee = employeeResult.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.password_hash);
    if (!isPasswordValid) {
      return errorResponse('Invalid employee ID or password', 401, origin);
    }

    // Check if role is allowed for admin panel (exclude Agent role)
    if (!employee.role_id || !employee.role_name) {
      return errorResponse('User does not have a valid role assigned', 403, origin);
    }

    const roleName = employee.role_name.toLowerCase();
    if (roleName === 'agent') {
      return errorResponse('Agents can only access the mobile app', 403, origin);
    }

    // Fetch entitlements for the role
    const entitlementsResult = await query(
      `SELECT 
        e.id,
        e.name,
        re.is_read,
        re.is_write
      FROM role_entitlement re
      INNER JOIN entitlement e ON re.entitlement_id = e.id
      WHERE re.role_id = $1 AND re.is_active = true AND e.is_active = true
      ORDER BY e.name`,
      [employee.role_id]
    );

    const entitlements = entitlementsResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      is_read: row.is_read,
      is_write: row.is_write,
    }));

    // Update last_login
    await query(
      `UPDATE employees SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [employee.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        id: employee.id,
        employee_id: employee.employee_id,
        role_id: employee.role_id,
        role_name: employee.role_name,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return response
    return successResponse({
      token,
      user: {
        id: employee.id,
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        role: {
          id: employee.role_id,
          name: employee.role_name,
        },
        entitlements,
      },
    }, 'Login successful', origin);
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('An error occurred during login', 500, origin);
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

