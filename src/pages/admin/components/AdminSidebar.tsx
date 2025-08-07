import {
  LayoutDashboardIcon,
  User,
  Calendar,
  Inbox,
  LogOut,
  Contact,
  CheckIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar";
import { ModeToggle } from "../../../components/ModeToggle";
import { Separator } from "../../../components/ui/separator";

// Menu items.
const items = [
  {
    title: "Dashboard",
    href: "/admin/lecturers",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Attendance",
    href: "/admin/lecturers/attendance",
    icon: CheckIcon,
  },
  {
    title: "Inbox",
    href: "/admin/lecturers/inbox",
    icon: Inbox,
  },
  {
    title: "Session Calendar",
    href: "/admin/lecturers/calendar",
    icon: Calendar,
  },
  {
    title: "Account",
    href: "/admin/lecturers/account",
    icon: User,
  },
  {
    title: "Students Support",
    href: "/admin/lecturers/support",
    icon: Contact,
  },
  {
    title: "Log out",
    href: "/admin/lecturers/login",
    icon: LogOut,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar flex flex-col h-full justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="my-2 text-2xs flex gap-x-2 items-center text-white tracking-wider">
            <div className="w-10">
              <img src="/funaab.png" alt="funaab" className="object-cover w-full" />
            </div>
            Smart Attendance
          </SidebarGroupLabel>
          <Separator className="mb-4" />
          <SidebarGroupContent>
            <SidebarMenu className="space-y-6 font-semibold text-sidebar-accent">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="justify-start ms-1 mb-4">
          <ModeToggle />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
