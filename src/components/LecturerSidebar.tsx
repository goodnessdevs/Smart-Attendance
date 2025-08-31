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
} from "./ui/sidebar";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "./ui/separator";

// Menu items.
const items = [
  {
    title: "Dashboard",
    href: "/lecturer",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Attendance",
    href: "lecturer/attendance",
    icon: CheckIcon,
  },
  {
    title: "Inbox",
    href: "/lecturer/inbox",
    icon: Inbox,
  },
  {
    title: "Session Calendar",
    href: "/lecturer/calendar",
    icon: Calendar,
  },
  {
    title: "Account",
    href: "/lecturer/account-profile",
    icon: User,
  },
  {
    title: "Students Support",
    href: "/lecturer/support",
    icon: Contact,
  },
  {
    title: "Log out",
    href: "/lecturer/login",
    icon: LogOut,
  },
];

export function LecturerSidebar() {
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
