import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Session, User } from "../types";

export const authKeys = {
  session: ["auth", "session"] as const,
  user: ["auth", "user"] as const,
};

/** Raw fetcher, shared by the hook and by imperative post-login reads. */
export async function fetchSession(): Promise<Session> {
  return (await api.get<Session>("/auth/session")).data;
}

/** Current cookie session as reported by the BFF. Never 401s. */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: fetchSession,
    staleTime: 5 * 60_000,
  });
}

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () =>
      (await api.get<{ user: User }>("/backend/user-details")).data.user,
    enabled,
  });
}

/** Trades an OAuth token for an httpOnly session cookie. */
export function useExchangeToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) =>
      (await api.post<Session>("/auth/session", { token })).data,
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session, session);
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => (await api.delete<Session>("/auth/session")).data,
    onSuccess: () => queryClient.clear(),
  });
}
