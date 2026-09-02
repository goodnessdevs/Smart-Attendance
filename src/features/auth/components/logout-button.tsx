"use client";

import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { useLogout } from "../api/auth-api";

type Props = {
  /** Render prop so sidebar / mobile nav / account page can style it. */
  children?: (state: { isPending: boolean }) => React.ReactNode;
  className?: string;
  onDone?: () => void;
};

export function useLogoutAction(onDone?: () => void) {
  const router = useRouter();
  const logout = useLogout();

  return {
    isPending: logout.isPending,
    logout: async () => {
      await logout.mutateAsync().catch(() => undefined);
      onDone?.();
      // replace() so Back doesn't land on an authenticated page.
      router.replace("/");
      router.refresh();
    },
  };
}

export function LogoutButton({ children, className, onDone }: Props) {
  const { logout, isPending } = useLogoutAction(onDone);

  return (
    <button type="button" onClick={logout} disabled={isPending} className={className}>
      {children?.({ isPending }) ?? (
        <span className="flex items-center gap-x-2">
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          <span>{isPending ? "Logging out…" : "Log out"}</span>
        </span>
      )}
    </button>
  );
}
