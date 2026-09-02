import type { Metadata } from "next";
import { LecturerOnboarding } from "@/features/onboarding/components/lecturer-onboarding";

export const metadata: Metadata = {
  title: "Complete your profile",
  description: "Finish setting up your Smartendance lecturer account.",
};

export default function Page() {
  return <LecturerOnboarding />;
}
