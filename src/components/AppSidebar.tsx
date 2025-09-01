import {
  LayoutDashboardIcon,
  User,
  Calendar,
  Inbox,
  LogOut,
  Contact,
  LogIn,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
import { useAuthContext } from "../hooks/use-auth";
import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "All Courses",
    href: "/all-courses",
    icon: BookOpen,
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
    href: "/account-profile",
    icon: User,
  },
  {
    title: "Support",
    href: "/support",
    icon: Contact,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // logout handler
  const handleLogout = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
      logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

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

              <SidebarMenuItem>
                {user ? (
                  <SidebarMenuButton onClick={handleLogout} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut />
                        <span>Logout</span>
                      </>
                    )}
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild>
                    <Link to="/login">
                      <LogIn />
                      <span>Login</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
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
