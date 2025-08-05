import React from "react";

import {
  LayoutDashboardIcon,
  User,
  Calendar,
  Inbox,
  LogOut,
  Contact,
} from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../../../components/ModeToggle";

// Menu items.
const items = [
  {
    title: "Dashboard",
    href: "/admin/lecturers",
    icon: LayoutDashboardIcon,
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

function SheetNavbar() {
  const [open, setOpen] = React.useState(false);

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
          side="right"
          className="w-[350px] sm:w-[350px] md:hidden bg-card"
        >
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Access your students attendance list, check the session
              attendance, and view notifications.
            </SheetDescription>
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

          <div className="mx-4 mt-2">
            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export const AdminMobileNavbar = () => {
  return (
    <div className="md:hidden flex justify-between items-center p-2 border rounded m-2">
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
