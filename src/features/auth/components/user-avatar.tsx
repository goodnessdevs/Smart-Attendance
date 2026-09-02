"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useSession } from "../api/auth-api";

export function initialsFrom(fullName?: string | null) {
  if (!fullName) return "U";
  return fullName
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

/**
 * Compact identity chip for the header bar.
 *
 * The Vite version positioned this with `float-right relative right-20
 * bottom-10`, which overlapped page content at some widths, and rebuilt its
 * motion component on every render.
 */
export function UserAvatar() {
  const { data: session } = useSession();
  const { data: user, isLoading } = useCurrentUser(
    Boolean(session?.authenticated)
  );

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm font-medium sm:inline-block max-w-[16ch] truncate">
        {user.fullName}
      </span>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.profilePic} alt="" />
        <AvatarFallback className="text-xs">
          {initialsFrom(user.fullName)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
