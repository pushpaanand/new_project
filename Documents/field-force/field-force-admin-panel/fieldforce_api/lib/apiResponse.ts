import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper to add CORS headers to response
function addCorsHeaders<T = any>(response: NextResponse<T>, origin?: string | null): NextResponse<T> {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
  ];

  // Only set CORS headers if they're not already set (to avoid duplicates)
  if (!response.headers.has('Access-Control-Allow-Origin')) {
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return response;
}

export function successResponse<T>(
  data: T, 
  message?: string | null, 
  origin?: string | null
): NextResponse<ApiResponse<T>> {
  const response = NextResponse.json({
    success: true,
    data,
    message: message || undefined,
  });
  
  return addCorsHeaders(response, origin);
}

export function errorResponse(
  error: string | Error,
  status: number = 500,
  origin?: string | null
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : error;
  
  const response = NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status }
  );
  
  return addCorsHeaders(response, origin);
}

export function validationErrorResponse(errors: Record<string, string[]>, origin?: string | null): NextResponse<ApiResponse> {
  const response = NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      data: errors,
    },
    { status: 400 }
  );
  
  return addCorsHeaders(response, origin);
}

