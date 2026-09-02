import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch } from "@/lib/server/backend";
import {
  clearSessionToken,
  getSessionToken,
  setSessionToken,
} from "@/lib/server/session";
import { ANONYMOUS_SESSION, type Session } from "@/features/auth/types";

/** Ask the upstream backend what this token is actually allowed to do. */
async function resolveSession(token: string): Promise<Session> {
  const [status, dashboard] = await Promise.all([
    backendFetch<{ isLecturer?: boolean; isAdmin?: boolean }>(
      "check-status",
      token
    ),
    // Lecturers and admins have no onboarding gate; treat a failure here as
    // "already onboarded" rather than blocking sign-in on it.
    backendFetch<{ onboarded?: boolean }>("dashboard", token).catch(() => ({
      onboarded: true,
    })),
  ]);

  return {
    authenticated: true,
    isLecturer: status.isLecturer ?? false,
    isAdmin: status.isAdmin ?? false,
    onboarded: dashboard.onboarded ?? false,
  };
}

/** Current session state, for hydrating the client store. */
export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json(ANONYMOUS_SESSION, { status: 200 });

  try {
    return NextResponse.json(await resolveSession(token));
  } catch {
    // Token is stale or the backend rejected it: drop the cookie so the user
    // isn't stuck in a half-authenticated state.
    await clearSessionToken();
    return NextResponse.json(ANONYMOUS_SESSION, { status: 200 });
  }
}

const exchangeSchema = z.object({ token: z.string().min(1) });

/**
 * Exchanges a freshly-issued OAuth token for an httpOnly session cookie.
 * The token is verified against the backend before we trust it.
 */
export async function POST(request: NextRequest) {
  const parsed = exchangeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "A token is required" }, { status: 400 });
  }

  let session: Session;
  try {
    session = await resolveSession(parsed.data.token);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  await setSessionToken(parsed.data.token);
  return NextResponse.json(session);
}

export async function DELETE() {
  await clearSessionToken();
  return NextResponse.json(ANONYMOUS_SESSION);
}
