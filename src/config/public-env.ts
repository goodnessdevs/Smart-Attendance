// Client-visible configuration. Nothing secret belongs here: every value is
// inlined into the browser bundle at build time.

/**
 * Origin of the upstream backend, used *only* to validate postMessage events
 * coming from the OAuth popup. Not a secret, and the session token never
 * persists on the client regardless.
 *
 * Once the backend's OAuth redirect points at /api/auth/callback, the popup
 * becomes same-origin and this can be deleted.
 */
export const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN ?? "";
