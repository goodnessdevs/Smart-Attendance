import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");
  return <AppShell role="admin">{children}</AppShell>;
}
