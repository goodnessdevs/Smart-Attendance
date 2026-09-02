"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { BACKEND_ORIGIN } from "@/config/public-env";
import { authKeys, fetchSession, useExchangeToken, useLogout } from "../api/auth-api";
import { landingPathForSession } from "../utils";
import type { Role, Session } from "../types";

function sessionHasRole(session: Session, role: Role) {
  if (role === "admin") return session.isAdmin;
  if (role === "lecturer") return session.isLecturer;
  return !session.isAdmin && !session.isLecturer;
}

const DENIED_MESSAGE: Record<Role, string> = {
  admin: "Access denied. Admin privileges required.",
  lecturer: "Access denied. Lecturer privileges required.",
  student: "This sign-in is for students. Use the staff portal instead.",
};

/**
 * Drives the Google OAuth popup for all three login pages.
 *
 * Two message shapes are accepted:
 *   - same-origin `smartendance:auth` from /api/auth/callback, where the cookie
 *     is already set and the token never touched client JS (preferred);
 *   - `{ token }` from the backend's own origin, the current flow, which is
 *     exchanged for a cookie immediately and never persisted.
 */
export function useGoogleSignIn(requiredRole?: Role) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const exchange = useExchangeToken();
  const logout = useLogout();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(() => {
    setError(null);
    setIsPending(true);
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      "/api/auth/login",
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  }, []);

  useEffect(() => {
    async function settle(session: Session) {
      if (requiredRole && !sessionHasRole(session, requiredRole)) {
        await logout.mutateAsync().catch(() => undefined);
        setError(DENIED_MESSAGE[requiredRole]);
        setIsPending(false);
        return;
      }
      router.replace(landingPathForSession(session));
    }

    async function onMessage(event: MessageEvent) {
      const sameOrigin = event.origin === window.location.origin;
      const fromBackend =
        BACKEND_ORIGIN !== "" && event.origin === BACKEND_ORIGIN;
      if (!sameOrigin && !fromBackend) return;

      const data = event.data as
        | { type?: string; ok?: boolean; message?: string; token?: string }
        | null;
      if (!data || typeof data !== "object") return;

      try {
        if (data.type === "smartendance:auth") {
          if (!data.ok) {
            setError(data.message ?? "Authentication failed. Please try again.");
            setIsPending(false);
            return;
          }
          // Cookie is already set by the callback route.
          await settle(
            await queryClient.fetchQuery({
              queryKey: authKeys.session,
              queryFn: fetchSession,
            })
          );
          return;
        }

        if (typeof data.token === "string" && data.token.length > 0) {
          await settle(await exchange.mutateAsync(data.token));
        }
      } catch {
        setError("Authentication failed. Please try again.");
        setIsPending(false);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [exchange, logout, queryClient, requiredRole, router]);

  return { signIn, isPending, error, retry: signIn };
}
