import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS preflight (OPTIONS) requests only
  // Actual responses will have CORS headers added by apiResponse.ts functions
  if (request.nextUrl.pathname.startsWith('/api') && request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:5173', // Vite default port
    ];

    // Check if origin is allowed
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);
    
    const response = new NextResponse(null, { status: 200 });
    
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
    
    return response;
  }

  // For non-OPTIONS requests, just pass through
  // CORS headers will be added by apiResponse.ts functions
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

