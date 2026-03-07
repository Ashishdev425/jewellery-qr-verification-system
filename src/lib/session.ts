export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || "true";
}

export function getAdminSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  };
}

