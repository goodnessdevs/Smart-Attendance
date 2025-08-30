import React, { useState } from "react";

import {
  LayoutDashboardIcon,
  User,
  Calendar,
  Inbox,
  LogOut,
  Contact,
  LogIn,
  Loader2,
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
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
];

function SheetNavbar() {
  const [open, setOpen] = React.useState(false);
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

  const getAvatarFallback = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    return names
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join(" ");
  };

  const MotionAvatar = motion.create(Avatar);

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
          className="w-[310px] sm:w-[280px] md:hidden bg-card afacad-flux"
        >
          <SheetHeader>
            <SheetTitle className="text-md flex items-center gap-x-2">
              <MotionAvatar
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.25 }}
                transition={{
                  ease: "easeOut",
                }}
                className="w-12 h-12"
              >
                <AvatarImage src={user?.profilePic} alt="User Avatar" />
                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
              </MotionAvatar>
              <span className="font-semibold">dfdjkskdmd bddjdjdkksks</span>
            </SheetTitle>
            <SheetDescription>
              Access your courses, mark your attendance, and view notifications.
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

            <>
              {user ? (
                <Button onClick={handleLogout} disabled={loading} asChild>
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
          </nav>

          <div className="mx-4 mt-2">
            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export const MobileNavbar = () => {
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
