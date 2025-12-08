import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// GET /api/mobile/clients - Get clients assigned to the logged-in employee
// This endpoint should be called with the employee's ID from the JWT token
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    // Extract employee ID from Authorization header (JWT token)
    // For now, we'll get it from query parameter, but in production this should come from JWT
    const authHeader = request.headers.get('authorization');
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // TODO: Extract employee_id from JWT token in production
    // For now, accept it as a query parameter or header
    let employeeId = searchParams.get('employee_id');
    
    // If not in query, try to extract from Authorization header
    if (!employeeId && authHeader) {
      // In production, decode JWT token to get employee_id
      // For now, we'll use a header or query parameter
      employeeId = request.headers.get('x-employee-id');
    }
    
    if (!employeeId) {
      return errorResponse('Employee ID is required. Please provide employee_id in query parameter or x-employee-id header.', 400, origin);
    }
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE c.is_active = true AND cc.emp_id = $1 AND cc.is_active = true';
    const params: any[] = [employeeId];
    let paramIndex = 2;

    if (search) {
      whereClause += ` AND (c.client_name ILIKE $${paramIndex} OR cc.contact_name ILIKE $${paramIndex} OR cc.primary_contact_number ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM client c
      INNER JOIN clients_contact cc ON cc.client_id = c.id
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get clients assigned to this employee with contact information
    const clientsQuery = `
      SELECT DISTINCT
        c.id,
        c.client_name,
        c.category_id,
        cc_cat.name as category_name,
        cc.id as contact_id,
        cc.contact_name,
        cc.primary_contact_number,
        cc.secondary_contact_number,
        cc.primary_email,
        cc.secondary_email,
        cc.address,
        cc.city,
        city_lookup.name as city_name,
        cc.state,
        state_lookup.name as state_name,
        cc.pincode,
        cc.latitude,
        cc.longitude,
        cc.region,
        region_lookup.name as region_name,
        cc.branch,
        cc.created_at,
        cc.updated_at
      FROM client c
      INNER JOIN clients_contact cc ON cc.client_id = c.id AND cc.emp_id = $1 AND cc.is_active = true
      LEFT JOIN client_categories cc_cat ON cc_cat.id = c.category_id
      LEFT JOIN lookup city_lookup ON city_lookup.id = cc.city AND city_lookup.key = 'city'
      LEFT JOIN lookup state_lookup ON state_lookup.id = cc.state AND state_lookup.key = 'state'
      LEFT JOIN lookup region_lookup ON region_lookup.id = cc.region AND region_lookup.key = 'region'
      ${whereClause}
      ORDER BY c.client_name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const result = await query(clientsQuery, params);

    return successResponse({
      clients: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, '', origin);
  } catch (error: any) {
    console.error('Error fetching mobile clients:', error);
    if (error.message?.includes('Database connection failed')) {
      return errorResponse(error.message, 503, origin);
    }
    return errorResponse('Failed to fetch clients', 500, origin);
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-Employee-ID',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

