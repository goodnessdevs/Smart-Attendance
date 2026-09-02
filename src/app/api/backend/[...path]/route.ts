import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { getSessionToken } from "@/lib/server/session";

/**
 * Endpoints the browser is allowed to reach through this proxy. Without an
 * allow-list this route would relay any path on the upstream API, so new
 * backend endpoints must be added here deliberately.
 */
const ALLOWED_ENDPOINTS = new Set([
  "active-courses",
  "all-courses",
  "attendance",
  "check-status",
  "courses",
  "create-course",
  "dashboard",
  "end-attendance",
  "lecturer-active-courses",
  "lecturer-courses",
  "lecturer-select",
  "mark-attendance",
  "publish-attendance",
  "register-course",
  "student-attendance",
  "update-lecturer",
  "update-profile",
  "user-details",
]);

/**
 * Attaches the session JWT to upstream calls server-side.
 *
 * This exists so the token can live in an httpOnly cookie: the browser calls
 * same-origin /api/backend/*, and only this handler ever sees the bearer token.
 * It also means CORS and 401 handling live in exactly one place.
 */
async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const endpoint = path.join("/");

  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return NextResponse.json({ message: "Unknown endpoint" }, { status: 404 });
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const init: RequestInit = {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `${env.BACKEND_URL}/${endpoint}${request.nextUrl.search}`,
      init
    );
  } catch {
    return NextResponse.json(
      { message: "The attendance service is unreachable" },
      { status: 502 }
    );
  }

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
