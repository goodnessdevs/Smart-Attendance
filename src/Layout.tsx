import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { ThemeProvider } from "./components/ui/theme-provider";
import { useLocation } from "react-router-dom";
import { MobileNavbar } from "./components/MobileNavbar";
import { Toaster } from "./components/ui/sonner";
import Footer from "./components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideNavAndFooterRoutes = ["/login", "/signup", "/onboarding", "/admin/lecturers-login/auth", "/admin/lecturers-login"];
  const shouldHide = hideNavAndFooterRoutes.includes(location.pathname);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        {!shouldHide && <AppSidebar />}

        <main className="w-full quicksand">
          {!shouldHide && <SidebarTrigger className="m-2 hidden md:flex" />}
          {!shouldHide && <MobileNavbar />}
          {children}
        </main>

        <Toaster position="top-center" />
      </SidebarProvider>
      {!shouldHide && <Footer />}
    </ThemeProvider>
  );
}
