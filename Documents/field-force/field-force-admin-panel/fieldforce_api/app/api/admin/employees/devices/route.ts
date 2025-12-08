import { NextRequest } from 'next/server';
import { query, sanitizeUUID } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// GET /api/admin/employees/devices - Get all employee devices
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get('employee_id');

    let devicesQuery = `
      SELECT 
        ed.id,
        ed.employee_id,
        e.first_name || ' ' || e.last_name as employee_name,
        ed.imei,
        ed.device_make,
        ed.device_os,
        ed.model,
        ed.is_active,
        ed.created_at,
        ed.updated_at
      FROM employee_devices ed
      JOIN employees e ON e.id = ed.employee_id
      WHERE 1=1
    `;

    const params: any[] = [];
    if (employeeId) {
      devicesQuery += ` AND ed.employee_id = $1`;
      params.push(employeeId);
    }

    devicesQuery += ` ORDER BY ed.created_at DESC`;

    const result = await query(devicesQuery, params);
    return successResponse(result.rows, '', origin);
  } catch (error: any) {
    console.error('Error fetching employee devices:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch employee devices', 500, origin);
  }
}

// POST /api/admin/employees/devices - Create employee device
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const body = await request.json();
    
    if (!body.employee_id || !body.device_make || !body.model) {
      return errorResponse('Missing required fields: employee_id, device_make, model', 400, origin);
    }

    // Check if employee exists
    const employeeCheck = await query(
      'SELECT id FROM employees WHERE id = $1',
      [body.employee_id]
    );

    if (employeeCheck.rows.length === 0) {
      return errorResponse('Employee not found', 404, origin);
    }

    const insertQuery = `
      INSERT INTO employee_devices (
        employee_id, imei, device_make, device_os, model, created_by, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, employee_id, imei, device_make, device_os, model, is_active, created_at
    `;

    const result = await query(insertQuery, [
      body.employee_id,
      body.imei || null,
      body.device_make,
      body.device_os || null,
      body.model,
      sanitizeUUID(body.created_by) || null, // Sanitize UUID - set to null if not valid
      body.is_active !== undefined ? body.is_active : true,
    ]);

    return successResponse(result.rows[0], 'Device added successfully', origin);
  } catch (error: any) {
    console.error('Error creating employee device:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse(error.message || 'Failed to create device', 500, origin);
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

