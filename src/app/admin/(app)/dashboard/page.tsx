import type { Metadata } from "next";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Create and manage courses on the Smartendance platform.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminDashboard />;
}
