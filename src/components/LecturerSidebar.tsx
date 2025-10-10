import {
  LayoutDashboardIcon,
  User,
  Calendar,
  Inbox,
  LogOut,
  Contact,
  LogIn,
  Loader2,
  BookOpenCheck,
  Megaphone,
  SheetIcon,
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
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    href: "/lecturer/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Register Courses",
    href: "/lecturer/register-courses",
    icon: BookOpenCheck,
  },
  {
    title: "Publish Attendance",
    href: "/lecturer/publish-attendance",
    icon: Megaphone,
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
    title: "Support",
    href: "/lecturer/support",
    icon: Contact,
  },
];

type Course = {
  id: string;
  courseId: string;
  courseTitle: string;
  courseName?: string;
  venueName?: string;
};

export function LecturerSidebar() {
  const { logout, token } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch lecturer's active courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/lecturer-active-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (token) fetchCourses();
  }, [token]);

  // logout handler
  const handleLogout = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
      logout();
      navigate("/lecturer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar afacad-flux flex flex-col h-full justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="my-2 text-2xs flex gap-x-2 items-center text-white tracking-wider">
            <div className="w-10">
              <img
                src="/funaab.png"
                alt="funaab"
                className="object-cover w-full"
              />
            </div>
            Smart Attendance
          </SidebarGroupLabel>
          <Separator className="mb-4" />
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 font-semibold text-sidebar-accent">
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
                {/* 🔹 Dynamic Attendance Sheet links */}
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/lecturer/attendance/${course.courseId}`}
                    className="text-base p-1.5 flex gap-x-4 items-center rounded font-semibold hover:bg-[#034320cb] dark:hover:bg-[#145c269f] hover:text-white transition"
                  >
                    <SheetIcon size={14} />
                    Attendance Sheet – {course.courseTitle}
                  </Link>
                ))}
              </SidebarMenuItem>

              <SidebarMenuItem>
                {token ? (
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
                  <SidebarMenuButton
                    className="bg-sidebar-accent text-sidebar"
                    asChild
                  >
                    <Link to="/lecturer/login">
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
