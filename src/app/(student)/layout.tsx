import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/server/auth";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard. The Vite app had RouteProtection commented out on every
  // student route, so all of them rendered for anyone.
  await requireRole("student");
  return <AppShell role="student">{children}</AppShell>;
}
