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

  const { user } = useAuthContext();

  return (
    <>
      <SidebarProvider>
        {!shouldHide && <AppSidebar />}

        <main className="w-full afacad-flux bg-gradient-to-br from-white to-green-300 dark:from-zinc-900 via-green-900 dark:to-zinc-900 pb-20">
          {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
          {!shouldHide && <MobileNavbar />}
          <Separator className="md:hidden" />
          {!shouldHide && user && <UserAvatar />}
          <Outlet />
        </main>

        <Toaster position="top-center" duration={1500} richColors />
      </SidebarProvider>
      {!shouldHide && <Footer />}
    </>
  );
}
