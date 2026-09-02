import type { Metadata } from "next";
import { StudentOnboarding } from "@/features/onboarding/components/student-onboarding";

export const metadata: Metadata = {
  title: "Complete your profile",
  description: "Finish setting up your Smartendance student account.",
};

export default function Page() {
  return <StudentOnboarding />;
}
