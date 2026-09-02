"use client";

import { Loader2, LogOut, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, PageShell } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { useCurrentUser, useSession } from "@/features/auth/api/auth-api";
import { useLogoutAction } from "@/features/auth/components/logout-button";
import { initialsFrom } from "@/features/auth/components/user-avatar";
import type { Role } from "@/features/auth/types";

/**
 * Guards against the divide-by-zero the Vite account page had: a brand-new
 * student with no classes yet rendered the literal string "NaN".
 */
function attendanceRate(attended = 0, absent = 0) {
  const total = attended + absent;
  if (total <= 0) return null;
  return Math.round((attended / total) * 100);
}

export function AccountView({ role }: { role: Role }) {
  const { data: session } = useSession();
  const { data: user, isLoading } = useCurrentUser(
    Boolean(session?.authenticated)
  );
  const { logout, isPending } = useLogoutAction();

  const rate = attendanceRate(user?.attended, user?.absent);

  return (
    <PageShell width="default">
      <PageHeader
        title="Account"
        description="Your profile and session details."
      />

      <Card className="shadow-none">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          {isLoading ? (
            <Skeleton className="h-16 w-16 rounded-full" />
          ) : (
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePic} alt="" />
              <AvatarFallback className="text-lg">
                {initialsFrom(user?.fullName)}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">{user?.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {role === "student"
                    ? (user?.matricNumber ?? "No matric number")
                    : (user?.email ?? "")}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {role === "student" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Attended"
            value={isLoading ? "--" : (user?.attended ?? 0)}
          />
          <StatCard
            label="Missed"
            value={isLoading ? "--" : (user?.absent ?? 0)}
          />
          <StatCard
            label="Attendance rate"
            value={isLoading ? "--" : rate === null ? "--" : `${rate}%`}
            hint={rate === null ? "No classes recorded yet" : undefined}
          />
        </div>
      )}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <DetailRow label="Full name" value={user?.fullName} loading={isLoading} />
          <DetailRow label="Email" value={user?.email} loading={isLoading} icon={Mail} />
          <DetailRow
            label="Phone"
            value={user?.phoneNumber}
            loading={isLoading}
            icon={Phone}
          />
          <DetailRow label="College" value={user?.college} loading={isLoading} />
          {role === "student" && (
            <>
              <DetailRow
                label="Department"
                value={user?.department}
                loading={isLoading}
              />
              <DetailRow label="Level" value={user?.level} loading={isLoading} />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Sign out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You will need to sign in with Google again to get back in.
          </p>
          <Separator />
          <Button
            variant="destructive"
            onClick={logout}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isPending ? "Signing out..." : "Sign out"}
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function DetailRow({
  label,
  value,
  loading,
  icon: Icon,
}: {
  label: string;
  value?: string;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <span className="text-sm font-medium">{value || "Not set"}</span>
      )}
    </div>
  );
}
