import { Outlet, useLocation } from "react-router-dom";
import { MobileNavbar } from "../components/MobileNavbar";
import { AppSidebar } from "../components/AppSidebar";
import Footer from "../components/Footer";

import { Toaster } from "../components/ui/sonner";
import { Separator } from "../components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { UserAvatar } from "../components/UserAvatar";
import { useAuthContext } from "../hooks/use-auth";

export default function Layout() {
  const location = useLocation();
  const hideNavAndFooterRoutes = [
    "/login",
    "/signup",
    "/onboarding",
  ];
  const shouldHide = hideNavAndFooterRoutes.includes(location.pathname);

  const { user, isInitializing } = useAuthContext();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {!shouldHide && <AppSidebar />}

        <div className="flex flex-col flex-1 w-full">
          <main className="flex-1 w-full afacad-flux bg-gradient-to-br from-white via-green-300 to-white dark:from-zinc-900 darK:via-green-900 dark:to-zinc-900 pb-20">
            {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
            {!shouldHide && <MobileNavbar />}
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