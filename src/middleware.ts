import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminSessionToken } from '@/lib/session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('admin_session');
  const expectedSession = getAdminSessionToken();

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session || session.value !== expectedSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect from /admin/login to /admin/dashboard if already logged in
  if (pathname === '/admin/login') {
    if (session && session.value === expectedSession) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
