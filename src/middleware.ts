import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

/** Strips a leading /en or /tr, returning the locale and the locale-less path. */
function splitLocale(pathname: string): { locale: string; rest: string } {
  const match = pathname.match(/^\/(en|tr)(\/.*)?$/);
  if (match) return { locale: match[1], rest: match[2] || "/" };
  return { locale: routing.defaultLocale, rest: pathname };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Optimistic check (no DB roundtrip on edge). Real session verification
  // happens per-route via requireAdminSession().
  const authed = Boolean(getSessionCookie(req));

  // API routes are not localized: guard admin endpoints and skip intl routing.
  if (pathname.startsWith("/api")) {
    if (pathname.startsWith("/api/admin") && !authed) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const { locale, rest } = splitLocale(pathname);

  const isProtectedPage =
    rest === "/" ||
    rest.startsWith("/feedbacks") ||
    rest.startsWith("/sites") ||
    rest.startsWith("/projects") ||
    rest.startsWith("/settings");

  if (isProtectedPage && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Already logged in: keep them out of the auth pages.
  if ((rest === "/login" || rest === "/signup") && authed) {
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
