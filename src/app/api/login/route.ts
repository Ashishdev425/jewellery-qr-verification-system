import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/admin-auth';
import { getAdminSessionCookieOptions, getAdminSessionToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordOk = await verifyAdminPassword(password);

    if (email === adminEmail && passwordOk) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', getAdminSessionToken(), getAdminSessionCookieOptions());
      return response;
    }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
