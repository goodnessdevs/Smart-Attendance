import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { Separator } from "../components/ui/separator";
import { UserAvatar } from "../components/UserAvatar";
import { Toaster } from "../components/ui/sonner";

import { AdminMobileNav } from "../components/AdminMobileNav";
import { AdminSidebar } from "../components/AdminSidebar";
import Footer from "../components/Footer";
import { useAuthContext } from "../hooks/use-auth";

export default function AdminLayout() {
  const location = useLocation();

  const hideNavRoutes = ["/admin/login", "/admin/auth"];
  const shouldHide = hideNavRoutes.includes(location.pathname);

  const { user } = useAuthContext();

  return (
    <>
      <SidebarProvider>
        {!shouldHide && <AdminSidebar />}

        <main className="w-full afacad-flux bg-gradient-to-br from-white to-cyan-300 dark:from-cyan-900 dark:to-gray-900">
          {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
          {!shouldHide && <AdminMobileNav />}
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
