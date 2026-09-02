import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/server/auth";

export default async function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("lecturer");
  return <AppShell role="lecturer">{children}</AppShell>;
}
