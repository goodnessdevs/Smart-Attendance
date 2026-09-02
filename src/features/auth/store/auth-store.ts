import { create } from "zustand";
import { ANONYMOUS_SESSION, type Session, type User } from "../types";

type AuthState = {
  session: Session;
  user: User | null;
  /** False until the first /api/auth/session response lands. */
  isHydrated: boolean;
  setSession: (session: Session) => void;
  setUser: (user: User | null) => void;
  reset: () => void;
};

/**
 * Session flags and the current user profile.
 *
 * Deliberately holds no token: the JWT is in an httpOnly cookie and is never
 * visible to client code.
 */
export const useAuthStore = create<AuthState>((set) => ({
  session: ANONYMOUS_SESSION,
  user: null,
  isHydrated: false,
  setSession: (session) => set({ session, isHydrated: true }),
  setUser: (user) => set({ user }),
  reset: () => set({ session: ANONYMOUS_SESSION, user: null, isHydrated: true }),
}));
