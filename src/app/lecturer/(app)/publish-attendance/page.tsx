import type { Metadata } from "next";
import { PublishAttendanceView } from "@/features/attendance/components/publish-attendance-view";

export const metadata: Metadata = {
  title: "Publish Attendance",
  description: "Open an attendance session for one of your courses.",
};

export default function Page() {
  return <PublishAttendanceView />;
}
