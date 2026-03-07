import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminSessionToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const expectedSession = getAdminSessionToken();

  if (session?.value === expectedSession) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
