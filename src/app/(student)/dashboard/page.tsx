import type { Metadata } from "next";
import { StudentDashboard } from "@/features/dashboard/components/student-dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track your attendance, view active class sessions, and manage your courses.",
};

export default function Page() {
  return <StudentDashboard />;
}
