import type { Session } from "./types";

/**
 * Where a freshly-authenticated session belongs.
 *
 * Single source of truth for post-login routing, so lecturers can't be dropped
 * on the student dashboard and un-onboarded users can't skip onboarding —
 * both of which happened when each login page decided this for itself.
 */
export function landingPathForSession(session: Session): string {
  if (session.isAdmin) return "/admin/dashboard";
  if (session.isLecturer) {
    return session.onboarded ? "/lecturer/dashboard" : "/lecturer/onboarding";
  }
  return session.onboarded ? "/dashboard" : "/onboarding";
}
