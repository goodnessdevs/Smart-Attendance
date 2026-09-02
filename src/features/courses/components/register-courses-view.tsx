"use client";

import { useMemo } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/common/page-header";
import {
  useCourseCatalogue,
  useRegisteredCourses,
  useRegisterCourse,
} from "../api/courses-api";
import { CourseBrowser } from "./course-browser";

export function RegisterCoursesView() {
  const catalogue = useCourseCatalogue();
  const registered = useRegisteredCourses();
  const registerCourse = useRegisterCourse();

  // The Vite page never tracked what was already registered, so the Add button
  // stayed enabled and students could submit the same course repeatedly.
  const registeredIds = useMemo(
    () => new Set((registered.data ?? []).map((course) => course.courseId)),
    [registered.data]
  );

  return (
    <PageShell width="wide">
      <PageHeader
        title="Register Courses"
        description="Add the courses you are taking this semester. Registered courses appear on your dashboard when a lecturer opens attendance."
      />

      <CourseBrowser
        courses={catalogue.data}
        isLoading={catalogue.isLoading}
        isError={catalogue.isError}
        emptyTitle="No courses available"
        emptyDescription="No courses have been published for this session yet."
        showDays
        renderAction={(course) => {
          const isRegistered = registeredIds.has(course.courseId);
          const isPending =
            registerCourse.isPending &&
            registerCourse.variables === course.courseId;

          return (
            <Button
              size="sm"
              variant={isRegistered ? "secondary" : "default"}
              className="w-full gap-2"
              disabled={isRegistered || isPending}
              onClick={() =>
                registerCourse.mutate(course.courseId, {
                  onSuccess: () =>
                    toast.success(`${course.courseName} registered`),
                  onError: () =>
                    toast.error(
                      `Could not register ${course.courseName}. Please try again.`
                    ),
                })
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : isRegistered ? (
                <>
                  <Check className="h-4 w-4" />
                  Registered
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add course
                </>
              )}
            </Button>
          );
        }}
      />
    </PageShell>
  );
}
