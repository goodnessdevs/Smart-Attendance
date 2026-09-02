import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { backendFetch } from "./backend";
import { clearSessionToken, getSessionToken } from "./session";
import {
  ANONYMOUS_SESSION,
  type Role,
  type Session,
} from "@/features/auth/types";

/**
 * The current session, resolved against the backend.
 *
 * Wrapped in React's `cache` so several layouts/pages in one render share a
 * single upstream round trip.
 */
export const getServerSession = cache(async (): Promise<Session> => {
  const token = await getSessionToken();
  if (!token) return ANONYMOUS_SESSION;

  try {
    const [status, dashboard] = await Promise.all([
      backendFetch<{ isLecturer?: boolean; isAdmin?: boolean }>(
        "check-status",
        token
      ),
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
  } catch {
    return ANONYMOUS_SESSION;
  }
});

function sessionHasRole(session: Session, role: Role) {
  if (role === "admin") return session.isAdmin;
  if (role === "lecturer") return session.isLecturer;
  return !session.isAdmin && !session.isLecturer;
}

const LOGIN_PATH: Record<Role, string> = {
  admin: "/admin/login",
  lecturer: "/lecturer/login",
  student: "/login",
};

const ONBOARDING_PATH: Partial<Record<Role, string>> = {
  lecturer: "/lecturer/onboarding",
  student: "/onboarding",
};

/**
 * Guards a protected area. Redirects rather than throwing, so an unauthorised
 * visitor lands somewhere sensible instead of on an error page.
 */
export async function requireRole(role: Role): Promise<Session> {
  const session = await getServerSession();

  if (!session.authenticated) {
    // Stale or rejected cookie — drop it so the login page starts clean.
    await clearSessionToken().catch(() => undefined);
    redirect(LOGIN_PATH[role]);
  }

  if (!sessionHasRole(session, role)) {
    redirect(LOGIN_PATH[role]);
  }

  const onboardingPath = ONBOARDING_PATH[role];
  if (onboardingPath && !session.onboarded) {
    redirect(onboardingPath);
  }

  return session;
}
