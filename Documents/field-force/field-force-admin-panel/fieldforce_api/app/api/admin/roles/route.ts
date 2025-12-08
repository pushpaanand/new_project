import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// GET /api/admin/roles - Get all active roles
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const rolesQuery = `
      SELECT 
        id,
        name,
        is_active
      FROM roles
      WHERE is_active = true
      ORDER BY name ASC
    `;

    const result = await query(rolesQuery, []);

    return successResponse(result.rows, '', origin);
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    
    if (error.message?.includes('Database connection failed') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch roles', 500, origin);
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
