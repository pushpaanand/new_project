import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// GET /api/admin/managers - Get managers based on role
// Query params: role_id or role_name
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const searchParams = request.nextUrl.searchParams;
    const roleId = searchParams.get('role_id');
    const roleName = searchParams.get('role_name');

    let managersQuery = '';
    let params: any[] = [];

    if (roleName) {
      // If role is Executive or other (not Manager/Super Manager): show Manager and Super Manager
      const roleNameLower = roleName.toLowerCase();
      
      if (roleNameLower === 'manager') {
        // If role is Manager: show only Super Manager
        managersQuery = `
          SELECT 
            e.id,
            e.employee_id,
            e.first_name,
            e.last_name,
            r.name as role_name
          FROM employees e
          INNER JOIN roles r ON e.role_id = r.id
          WHERE LOWER(r.name) = 'super manager'
            AND e.is_active = true
          ORDER BY e.first_name, e.last_name ASC
        `;
      } else if (roleNameLower === 'super manager' || roleNameLower === 'admin') {
        // If role is Super Manager or Admin: return empty (no manager needed)
        return successResponse([], '', origin);
      } else {
        // For Executive or other roles: show Manager and Super Manager
        managersQuery = `
          SELECT 
            e.id,
            e.employee_id,
            e.first_name,
            e.last_name,
            r.name as role_name
          FROM employees e
          INNER JOIN roles r ON e.role_id = r.id
          WHERE LOWER(r.name) IN ('manager', 'super manager')
            AND e.is_active = true
          ORDER BY r.name DESC, e.first_name, e.last_name ASC
        `;
      }
    } else if (roleId) {
      // Get role name first
      const roleResult = await query(
        'SELECT name FROM roles WHERE id = $1',
        [roleId]
      );

      if (roleResult.rows.length === 0) {
        return successResponse([], '', origin);
      }

      const roleNameFromId = roleResult.rows[0].name.toLowerCase();

      if (roleNameFromId === 'manager') {
        managersQuery = `
          SELECT 
            e.id,
            e.employee_id,
            e.first_name,
            e.last_name,
            r.name as role_name
          FROM employees e
          INNER JOIN roles r ON e.role_id = r.id
          WHERE LOWER(r.name) = 'super manager'
            AND e.is_active = true
          ORDER BY e.first_name, e.last_name ASC
        `;
      } else if (roleNameFromId === 'super manager' || roleNameFromId === 'admin') {
        return successResponse([], '', origin);
      } else {
        managersQuery = `
          SELECT 
            e.id,
            e.employee_id,
            e.first_name,
            e.last_name,
            r.name as role_name
          FROM employees e
          INNER JOIN roles r ON e.role_id = r.id
          WHERE LOWER(r.name) IN ('manager', 'super manager')
            AND e.is_active = true
          ORDER BY r.name DESC, e.first_name, e.last_name ASC
        `;
      }
    } else {
      // No role specified, return all managers and super managers
      managersQuery = `
        SELECT 
          e.id,
          e.employee_id,
          e.first_name,
          e.last_name,
          r.name as role_name
        FROM employees e
        INNER JOIN roles r ON e.role_id = r.id
        WHERE LOWER(r.name) IN ('manager', 'super manager')
          AND e.is_active = true
        ORDER BY r.name DESC, e.first_name, e.last_name ASC
      `;
    }

    const result = await query(managersQuery, params);

    return successResponse(result.rows, '', origin);
  } catch (error: any) {
    console.error('Error fetching managers:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch managers', 500, origin);
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
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

