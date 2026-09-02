import "server-only";
import { cookies } from "next/headers";
import { env } from "@/config/env";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * The session JWT lives in an httpOnly cookie. Client JS can never read it,
 * which is the whole point: an XSS bug can no longer walk off with a token
 * the way it could when this was in localStorage.
 */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(env.SESSION_COOKIE_NAME)?.value ?? null;
}

export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "lax" rather than "strict": the OAuth popup navigates back to us, and a
    // strict cookie would not be sent on that top-level cross-site redirect.
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionToken(): Promise<void> {
  const store = await cookies();
  store.delete(env.SESSION_COOKIE_NAME);
}
