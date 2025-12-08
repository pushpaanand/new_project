import { NextRequest, NextResponse } from 'next/server';
import { query, sanitizeUUID } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { UpdateClientContactDto } from '@/types/client';

// GET /api/admin/clients/contacts/[id] - Get client contact by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const contactQuery = `
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
      WHERE cc.id = $1
    `;

    const result = await query(contactQuery, [params.id]);

    if (result.rows.length === 0) {
      return errorResponse('Client contact not found', 404, origin);
    }

    return successResponse(result.rows[0], '', origin);
  } catch (error: any) {
    console.error('Error fetching client contact:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch client contact', 500, origin);
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

// PUT /api/admin/clients/contacts/[id] - Update client contact
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const body: UpdateClientContactDto = await request.json();

    // Check if contact exists
    const existingCheck = await query(
      'SELECT id FROM clients_contact WHERE id = $1',
      [params.id]
    );

    if (existingCheck.rows.length === 0) {
      return errorResponse('Client contact not found', 404, origin);
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

    // Build update query dynamically
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields: (keyof UpdateClientContactDto)[] = [
      'emp_id', 'client_id', 'contact_name', 'primary_contact_number',
      'secondary_contact_number', 'primary_email', 'secondary_email',
      'address', 'pincode', 'latitude', 'longitude', 'branch',
      'is_active', 'updated_by'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Sanitize UUID fields (emp_id, client_id, updated_by) - set to null if not valid UUID
        if (field === 'emp_id' || field === 'client_id' || field === 'updated_by') {
          const sanitizedValue = sanitizeUUID(body[field] as string);
          if (sanitizedValue !== null || body[field] === null) {
            updateFields.push(`${field} = $${paramIndex}`);
            values.push(sanitizedValue);
            paramIndex++;
          }
          // If invalid UUID, skip the field (don't update it)
        } else {
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(body[field]);
          paramIndex++;
        }
      }
    }

    // Handle city, state, region separately
    if (cityId !== undefined) {
      updateFields.push(`city = $${paramIndex}`);
      values.push(cityId);
      paramIndex++;
    }

    if (stateId !== undefined) {
      updateFields.push(`state = $${paramIndex}`);
      values.push(stateId);
      paramIndex++;
    }

    if (regionId !== undefined) {
      updateFields.push(`region = $${paramIndex}`);
      values.push(regionId);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return errorResponse('No fields to update', 400, origin);
    }

    // Add updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add contact id for WHERE clause
    values.push(params.id);

    const updateQuery = `
      UPDATE clients_contact
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, client_id, contact_name, primary_contact_number, updated_at
    `;

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return errorResponse('Client contact not found or no changes made', 404, origin);
    }

    return successResponse(result.rows[0], 'Client contact updated successfully', origin);
  } catch (error: any) {
    console.error('Error updating client contact:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    if (error.code === '23503') { // Foreign key violation
      return errorResponse('Invalid reference (client, employee, branch, or lookup does not exist).', 400, origin);
    }
    
    return errorResponse(error.message || 'Failed to update client contact', 500, origin);
  }
}

// DELETE /api/admin/clients/contacts/[id] - Soft delete client contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const result = await query(
      `UPDATE clients_contact SET is_active = false, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING id, client_id, contact_name, is_active`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse('Client contact not found', 404, origin);
    }

    return successResponse(result.rows[0], 'Client contact deactivated successfully', origin);
  } catch (error: any) {
    console.error('Error deleting client contact:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to delete client contact', 500, origin);
  }
}

