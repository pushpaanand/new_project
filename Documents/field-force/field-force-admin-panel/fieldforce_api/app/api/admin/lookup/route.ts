import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// GET /api/admin/lookup - Get lookup values by key (e.g., 'gender', 'jobtitle')
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key'); // e.g., 'gender', 'jobtitle'

    if (!key) {
      return errorResponse('Key parameter is required (e.g., ?key=gender or ?key=jobtitle)', 400, origin);
    }

    const lookupQuery = `
      SELECT 
        id,
        name,
        key,
        is_active
      FROM lookup
      WHERE key = $1 AND is_active = true
      ORDER BY name ASC
    `;

    const result = await query(lookupQuery, [key]);

    return successResponse(result.rows, '', origin);
  } catch (error: any) {
    console.error('Error fetching lookup data:', error);
    
    if (error.message?.includes('Database connection failed') || 
        error.message?.includes('timeout') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT') {
      return errorResponse('Database connection failed. Please check your database connection and try again.', 503, origin);
    }
    
    return errorResponse('Failed to fetch lookup data', 500, origin);
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

