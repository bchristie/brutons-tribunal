import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mobile user agent patterns
const MOBILE_USER_AGENTS = [
  /Android/i,
  /webOS/i,
  /iPhone/i,
  /iPad/i,
  /iPod/i,
  /BlackBerry/i,
  /Windows Phone/i,
  /Opera Mini/i,
  /IEMobile/i,
  /Mobile/i
];

function isMobileDevice(userAgent: string): boolean {
  return MOBILE_USER_AGENTS.some(pattern => pattern.test(userAgent));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if user has override cookie set
  const hasDesktopOverride = request.cookies.get('force-desktop')?.value === 'true';
  const hasMobileOverride = request.cookies.get('force-mobile')?.value === 'true';
  
  // Don't redirect if already on mobile path or API routes
  if (pathname.startsWith('/mobile') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // Handle explicit override requests
  if (search.includes('force=desktop')) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('force-desktop', 'true', { 
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true 
    });
    return response;
  }
  
  if (search.includes('force=mobile')) {
    const response = NextResponse.redirect(new URL('/mobile', request.url));
    response.cookies.set('force-mobile', 'true', { 
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true 
    });
    return response;
  }
  
  // If mobile override is set, redirect to mobile
  if (hasMobileOverride && !pathname.startsWith('/mobile')) {
    return NextResponse.redirect(new URL('/mobile', request.url));
  }
  
  // If desktop override is set, stay on desktop
  if (hasDesktopOverride) {
    return NextResponse.next();
  }
  
  // Auto-detect mobile and redirect (only from root path to avoid redirect loops)
  if (pathname === '/' && isMobileDevice(userAgent)) {
    const mobileUrl = new URL('/mobile', request.url);
    
    // Add a query parameter to indicate this was an auto-redirect
    mobileUrl.searchParams.set('auto-redirect', 'true');
    
    return NextResponse.redirect(mobileUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}