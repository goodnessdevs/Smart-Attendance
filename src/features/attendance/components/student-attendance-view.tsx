"use client";

import { PageHeader, PageShell } from "@/components/common/page-header";
import { DataTable } from "@/components/common/data-table";
import { ErrorState } from "@/components/common/states";
import { studentAttendanceColumns } from "../columns";
import { useStudentAttendance } from "../api/attendance-api";

export function StudentAttendanceView({ courseId }: { courseId: string }) {
  const { data, isLoading, isError } = useStudentAttendance(courseId);
  const records = data ?? [];
  const present = records.filter((record) => record.isPresent).length;

  return (
    <PageShell width="wide">
      <PageHeader
        title={records[0]?.courseTitle ?? "Attendance"}
        description={
          records.length > 0
            ? `${present} of ${records.length} classes attended.`
            : "Your attendance record for this course."
        }
      />

      {isError ? (
        <ErrorState description="We could not load your attendance for this course." />
      ) : (
        <DataTable
          columns={studentAttendanceColumns}
          data={records}
          isLoading={isLoading}
          emptyMessage="No attendance recorded for this course yet."
        />
      )}
    </PageShell>
  );
}
