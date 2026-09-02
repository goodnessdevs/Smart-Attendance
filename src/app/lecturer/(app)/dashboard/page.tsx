import type { Metadata } from "next";
import { LecturerDashboard } from "@/features/dashboard/components/lecturer-dashboard";

export const metadata: Metadata = {
  title: "Lecturer Dashboard",
  description: "Publish attendance, monitor sessions, and manage your courses.",
};

export default function Page() {
  return <LecturerDashboard />;
}
