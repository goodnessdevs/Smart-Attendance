import {
  LayoutDashboardIcon,
  User,
  LogOut,
  BookOpen,
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
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Created Courses",
    href: "/admin/created-courses",
    icon: BookOpen,
  },
//   {
//     title: "Session Calendar",
//     href: "/lecturer/calendar",
//     icon: Calendar,
//   },
  {
    title: "Account",
    href: "/admin/account-profile",
    icon: User,
  },
//   {
//     title: "Students Support",
//     href: "/lecturer/support",
//     icon: Contact,
//   },
  {
    title: "Log out",
    href: "/admin/login",
    icon: LogOut,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-cyan-700 dark:bg-zinc-900 flex flex-col h-full justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="my-2 text-2xs flex gap-x-2 items-center text-white tracking-wider">
            <div className="w-10">
              <img src="/funaab.png" alt="funaab" className="object-cover w-full" />
            </div>
            Smart Attendance
          </SidebarGroupLabel>
          <Separator className="mb-4" />
          <SidebarGroupContent>
            <SidebarMenu className="space-y-6 font-semibold text-white">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-cyan-100  dark:hover:text-cyan-950">
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
