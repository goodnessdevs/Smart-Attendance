"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Radio, Upload, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, PageShell } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { EmptyState, ErrorState } from "@/components/common/states";
import { useCurrentUser, useSession } from "@/features/auth/api/auth-api";
import {
  useLecturerActiveCourses,
  useLecturerCourses,
} from "@/features/courses/api/courses-api";

export function LecturerDashboard() {
  const { data: session } = useSession();
  const { data: user } = useCurrentUser(Boolean(session?.authenticated));

  // React Query owns the loading state here. The Vite page guarded its fetch
  // with `if (token)` and left `loading` true when there was no token, so the
  // page could sit on a spinner forever.
  const active = useLecturerActiveCourses();
  const mine = useLecturerCourses();

  const liveSessions = active.data ?? [];

  return (
    <PageShell width="wide">
      <PageHeader
        title={user?.fullName ? `Hello, ${user.fullName}` : "Hello"}
        description="Publish attendance, monitor who turned up, and manage your courses."
        actions={
          <Button asChild size="sm" className="gap-2">
            <Link href="/lecturer/publish-attendance">
              <Upload className="h-4 w-4" />
              Publish attendance
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="My courses"
          value={mine.isLoading ? "--" : (mine.data ?? []).length}
          hint="Courses you teach"
          icon={BookOpen}
        />
        <StatCard
          label="Live sessions"
          value={active.isLoading ? "--" : liveSessions.length}
          hint="Open for marking now"
          icon={Radio}
        />
      </div>

      <section className="space-y-4">
        <h2>Live sessions</h2>

        {active.isError ? (
          <ErrorState description="We could not load your published sessions." />
        ) : active.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1].map((index) => (
              <Skeleton key={index} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : liveSessions.length === 0 ? (
          <EmptyState
            icon={Radio}
            title="No live sessions"
            description="Publish attendance for a course and students in range can start marking."
            action={
              <Button asChild size="sm" variant="outline">
                <Link href="/lecturer/publish-attendance">Publish attendance</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {liveSessions.map((course) => (
              <Link
                key={course.courseId}
                href={`/lecturer/attendance/${course.courseId}`}
                className="block rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="shadow-none transition-colors hover:border-primary/50">
                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold">{course.courseName}</span>
                      <Badge variant="success" className="gap-1">
                        <Radio className="h-3 w-3 animate-pulse" />
                        Live
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {course.courseTitle}
                    </p>
                    <p className="flex items-center gap-2 pt-1 text-xs font-medium text-primary">
                      <Users className="h-3.5 w-3.5" />
                      View register
                      <ArrowRight className="h-3.5 w-3.5" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
