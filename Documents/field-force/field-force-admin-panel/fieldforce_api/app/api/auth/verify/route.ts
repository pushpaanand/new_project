import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('No token provided', 401);
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Fetch current user data with entitlements
      const employeeResult = await query(
        `SELECT 
          e.id,
          e.employee_id,
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
        WHERE e.id = $1 AND e.is_active = true`,
        [decoded.id]
      );

      if (employeeResult.rows.length === 0) {
        return errorResponse('User not found or inactive', 404);
      }

      const employee = employeeResult.rows[0];

      // Fetch entitlements
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

      return successResponse({
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
      });
    } catch (jwtError) {
      return errorResponse('Invalid or expired token', 401);
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return errorResponse('An error occurred during token verification', 500);
  }
}

