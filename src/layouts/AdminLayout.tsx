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

  const { user, isInitializing } = useAuthContext();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {!shouldHide && <AdminSidebar />}

        <div className="flex flex-col flex-1 w-full">
          <main className="flex-1 w-full afacad-flux bg-gradient-to-br from-white to-cyan-200 dark:from-cyan-950 dark:to-black pb-20">
            {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
            {!shouldHide && <AdminMobileNav />}
            <Separator className="md:hidden" />
            {!shouldHide && !isInitializing && user && <UserAvatar />}
            <Outlet />
          </main>

          {!shouldHide && <Footer />}
        </div>
      </div>

      <Toaster position="top-center" duration={1500} richColors />
    </SidebarProvider>
  );
}
