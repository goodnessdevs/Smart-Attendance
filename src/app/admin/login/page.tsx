import type { Metadata } from "next";
import { LoginCard } from "@/features/auth/components/login-card";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Administrator sign-in for the Smartendance platform.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <LoginCard
      role="admin"
      title="Admin sign in"
      subtitle="Use the Google account registered as an administrator."
      backHref="/admin"
      footnote="Only authorised administrators can access this system."
    />
  );
}
