import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isMobileDevice } from './src/lib/pwa'

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if user has override cookie set
  const hasDesktopOverride = request.cookies.get('force-desktop')?.value === 'true';
  const hasMobileOverride = request.cookies.get('force-mobile')?.value === 'true';
  
  // Don't redirect if already on PWA path, admin routes, or API routes
  if (pathname.startsWith('/pwa') || pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
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
    const response = NextResponse.redirect(new URL('/pwa', request.url));
    response.cookies.set('force-mobile', 'true', { 
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true 
    });
    return response;
  }
  
  if (search.includes('force=clear')) {
    const response = NextResponse.redirect(new URL('/', request.url));
    // Clear override cookies by setting them to expire immediately
    response.cookies.set('force-desktop', '', { 
      maxAge: 0,
      httpOnly: true 
    });
    response.cookies.set('force-mobile', '', { 
      maxAge: 0,
      httpOnly: true 
    });
    return response;
  }
  
  // If mobile override is set, redirect to PWA (but not for admin routes)
  if (hasMobileOverride && !pathname.startsWith('/pwa') && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/pwa', request.url));
  }
  
  // If desktop override is set, stay on desktop
  if (hasDesktopOverride) {
    return NextResponse.next();
  }
  
  // Auto-detect mobile and redirect (only from root path to avoid redirect loops)
  // Disabled: Let users choose their preferred experience
  if (pathname === '/' && isMobileDevice(userAgent)) {
    const mobileUrl = new URL('/pwa', request.url);
    
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