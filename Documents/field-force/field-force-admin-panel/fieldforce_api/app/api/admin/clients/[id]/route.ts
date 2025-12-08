import { NextRequest, NextResponse } from 'next/server';
import { query, sanitizeUUID } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { UpdateClientDto } from '@/types/client';

// GET /api/admin/clients/[id] - Get client by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const clientQuery = `
      SELECT 
        c.id,
        c.client_name,
        c.category_id,
        c.is_active,
        c.created_at,
        c.updated_at,
        c.created_by,
        c.updated_by,
        cc.name as category_name
      FROM client c
      LEFT JOIN client_categories cc ON cc.id = c.category_id
      WHERE c.id = $1
    `;

    const result = await query(clientQuery, [params.id]);

    if (result.rows.length === 0) {
      return errorResponse('Client not found', 404, origin);
    }

    return successResponse(result.rows[0], '', origin);
  } catch (error: any) {
    console.error('Error fetching client:', error);
    
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// PUT /api/admin/clients/[id] - Update client
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const body: UpdateClientDto = await request.json();

    // Check if client exists
    const existingCheck = await query(
      'SELECT id FROM client WHERE id = $1',
      [params.id]
    );

    if (existingCheck.rows.length === 0) {
      return errorResponse('Client not found', 404, origin);
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields: (keyof UpdateClientDto)[] = [
      'client_name', 'category_id', 'is_active', 'updated_by'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Sanitize UUID fields (created_by, updated_by) - set to null if not valid UUID
        if (field === 'updated_by' || field === 'created_by') {
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

    if (updateFields.length === 0) {
      return errorResponse('No fields to update', 400, origin);
    }

    // Add updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add client id for WHERE clause
    values.push(params.id);

    const updateQuery = `
      UPDATE client
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, client_name, category_id, is_active, updated_at
    `;

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return errorResponse('Client not found or no changes made', 404, origin);
    }

    return successResponse(result.rows[0], 'Client updated successfully', origin);
  } catch (error: any) {
    console.error('Error updating client:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    if (error.code === '23503') { // Foreign key violation
      return errorResponse('Invalid category reference.', 400, origin);
    }
    
    return errorResponse(error.message || 'Failed to update client', 500, origin);
  }
}

// DELETE /api/admin/clients/[id] - Soft delete client (set is_active = false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  try {
    const result = await query(
      `UPDATE client SET is_active = false, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING id, client_name, is_active`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse('Client not found', 404, origin);
    }

    return successResponse(result.rows[0], 'Client deactivated successfully', origin);
  } catch (error: any) {
    console.error('Error deleting client:', error);
    
    if (error.message?.includes('Connection terminated') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to delete client', 500, origin);
  }
}

