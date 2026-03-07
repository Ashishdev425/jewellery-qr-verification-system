import { NextResponse } from 'next/server';
import { getAdminSessionCookieOptions } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
