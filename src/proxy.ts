import { NextRequest, NextResponse } from "next/server";

/**
 * Paths reachable without a session. Everything else requires the session
 * cookie to at least be present.
 *
 * This is a fast cookie-presence check only — it cannot tell a student from an
 * admin. Role enforcement happens in each area's layout via requireRole(), and
 * the real security boundary is the backend, which must re-check every request.
 */
const PUBLIC_PATHS = new Set([
  "/",
  "/lecturer",
  "/admin",
  "/login",
  "/lecturer/login",
  "/admin/login",
]);

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "smartendance_session";

function loginPathFor(pathname: string) {
  if (pathname.startsWith("/lecturer")) return "/lecturer/login";
  if (pathname.startsWith("/admin")) return "/admin/login";
  return "/login";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();
  if (request.cookies.has(COOKIE_NAME)) return NextResponse.next();

  const loginUrl = new URL(loginPathFor(pathname), request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Everything except Next internals, the API routes (which do their own auth)
  // and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\.).*)"],
};
