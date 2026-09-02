"use client";

import { useMemo, useState } from "react";
import { BookOpen, MapPin, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/common/states";
import { courseDayList, lecturerNames, type Course } from "../types";

type Props = {
  courses: Course[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Per-card action, e.g. a register or publish button. */
  renderAction?: (course: Course) => React.ReactNode;
  /** Extra detail lines shown on each card. */
  showDays?: boolean;
};

/**
 * Search + grid used by every course listing screen.
 *
 * The Vite pages each reimplemented this and diverged: two of them filtered the
 * list but rendered the empty state off the *unfiltered* length, so searching
 * for something with no matches showed an empty grid and no message.
 */
export function CourseBrowser({
  courses,
  isLoading = false,
  isError = false,
  emptyTitle = "No courses yet",
  emptyDescription,
  renderAction,
  showDays = false,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const list = courses ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return list;

    return list.filter((course) =>
      [course.courseName, course.courseTitle, course.courseId]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    );
  }, [courses, search]);

  if (isError) {
    return (
      <ErrorState description="We could not load the course list. Please try again." />
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by code or title..."
          className="pl-9"
          aria-label="Search courses"
        />
      </div>

      {isLoading ? (
        <CardGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={search ? "No matching courses" : emptyTitle}
          description={
            search
              ? `Nothing matches "${search}". Try a different code or title.`
              : emptyDescription
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Card key={course._id ?? course.courseId} className="flex flex-col shadow-none">
              <CardContent className="flex flex-1 flex-col gap-3 p-5">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{course.courseName}</span>
                    {course.unit && (
                      <Badge variant="secondary" className="shrink-0">
                        {course.unit} {Number(course.unit) === 1 ? "unit" : "units"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.courseTitle}
                  </p>
                </div>

                <dl className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <dd>{course.venueName ?? "Venue not set"}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <dd className="line-clamp-1">{lecturerNames(course)}</dd>
                  </div>
                  {showDays && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 shrink-0" />
                      <dd>{courseDayList(course)}</dd>
                    </div>
                  )}
                </dl>

                {renderAction && (
                  <div className="mt-auto pt-2">{renderAction(course)}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
