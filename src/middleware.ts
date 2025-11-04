import { NextRequest, NextResponse } from 'next/server';
import { getCSPForEnvironment } from './lib/csp';

/**
 * Middleware to add Content Security Policy headers for HQ Rentals iframe integration
 * This runs on all requests and adds appropriate CSP headers without modifying existing functionality
 */
export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();
  
  try {
    // Add CSP header for iframe security
    const cspHeader = getCSPForEnvironment();
    response.headers.set('Content-Security-Policy', cspHeader);
    
    // Add additional security headers (best practices)
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // For HQ Rentals iframe integration, we need to allow embedding
    // but only from our own domain and HQ Rentals domains
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || '';
    
    // Allow CORS for HQ Rentals API endpoints
    if (url.pathname.startsWith('/api/hq/') || url.pathname.startsWith('/api/webhooks/hq')) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    
    // Handle preflight requests for CORS
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
    
  } catch (error) {
    // If CSP configuration fails, log the error but don't break the app
    console.error('CSP Middleware Error:', error);
    
    // Fallback to basic security headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }
  
  return response;
}

/**
 * Configure middleware to run on specific paths
 * We want CSP on all pages but CORS only on API routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
