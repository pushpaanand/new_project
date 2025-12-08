import { NextRequest } from 'next/server';
import { query, sanitizeUUID } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// GET /api/admin/employees/devices/[id] - Get device by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const deviceQuery = `
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
      WHERE ed.id::text = $1 OR ed.id = $1
    `;

    const result = await query(deviceQuery, [params.id]);

    if (result.rows.length === 0) {
      return errorResponse('Device not found', 404, origin);
    }

    return successResponse(result.rows[0], '', origin);
  } catch (error: any) {
    console.error('Error fetching device:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch device', 500, origin);
  }
}

// OPTIONS handler for CORS preflight
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

// PUT /api/admin/employees/devices/[id] - Update device
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const body = await request.json();

    // Check if device exists
    const existingCheck = await query(
      'SELECT id FROM employee_devices WHERE id::text = $1 OR id = $1',
      [params.id]
    );

    if (existingCheck.rows.length === 0) {
      return errorResponse('Device not found', 404, origin);
    }

    const deviceId = existingCheck.rows[0].id;

    // Build update query dynamically
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['imei', 'device_make', 'device_os', 'model', 'is_active', 'updated_by'];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'updated_by') {
          const sanitizedValue = sanitizeUUID(body[field] as string);
          if (sanitizedValue !== null || body[field] === null) {
            updateFields.push(`${field} = $${paramIndex}`);
            values.push(sanitizedValue);
            paramIndex++;
          }
        } else {
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(body[field]);
          paramIndex++;
        }
      }
    }

    if (updateFields.length === 0) {
      return errorResponse('No fields to update', 400, origin);
    }

    // Add updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add device id for WHERE clause
    values.push(deviceId);

    const updateQuery = `
      UPDATE employee_devices
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, employee_id, imei, device_make, device_os, model, is_active, updated_at
    `;

    const result = await query(updateQuery, values);

    return successResponse(result.rows[0], 'Device updated successfully', origin);
  } catch (error: any) {
    console.error('Error updating device:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse(error.message || 'Failed to update device', 500, origin);
  }
}

// DELETE /api/admin/employees/devices/[id] - Soft delete device (set is_active = false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    // Check if device exists
    const existingCheck = await query(
      'SELECT id FROM employee_devices WHERE id::text = $1 OR id = $1',
      [params.id]
    );

    if (existingCheck.rows.length === 0) {
      return errorResponse('Device not found', 404, origin);
    }

    const deviceId = existingCheck.rows[0].id;

    // Soft delete (set is_active = false)
    const deleteQuery = `
      UPDATE employee_devices
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, employee_id, imei, device_make, model
    `;

    const result = await query(deleteQuery, [deviceId]);

    return successResponse(result.rows[0], 'Device deactivated successfully', origin);
  } catch (error: any) {
    console.error('Error deleting device:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to delete device', 500, origin);
  }
}

