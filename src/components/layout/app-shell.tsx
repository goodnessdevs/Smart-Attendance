import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserAvatar } from "@/features/auth/components/user-avatar";
import type { Role } from "@/features/auth/types";
import { AppSidebar } from "./app-sidebar";
import { ModeToggle } from "./mode-toggle";
import { SiteFooter } from "./site-footer";

const AREA_LABEL: Record<Role, string> = {
  student: "Student",
  lecturer: "Lecturer",
  admin: "Admin",
};

/**
 * Chrome for the signed-in areas.
 *
 * Login and onboarding pages sit outside the route groups that use this, so
 * there is no need for the `hideNavAndFooterRoutes` path lists that the Vite
 * layouts had to keep in sync by hand.
 *
 * shadcn's Sidebar renders itself as a Sheet on small screens, so one sidebar
 * covers desktop and mobile — the three separate mobile navbars are gone.
 */
export function AppShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar role={role} />

      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger />
          <span className="text-sm font-medium text-muted-foreground">
            {AREA_LABEL[role]}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
            <UserAvatar />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
