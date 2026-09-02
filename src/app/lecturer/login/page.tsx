import type { Metadata } from "next";
import { LoginCard } from "@/features/auth/components/login-card";

export const metadata: Metadata = {
  title: "Lecturer Login",
  description:
    "Sign in to publish attendance, manage courses, and view student attendance.",
};

export default function LecturerLoginPage() {
  return (
    <LoginCard
      role="lecturer"
      title="Lecturer sign in"
      subtitle="Use the Google account registered as a lecturer."
      backHref="/lecturer"
    />
  );
}
