import type { Metadata } from "next";
import { StudentAttendanceView } from "@/features/attendance/components/student-attendance-view";

export const metadata: Metadata = {
  title: "My Attendance",
  description: "Your attendance record for this course.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <StudentAttendanceView courseId={courseId} />;
}
