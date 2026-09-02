import {
  BookOpen,
  BookOpenCheck,
  Calendar,
  Contact,
  Inbox,
  LayoutDashboardIcon,
  Megaphone,
  User,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/features/auth/types";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Sidebar and mobile navigation, per role.
 *
 * Previously duplicated across six components (three sidebars, three mobile
 * navbars) which had drifted apart — the student mobile nav pointed "Dashboard"
 * at "/" instead of "/dashboard" and called the same page "My Courses" where
 * the sidebar said "All Courses".
 *
 * The admin "Edit Courses" entry is omitted: /admin/edit-courses was a
 * placeholder component rendering the literal text "EditCourses".
 */
export const NAV_ITEMS: Record<Role, NavItem[]> = {
  student: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Register Courses", href: "/register-courses", icon: BookOpenCheck },
    { title: "All Courses", href: "/all-courses", icon: BookOpen },
    { title: "Inbox", href: "/inbox", icon: Inbox },
    { title: "Session Calendar", href: "/calendar", icon: Calendar },
    { title: "Account", href: "/account-profile", icon: User },
    { title: "Support", href: "/support", icon: Contact },
  ],
  lecturer: [
    { title: "Dashboard", href: "/lecturer/dashboard", icon: LayoutDashboardIcon },
    { title: "Register Courses", href: "/lecturer/register-courses", icon: BookOpenCheck },
    { title: "Publish Attendance", href: "/lecturer/publish-attendance", icon: Megaphone },
    { title: "Inbox", href: "/lecturer/inbox", icon: Inbox },
    { title: "Session Calendar", href: "/lecturer/calendar", icon: Calendar },
    { title: "Account", href: "/lecturer/account-profile", icon: User },
    { title: "Support", href: "/lecturer/support", icon: Contact },
  ],
  admin: [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboardIcon },
    { title: "Created Courses", href: "/admin/created-courses", icon: BookOpen },
    { title: "Session Calendar", href: "/admin/calendar", icon: Calendar },
    { title: "Account", href: "/admin/account-profile", icon: User },
    { title: "Student Support", href: "/admin/support", icon: Contact },
  ],
};
