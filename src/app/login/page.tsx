import type { Metadata } from "next";
import { LoginCard } from "@/features/auth/components/login-card";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to Smartendance to track attendance, manage courses, and stay on top of your studies.",
};

export default function StudentLoginPage() {
  return (
    <LoginCard
      role="student"
      title="Sign in"
      subtitle="Welcome back. Use your university Google account."
      backHref="/"
    />
  );
}
