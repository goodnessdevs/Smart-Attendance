// Server-only configuration, validated at import time so a misconfigured
// deployment fails at boot instead of 500-ing on the first request.
//
// NOTE: none of these are NEXT_PUBLIC_. The backend URL and the OAuth URL stay
// on the server; the browser only ever talks to this app's own /api routes.
import { z } from "zod";

const serverSchema = z.object({
  BACKEND_URL: z.url(),
  GOOGLE_AUTH_URL: z.url(),
  SESSION_COOKIE_NAME: z.string().min(1).default("smartendance_session"),
});

const parsed = serverSchema.safeParse({
  BACKEND_URL: process.env.BACKEND_URL,
  GOOGLE_AUTH_URL: process.env.GOOGLE_AUTH_URL,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
});

if (!parsed.success) {
  throw new Error(
    `Invalid server environment:\n${z.prettifyError(parsed.error)}`
  );
}

export const env = parsed.data;
