import React, { useState } from "react";

import {
  LayoutDashboardIcon,
  User,
  Calendar,
  Inbox,
  LogOut,
  Contact,
  CheckIcon,
  Loader2,
  LogIn,
} from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "./ui/separator";
import { useAuthContext } from "../hooks/use-auth";

// Menu items.
const items = [
  {
    title: "Dashboard",
    href: "/lecturer",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Attendance",
    href: "/lecturer/attendance",
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
];

function SheetNavbar() {
  const [open, setOpen] = React.useState(false);
  const { logout, token } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // logout handler
  const handleLogout = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
      logout();
      navigate("/lecturer/login");
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <div>
      {/* Trigger Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[350px] sm:w-[350px] md:hidden bg-card"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl">Menu</SheetTitle>
            <SheetDescription>
              Access your students attendance list, check the session
              attendance, and view notifications.
            </SheetDescription>
            <Separator />
          </SheetHeader>

          <nav className="md:hidden flex flex-col mx-4 gap-4">
            {items.map((item, index) => (
              <Link
                key={index}
                className="text-base p-1.5 flex gap-x-4 items-center rounded font-semibold hover:bg-[#145c4d9f] hover:text-white transition"
                to={item.href}
                onClick={handleNavClick}
              >
                <item.icon size={14} />
                {item.title}
              </Link>
            ))}
          </nav>

          <>
            {token ? (
              <Button onClick={handleLogout} disabled={loading} asChild>
                {loading ? (
                  <div className="flex items-center gap-x-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Logging out...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </div>
                )}
              </Button>
            ) : (
              <Button asChild>
                <Link to="/login">
                  <LogIn />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </>

          <div className="mx-4 mt-2">
            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export const LecturerMobileNavbar = () => {
  return (
    <div className="md:hidden flex justify-between items-center p-4">
      <div className="flex gap-x-2 items-center">
        <div className="w-10">
          <img src="/funaab.png" alt="funaab" className="object-cover w-full" />
        </div>
        <span className="text-2xs font-semibold">Smart Attendance</span>
      </div>
      <SheetNavbar />
    </div>
  );
};
