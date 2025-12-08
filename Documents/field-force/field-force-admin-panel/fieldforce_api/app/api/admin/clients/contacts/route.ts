import { NextRequest, NextResponse } from 'next/server';
import { query, sanitizeUUID } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { CreateClientContactDto } from '@/types/client';

// GET /api/admin/clients/contacts - Get all client contacts
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const clientId = searchParams.get('client_id');
    const employeeId = searchParams.get('emp_id');
    const isActive = searchParams.get('is_active');
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (cc.contact_name ILIKE $${paramIndex} OR cc.primary_contact_number ILIKE $${paramIndex} OR c.client_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (clientId) {
      whereClause += ` AND cc.client_id = $${paramIndex}`;
      params.push(clientId);
      paramIndex++;
    }

    if (employeeId) {
      whereClause += ` AND cc.emp_id = $${paramIndex}`;
      params.push(employeeId);
      paramIndex++;
    }

    if (isActive !== null && isActive !== undefined) {
      whereClause += ` AND cc.is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM clients_contact cc
      LEFT JOIN client c ON c.id = cc.client_id
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get client contacts with related data
    const contactsQuery = `
      SELECT 
        cc.id,
        cc.emp_id,
        e.employee_id,
        e.first_name || ' ' || e.last_name as employee_name,
        cc.client_id,
        c.client_name,
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
        cc.is_active,
        cc.created_at,
        cc.updated_at,
        cc.created_by,
        cc.updated_by
      FROM clients_contact cc
      LEFT JOIN client c ON c.id = cc.client_id
      LEFT JOIN employees e ON e.id = cc.emp_id
      LEFT JOIN lookup city_lookup ON city_lookup.id = cc.city AND city_lookup.key = 'city'
      LEFT JOIN lookup state_lookup ON state_lookup.id = cc.state AND state_lookup.key = 'state'
      LEFT JOIN lookup region_lookup ON region_lookup.id = cc.region AND region_lookup.key = 'region'
      ${whereClause}
      ORDER BY cc.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const result = await query(contactsQuery, params);

    return successResponse({
      contacts: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, '', origin);
  } catch (error: any) {
    console.error('Error fetching client contacts:', error);
    if (error.message?.includes('Database connection failed')) {
      return errorResponse(error.message, 503, origin);
    }
    return errorResponse('Failed to fetch client contacts', 500, origin);
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

// POST /api/admin/clients/contacts - Create new client contact
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const body: CreateClientContactDto = await request.json();
    
    // Validate required fields
    // Note: created_by is optional (nullable) to support mock authentication
    if (!body.client_id || !body.primary_contact_number) {
      return errorResponse('Missing required fields: client_id, primary_contact_number', 400, origin);
    }

    // Map city, state, region from names to UUIDs if provided as text
    let cityId = body.city;
    let stateId = body.state;
    let regionId = body.region;

    if (cityId && typeof cityId === 'string' && !cityId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const cityResult = await query(
        `SELECT id FROM lookup WHERE LOWER(name) = LOWER($1) AND key = 'city' AND is_active = true LIMIT 1`,
        [cityId]
      );
      if (cityResult.rows.length > 0) {
        cityId = cityResult.rows[0].id;
      } else {
        cityId = undefined;
      }
    }

    if (stateId && typeof stateId === 'string' && !stateId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const stateResult = await query(
        `SELECT id FROM lookup WHERE LOWER(name) = LOWER($1) AND key = 'state' AND is_active = true LIMIT 1`,
        [stateId]
      );
      if (stateResult.rows.length > 0) {
        stateId = stateResult.rows[0].id;
      } else {
        stateId = undefined;
      }
    }

    if (regionId && typeof regionId === 'string' && !regionId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const regionResult = await query(
        `SELECT id FROM lookup WHERE LOWER(name) = LOWER($1) AND key = 'region' AND is_active = true LIMIT 1`,
        [regionId]
      );
      if (regionResult.rows.length > 0) {
        regionId = regionResult.rows[0].id;
      } else {
        regionId = undefined;
      }
    }

    const insertQuery = `
      INSERT INTO clients_contact (
        emp_id, client_id, contact_name, primary_contact_number,
        secondary_contact_number, primary_email, secondary_email,
        address, city, state, pincode, latitude, longitude,
        region, branch, created_by, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, client_id, contact_name, primary_contact_number, created_at
    `;

    const result = await query(insertQuery, [
      sanitizeUUID(body.emp_id) || null,
      body.client_id,
      body.contact_name || null,
      body.primary_contact_number,
      body.secondary_contact_number || null,
      body.primary_email || null,
      body.secondary_email || null,
      body.address || null,
      cityId || null,
      stateId || null,
      body.pincode || null,
      body.latitude || null,
      body.longitude || null,
      regionId || null,
      body.branch || null, // Store as text, not UUID
      sanitizeUUID(body.created_by) || null, // Sanitize UUID - set to null if not valid
      true, // is_active default
    ]);

    return successResponse(result.rows[0], 'Client contact created successfully', origin);
  } catch (error: any) {
    console.error('Error creating client contact:', error);

    if (error.code === '23505') { // Unique violation
      return errorResponse('Contact number already exists for this client.', 409, origin);
    }
    if (error.code === '23503') { // Foreign key violation
      return errorResponse('Invalid reference (client, employee, branch, or lookup does not exist).', 400, origin);
    }
    if (error.message?.includes('Database connection failed')) {
      return errorResponse(error.message, 503, origin);
    }
    return errorResponse(error.message || 'Failed to create client contact', 500, origin);
  }
}

