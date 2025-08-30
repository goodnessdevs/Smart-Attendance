import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { MobileNavbar } from "../components/MobileNavbar";
import { Toaster } from "../components/ui/sonner";
import Footer from "../components/Footer";
import { Separator } from "../components/ui/separator";

export default function Layout() {
  const location = useLocation();
  const hideNavAndFooterRoutes = [
    "/login",
    "/signup",
    "/onboarding",
    "/admin/auth",
    "/admin/lecturers/login",
    "/admin/lecturers",
  ];
  const shouldHide = hideNavAndFooterRoutes.includes(location.pathname);
  return (
    <>
      <SidebarProvider>
        {!shouldHide && <AppSidebar />}

        <main className="w-full afacad-flux bg-gradient-to-br from-white to-green-300 dark:from-green-900 dark:to-gray-900">
          {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
          {!shouldHide && <MobileNavbar />}
          <Separator className="md:hidden" />
          <Outlet />
        </main>

        <Toaster position="top-center" duration={1500} richColors />
      </SidebarProvider>
      {!shouldHide && <Footer />}
    </>
  );
}
