"use client";

import { PageHeader, PageShell } from "@/components/common/page-header";
import { useRegisteredCourses } from "../api/courses-api";
import { CourseBrowser } from "./course-browser";

export function MyCoursesView() {
  const { data, isLoading, isError } = useRegisteredCourses();

  return (
    <PageShell width="wide">
      <PageHeader
        title="My Courses"
        description="Every course you have registered for this semester."
      />

      <CourseBrowser
        courses={data}
        isLoading={isLoading}
        isError={isError}
        emptyTitle="No registered courses"
        emptyDescription="Head to Register Courses to add the ones you are taking."
        showDays
      />
    </PageShell>
  );
}
