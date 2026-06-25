import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Edge-compatible auth gate. Cannot import ./lib/env here (uses node:path),
// so read the secret directly from process.env.
const COOKIE_NAME = "kf_session";

const intlMiddleware = createIntlMiddleware(routing);

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

/** Strips a leading /en or /tr, returning the locale and the locale-less path. */
function splitLocale(pathname: string): { locale: string; rest: string } {
  const match = pathname.match(/^\/(en|tr)(\/.*)?$/);
  if (match) return { locale: match[1], rest: match[2] || "/" };
  return { locale: routing.defaultLocale, rest: pathname };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const authed = await isValid(token);

  // API routes are not localized: guard admin endpoints and skip intl routing.
  if (pathname.startsWith("/api")) {
    const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
    if (isAdminApi && !authed) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const { locale, rest } = splitLocale(pathname);

  const isProtectedPage =
    rest === "/" ||
    rest.startsWith("/feedbacks") ||
    rest.startsWith("/sites") ||
    rest.startsWith("/projects");

  if (isProtectedPage && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Already logged in: keep them out of the login page.
  if (rest === "/login" && authed) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // Let next-intl handle locale detection, prefixing and rewrites.
  return intlMiddleware(req);
}

export const config = {
  // Run on everything except Next internals and static files (with a dot).
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
