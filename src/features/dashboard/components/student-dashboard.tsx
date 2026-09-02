"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CircleSlash,
  Radio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, PageShell } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { EmptyState, ErrorState } from "@/components/common/states";
import { useCurrentUser, useSession } from "@/features/auth/api/auth-api";
import {
  useActiveCourses,
  useRegisteredCourses,
} from "@/features/courses/api/courses-api";

function attendanceRate(attended?: number, total?: number) {
  if (!total || total <= 0) return "--";
  return `${Math.round((attended ?? 0) / total * 100)}%`;
}

export function StudentDashboard() {
  const { data: session } = useSession();
  const { data: user, isLoading: userLoading } = useCurrentUser(
    Boolean(session?.authenticated)
  );
  const active = useActiveCourses();
  const registered = useRegisteredCourses();

  const activeCourses = active.data ?? [];

  return (
    <PageShell width="wide">
      <PageHeader
        title={
          userLoading
            ? "Welcome back"
            : `Welcome back, ${user?.matricNumber ?? "student"}`
        }
        description={new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />

      {/*
        These come from the user record. The Vite dashboard derived "Attended"
        from `activeCourses.filter(c => !c.isActive).length`, which counted
        inactive courses and had nothing to do with attendance.
      */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered"
          value={registered.isLoading ? "--" : (registered.data ?? []).length}
          hint="Courses this semester"
          icon={BookOpen}
        />
        <StatCard
          label="Classes attended"
          value={userLoading ? "--" : (user?.attended ?? 0)}
          hint={`of ${user?.totalClasses ?? 0} held`}
          icon={CalendarCheck}
        />
        <StatCard
          label="Missed"
          value={userLoading ? "--" : (user?.absent ?? 0)}
          hint="Classes not attended"
          icon={CircleSlash}
        />
        <StatCard
          label="Attendance rate"
          value={
            userLoading
              ? "--"
              : attendanceRate(user?.attended, user?.totalClasses)
          }
          hint="Across all courses"
          icon={Radio}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2>Open for attendance</h2>
          {activeCourses.length > 0 && (
            <Badge variant="success" className="gap-1.5">
              <Radio className="h-3 w-3 animate-pulse" />
              {activeCourses.length} live
            </Badge>
          )}
        </div>

        {active.isError ? (
          <ErrorState description="We could not load your active sessions." />
        ) : active.isLoading ? (
          <div className="space-y-3">
            {[0, 1].map((index) => (
              <Skeleton key={index} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : activeCourses.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="Nothing open right now"
            description="When a lecturer starts a session for one of your courses, it will appear here."
            action={
              <Button asChild size="sm" variant="outline">
                <Link href="/all-courses">View my courses</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {activeCourses.map((course) => (
              <Link
                key={course.courseId}
                href={`/course/${course.courseId}`}
                className="block rounded-xl outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="shadow-none transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                      {course.courseName.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{course.courseName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {course.courseTitle}
                      </p>
                      {course.venueName && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {course.venueName}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
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
