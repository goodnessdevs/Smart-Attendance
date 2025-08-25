import { ThemeProvider } from "../components/ui/theme-provider";
import { Toaster } from "../components/ui/sonner";
import Footer from "../components/Footer";
import { AdminSidebar } from "../pages/admin/components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AdminMobileNavbar } from "../pages/admin/components/AdminMobileNavbar";
import { Separator } from "../components/ui/separator";

export default function AdminLayout() {
  const location = useLocation();
  const hideNavAndFooterRoutes = ["/admin/auth", "/admin/lecturers/login"];
  const shouldHide = hideNavAndFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        {!shouldHide && <AdminSidebar />}

        <main className="w-full afacad-flux bg-gradient-to-br from-white to-green-300 dark:from-green-900 dark:to-gray-900">
          {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
          {!shouldHide && <AdminMobileNavbar />}
          <Separator className="md:hidden" />
          <Outlet />
        </main>

        <Toaster position="top-center" duration={1500} />
      </SidebarProvider>

      {!shouldHide && <Footer />}
    </ThemeProvider>
  );
}
