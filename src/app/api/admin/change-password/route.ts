import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setAdminPassword, verifyAdminPassword } from "@/lib/admin-auth";
import { getAdminSessionToken } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const expectedSession = getAdminSessionToken();

  if (session?.value !== expectedSession) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword, confirmPassword } = await request.json();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ success: false, message: "New passwords do not match" }, { status: 400 });
  }

  if (String(newPassword).length < 6) {
    return NextResponse.json({ success: false, message: "New password must be at least 6 characters" }, { status: 400 });
  }

  const currentOk = await verifyAdminPassword(String(currentPassword));
  if (!currentOk) {
    return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 401 });
  }

  await setAdminPassword(String(newPassword));
  return NextResponse.json({ success: true });
}
