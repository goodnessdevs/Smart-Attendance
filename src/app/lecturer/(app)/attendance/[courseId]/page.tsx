import type { Metadata } from "next";
import { LecturerAttendanceView } from "@/features/attendance/components/lecturer-attendance-view";

export const metadata: Metadata = {
  title: "Attendance Register",
  description: "Students who marked attendance for this session.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <LecturerAttendanceView courseId={courseId} />;
}
