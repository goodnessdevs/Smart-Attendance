import type { Metadata } from "next";
import { AccountView } from "@/features/account/components/account-view";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Smartendance profile and session details.",
};

export default function Page() {
  return <AccountView role="admin" />;
}
