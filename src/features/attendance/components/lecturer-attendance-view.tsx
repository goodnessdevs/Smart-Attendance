"use client";

import { PageHeader, PageShell } from "@/components/common/page-header";
import { DataTable } from "@/components/common/data-table";
import { ErrorState } from "@/components/common/states";
import { attendanceColumns } from "../columns";
import { useClassAttendance } from "../api/attendance-api";

export function LecturerAttendanceView({ courseId }: { courseId: string }) {
  const { data, isLoading, isError } = useClassAttendance(courseId);
  const records = data ?? [];
  const present = records.filter((record) => record.isPresent).length;

  return (
    <PageShell width="wide">
      <PageHeader
        title="Attendance Register"
        description={
          records.length > 0
            ? `${present} of ${records.length} students marked present.`
            : "Students who marked attendance for this session."
        }
      />

      {isError ? (
        <ErrorState description="We could not load the register for this course." />
      ) : (
        <DataTable
          columns={attendanceColumns}
          data={records}
          isLoading={isLoading}
          filterColumn="email"
          filterPlaceholder="Filter by email..."
          emptyMessage="Nobody has marked attendance for this session yet."
        />
      )}
    </PageShell>
  );
}
