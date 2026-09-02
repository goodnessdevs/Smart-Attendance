import type { Metadata } from "next";
import { MarkAttendanceView } from "@/features/attendance/components/mark-attendance-view";

export const metadata: Metadata = {
  title: "Mark Attendance",
  description: "Mark your attendance for an active class session.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <MarkAttendanceView courseId={courseId} />;
}
