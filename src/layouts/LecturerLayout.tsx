import { Toaster } from "../components/ui/sonner";
import Footer from "../components/Footer";
import { LecturerSidebar } from "../components/LecturerSidebar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { LecturerMobileNavbar } from "../components/LecturerMobileNavbar";
import { Separator } from "../components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { UserAvatar } from "../components/UserAvatar";
import { useAuthContext } from "../hooks/use-auth";

export default function LecturerLayout() {
  const location = useLocation();
  const hideNavAndFooterRoutes = ["/lecturer/auth", "/lecturer/login", "/lecturer/onboarding"];
  const shouldHide = hideNavAndFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const { user } = useAuthContext();

  return (
    <>
      <SidebarProvider>
        {!shouldHide && <LecturerSidebar />}

        <main className="w-full afacad-flux bg-gradient-to-br from-white to-green-300 dark:from-green-900 dark:to-gray-900 mb-10">
          {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
          {!shouldHide && <LecturerMobileNavbar />}
          <Separator className="md:hidden" />
          {!shouldHide && user && <UserAvatar />}
          <Outlet />
        </main>

        <Toaster position="top-center" richColors duration={1500} />
      </SidebarProvider>

      {!shouldHide && <Footer />}
    </>
  );
}
