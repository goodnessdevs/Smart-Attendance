"use client";

import { Check, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/common/page-header";
import {
  useCourseCatalogue,
  useLecturerCourses,
  useSelectCourse,
} from "../api/courses-api";
import { CourseBrowser } from "./course-browser";

export function LecturerCoursesView() {
  const catalogue = useCourseCatalogue();
  const mine = useLecturerCourses();
  const selectCourse = useSelectCourse();

  const selectedIds = new Set((mine.data ?? []).map((c) => c.courseId));

  return (
    <PageShell width="wide">
      <PageHeader
        title="Register Courses"
        description="Choose the courses you teach. You can publish attendance for any course listed here."
      />

      <CourseBrowser
        courses={catalogue.data}
        isLoading={catalogue.isLoading}
        isError={catalogue.isError}
        emptyTitle="No courses available"
        emptyDescription="No courses have been created for this session yet."
        showDays
        renderAction={(course) => {
          const isSelected = selectedIds.has(course.courseId);
          const isPending =
            selectCourse.isPending && selectCourse.variables === course.courseId;

          return (
            <Button
              size="sm"
              variant={isSelected ? "secondary" : "default"}
              className="w-full gap-2"
              disabled={isSelected || isPending}
              onClick={() =>
                selectCourse.mutate(course.courseId, {
                  onSuccess: () => toast.success(`${course.courseName} added`),
                  onError: () =>
                    toast.error(`Could not add ${course.courseName}.`),
                })
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : isSelected ? (
                <>
                  <Check className="h-4 w-4" />
                  Added
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
