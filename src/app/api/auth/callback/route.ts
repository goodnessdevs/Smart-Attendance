import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend";
import { setSessionToken } from "@/lib/server/session";

/**
 * Server-side OAuth landing page for the popup.
 *
 * The current backend hands the token to the opener via postMessage, which
 * means it briefly passes through client JS (see features/auth/hooks). Point
 * the backend's OAuth redirect at this route instead and the token goes
 * straight from the backend into an httpOnly cookie, never touching JS at all.
 */
function popupResponse(ok: boolean, message?: string) {
  const payload = JSON.stringify({ type: "smartendance:auth", ok, message });
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Signing in…</title>
<body><p>${ok ? "Signed in. You can close this window." : "Sign-in failed."}</p>
<script>
  try { window.opener && window.opener.postMessage(${payload}, window.location.origin); } catch (e) {}
  window.close();
</script></body>`,
    { status: ok ? 200 : 401, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return popupResponse(false, "No token supplied");

  try {
    // Verify before trusting: never set a session cookie for a token the
    // backend does not recognise.
    await backendFetch("check-status", token);
  } catch {
    return popupResponse(false, "Invalid token");
  }

  await setSessionToken(token);
  return popupResponse(true);
}
