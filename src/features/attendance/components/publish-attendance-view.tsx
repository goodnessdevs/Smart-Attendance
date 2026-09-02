"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Radio, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, PageShell } from "@/components/common/page-header";
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/common/states";
import {
  useEndAttendance,
  useLecturerCourses,
  usePublishAttendance,
} from "@/features/courses/api/courses-api";
import type { Course } from "@/features/courses/types";

/**
 * `isActive` comes back from the API as either a boolean or the strings
 * "true"/"false". The Vite page typed it as `string` and then did a plain
 * truthiness test, so the string "false" counted as active and the wrong course
 * showed up as published.
 */
function isCourseActive(course: Course): boolean {
  const value = course.isActive as unknown;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

export function PublishAttendanceView() {
  const { data, isLoading, isError } = useLecturerCourses();
  const publish = usePublishAttendance();
  const end = useEndAttendance();
  const [courseToEnd, setCourseToEnd] = useState<Course | null>(null);

  const courses = data ?? [];
  const activeCourse = courses.find(isCourseActive) ?? null;

  return (
    <PageShell width="wide">
      <PageHeader
        title="Publish Attendance"
        description="Open an attendance session for one of your courses. Students within range of the venue can then mark themselves present."
      />

      {activeCourse && (
        <Card className="border-success/30 bg-success/5 shadow-none">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-success/15">
                <Radio className="h-4 w-4 animate-pulse text-success" />
              </span>
              <div>
                <p className="font-medium">
                  {activeCourse.courseName} is live
                </p>
                <p className="text-sm text-muted-foreground">
                  Students can mark attendance at{" "}
                  {activeCourse.venueName ?? "the venue"} right now.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href={`/lecturer/attendance/${activeCourse.courseId}`}>
                  <Users className="h-4 w-4" />
                  View register
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setCourseToEnd(activeCourse)}
              >
                End session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isError ? (
        <ErrorState description="We could not load your courses." />
      ) : isLoading ? (
        <CardGridSkeleton count={3} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={Upload}
          title="No courses yet"
          description="Add the courses you teach before publishing attendance."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/lecturer/register-courses">Register courses</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isActive = isCourseActive(course);
            const isPending =
              publish.isPending && publish.variables === course.courseId;
            // Only one session can be live at a time.
            const blocked = Boolean(activeCourse) && !isActive;

            return (
              <Card key={course.courseId} className="flex flex-col shadow-none">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{course.courseName}</span>
                    {isActive && <Badge variant="success">Live</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.courseTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {course.venueName ?? "Venue not set"}
                  </p>

                  <div className="mt-auto pt-2">
                    <Button
                      size="sm"
                      className="w-full gap-2"
                      variant={isActive ? "secondary" : "default"}
                      disabled={isActive || blocked || isPending}
                      onClick={() =>
                        publish.mutate(course.courseId, {
                          onSuccess: () =>
                            toast.success(`${course.courseName} published`),
                          onError: () =>
                            toast.error(
                              `Could not publish ${course.courseName}.`
                            ),
                        })
                      }
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : isActive ? (
                        <>
                          <Check className="h-4 w-4" />
                          Published
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Publish
                        </>
                      )}
                    </Button>
                    {blocked && (
                      <p className="mt-2 text-center text-xs text-muted-foreground">
                        End the live session first
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={Boolean(courseToEnd)}
        onOpenChange={(open) => !open && setCourseToEnd(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End attendance session</DialogTitle>
            <DialogDescription>
              Students will no longer be able to mark attendance for{" "}
              <span className="font-medium text-foreground">
                {courseToEnd?.courseName}
              </span>
              . Records already submitted are kept.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseToEnd(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={end.isPending}
              onClick={() => {
                if (!courseToEnd) return;
                end.mutate(courseToEnd.courseId, {
                  onSuccess: () => {
                    toast.success(`${courseToEnd.courseName} session ended`);
                    setCourseToEnd(null);
                  },
                  onError: () => toast.error("Could not end the session."),
                });
              }}
            >
              {end.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              End session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
