"use client";

import { PageHeader, PageShell } from "@/components/common/page-header";
import { useCourseCatalogue } from "../api/courses-api";
import { CourseBrowser } from "./course-browser";

export function CreatedCoursesView() {
  const { data, isLoading, isError } = useCourseCatalogue();

  return (
    <PageShell width="wide">
      <PageHeader
        title="Created Courses"
        description="Every course currently published on the platform."
      />

      <CourseBrowser
        courses={data}
        isLoading={isLoading}
        isError={isError}
        emptyTitle="No courses created yet"
        emptyDescription="Create your first course from the dashboard."
        showDays
      />
    </PageShell>
  );
}
