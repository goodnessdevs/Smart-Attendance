import {
  LayoutDashboardIcon,
  User,
  Calendar,
  Inbox,
  LogOut,
  Contact,
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
import logo from "../assets/funaab.png";
import { Separator } from "./ui/separator";

// Menu items.
const items = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: Inbox,
  },
  {
    title: "Session Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Account",
    href: "/account",
    icon: User,
  },
  {
    title: "Support",
    href: "/support",
    icon: Contact,
  },
  {
    title: "Log out",
    href: "/login",
    icon: LogOut,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar flex flex-col h-full justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="my-2 text-2xs flex gap-x-2 items-center text-white tracking-wider">
            <div className="w-10">
              <img src={logo} alt="funaab" className="object-cover w-full" />
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
