import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection and authentication
 * This runs before requests are processed
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add any protected routes here
  const protectedPaths = ['/admin', '/profile', '/orders'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // For now, just log the request (extend with NextAuth when ready)
  if (isProtectedPath) {
    // TODO: Add NextAuth session check here
    // const session = await getToken({ req: request });
    // if (!session) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
