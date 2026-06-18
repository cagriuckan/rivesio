import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Edge-compatible auth gate. Cannot import ./lib/env here (uses node:path),
// so read the secret directly from process.env.
const COOKIE_NAME = "kf_session";

async function isValid(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "dev-insecure-secret-change-me"
    );
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const authed = await isValid(token);

  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (isAdminApi && !authed) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Protected admin pages.
  const isProtectedPage =
    pathname === "/" ||
    pathname.startsWith("/feedbacks") ||
    pathname.startsWith("/sites") ||
    pathname.startsWith("/projects");

  if (isProtectedPage && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Already logged in: keep them out of the login page.
  if (pathname === "/login" && authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/feedbacks/:path*", "/sites/:path*", "/projects/:path*", "/api/admin/:path*"],
};
