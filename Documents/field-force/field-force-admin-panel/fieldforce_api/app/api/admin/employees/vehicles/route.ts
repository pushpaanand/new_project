import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// GET /api/admin/employees/vehicles - Get all employee vehicles
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get('employee_id');

    let vehiclesQuery = `
      SELECT 
        ev.id,
        ev.employee_id,
        e.first_name || ' ' || e.last_name as employee_name,
        ev.vehicle_no,
        ev.vehicle_type_id,
        l.name as vehicle_type_name,
        ev.is_active,
        ev.created_at,
        ev.updated_at
      FROM emp_vehicle ev
      JOIN employees e ON e.id = ev.employee_id
      LEFT JOIN lookup l ON l.id = ev.vehicle_type_id AND l.key = 'vehicle_type'
      WHERE 1=1
    `;

    const params: any[] = [];
    if (employeeId) {
      vehiclesQuery += ` AND ev.employee_id = $1`;
      params.push(employeeId);
    }

    vehiclesQuery += ` ORDER BY ev.created_at DESC`;

    const result = await query(vehiclesQuery, params);
    return successResponse(result.rows, '', origin);
  } catch (error: any) {
    console.error('Error fetching employee vehicles:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch employee vehicles', 500, origin);
  }
}

// POST /api/admin/employees/vehicles - Create employee vehicle
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const body = await request.json();
    
    if (!body.employee_id || !body.vehicle_no) {
      return errorResponse('Missing required fields: employee_id, vehicle_no', 400, origin);
    }

    // Check if employee exists
    const employeeCheck = await query(
      'SELECT id FROM employees WHERE id = $1',
      [body.employee_id]
    );

    if (employeeCheck.rows.length === 0) {
      return errorResponse('Employee not found', 404, origin);
    }

    // Check if vehicle number already exists
    const vehicleCheck = await query(
      'SELECT id FROM emp_vehicle WHERE vehicle_no = $1 AND is_active = true',
      [body.vehicle_no]
    );

    if (vehicleCheck.rows.length > 0) {
      return errorResponse('Vehicle number already assigned', 409, origin);
    }

    const insertQuery = `
      INSERT INTO emp_vehicle (
        employee_id, vehicle_no, vehicle_type_id, created_by, is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, employee_id, vehicle_no, vehicle_type_id, is_active, created_at
    `;

    const result = await query(insertQuery, [
      body.employee_id,
      body.vehicle_no,
      body.vehicle_type_id || null,
      body.created_by || null,
      body.is_active !== undefined ? body.is_active : true,
    ]);

    return successResponse(result.rows[0], 'Vehicle assigned successfully', origin);
  } catch (error: any) {
    console.error('Error creating employee vehicle:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    if (error.code === '23505') {
      return errorResponse('Vehicle number already assigned', 409, origin);
    }
    
    return errorResponse(error.message || 'Failed to assign vehicle', 500, origin);
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

