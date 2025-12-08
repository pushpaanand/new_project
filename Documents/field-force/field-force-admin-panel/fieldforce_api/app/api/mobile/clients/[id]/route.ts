import { NextRequest, NextResponse } from 'next/server';
import { query, sanitizeUUID } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { UpdateClientContactDto } from '@/types/client';

// GET /api/mobile/clients/[id] - Get a specific client assigned to the logged-in employee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const authHeader = request.headers.get('authorization');
    const searchParams = request.nextUrl.searchParams;
    
    // TODO: Extract employee_id from JWT token in production
    let employeeId = searchParams.get('employee_id') || request.headers.get('x-employee-id');
    
    if (!employeeId) {
      return errorResponse('Employee ID is required. Please provide employee_id in query parameter or x-employee-id header.', 400, origin);
    }
    
    const clientQuery = `
      SELECT 
        c.id,
        c.client_name,
        c.category_id,
        cc_cat.name as category_name,
        cc.id as contact_id,
        cc.emp_id,
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
        cc.updated_at
      FROM client c
      INNER JOIN clients_contact cc ON cc.client_id = c.id AND cc.emp_id = $1 AND cc.is_active = true
      LEFT JOIN client_categories cc_cat ON cc_cat.id = c.category_id
      LEFT JOIN lookup city_lookup ON city_lookup.id = cc.city AND city_lookup.key = 'city'
      LEFT JOIN lookup state_lookup ON state_lookup.id = cc.state AND state_lookup.key = 'state'
      LEFT JOIN lookup region_lookup ON region_lookup.id = cc.region AND region_lookup.key = 'region'
      WHERE c.id = $2 AND c.is_active = true
      LIMIT 1
    `;

    const result = await query(clientQuery, [employeeId, params.id]);

    if (result.rows.length === 0) {
      return errorResponse('Client not found or not assigned to you', 404, origin);
    }

    return successResponse(result.rows[0], '', origin);
  } catch (error: any) {
    console.error('Error fetching mobile client:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch client', 500, origin);
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

// PUT /api/mobile/clients/[id] - Update client contact information (for mobile app)
// Employees can only update the contact information for clients assigned to them
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const authHeader = request.headers.get('authorization');
    const body: UpdateClientContactDto = await request.json();
    
    // TODO: Extract employee_id from JWT token in production
    let employeeId = request.headers.get('x-employee-id');
    
    if (!employeeId) {
      return errorResponse('Employee ID is required. Please provide x-employee-id header.', 400, origin);
    }
    
    // First, verify that this client is assigned to this employee
    const verifyQuery = `
      SELECT cc.id as contact_id
      FROM client c
      INNER JOIN clients_contact cc ON cc.client_id = c.id AND cc.emp_id = $1 AND cc.is_active = true
      WHERE c.id = $2 AND c.is_active = true
      LIMIT 1
    `;
    
    const verifyResult = await query(verifyQuery, [employeeId, params.id]);
    
    if (verifyResult.rows.length === 0) {
      return errorResponse('Client not found or not assigned to you', 404, origin);
    }
    
    const contactId = verifyResult.rows[0].contact_id;
    
    // Build update query dynamically - only allow updating contact fields
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

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
        cityId = null;
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
        stateId = null;
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
        regionId = null;
      }
    }

    // Only allow updating contact-related fields (not client name, category, etc.)
    const allowedFields: (keyof UpdateClientContactDto)[] = [
      'contact_name', 'primary_contact_number', 'secondary_contact_number',
      'primary_email', 'secondary_email', 'address', 'city', 'state', 'pincode',
      'latitude', 'longitude', 'region', 'branch', 'updated_by'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'city') {
          updateFields.push(`city = $${paramIndex++}`);
          values.push(cityId);
        } else if (field === 'state') {
          updateFields.push(`state = $${paramIndex++}`);
          values.push(stateId);
        } else if (field === 'region') {
          updateFields.push(`region = $${paramIndex++}`);
          values.push(regionId);
        } else if (field === 'updated_by') {
          // Sanitize UUID - set to null if not valid UUID
          const sanitizedValue = sanitizeUUID(body[field] as string);
          if (sanitizedValue !== null || body[field] === null) {
            updateFields.push(`${field} = $${paramIndex++}`);
            values.push(sanitizedValue);
          }
          // If invalid UUID, skip the field (don't update it)
        } else {
          updateFields.push(`${field} = $${paramIndex++}`);
          values.push(body[field]);
        }
      }
    }

    if (updateFields.length === 0) {
      return errorResponse('No fields to update', 400, origin);
    }

    // Add updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add contact id for WHERE clause
    values.push(contactId);

    const updateQuery = `
      UPDATE clients_contact
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, client_id, contact_name, primary_contact_number, updated_at
    `;

    const result = await query(updateQuery, values);

    return successResponse(result.rows[0], 'Client contact updated successfully', origin);
  } catch (error: any) {
    console.error('Error updating mobile client:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    if (error.code === '23503') { // Foreign key violation
      return errorResponse('Invalid city, state, or region reference.', 400, origin);
    }
    
    return errorResponse(error.message || 'Failed to update client', 500, origin);
  }
}

