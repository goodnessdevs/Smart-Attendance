import { ThemeProvider } from "../components/ui/theme-provider";
import { Toaster } from "../components/ui/sonner";
import Footer from "../components/Footer";
import { AdminSidebar } from "../pages/admin/components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AdminMobileNavbar } from "../pages/admin/components/AdminMobileNavbar";

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

        <main className="w-full quicksand">
          {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
          {!shouldHide && <AdminMobileNavbar />}
          <Outlet />
        </main>

        <Toaster position="top-center" />
      </SidebarProvider>

      {!shouldHide && <Footer />}
    </ThemeProvider>
  );
}
