import type { Metadata } from "next";
import { SupportView } from "@/features/support/components/support-view";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Smartendance.",
};

export default function Page() {
  return <SupportView />;
}
