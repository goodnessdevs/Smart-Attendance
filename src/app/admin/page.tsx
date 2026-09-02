import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { landingPathForSession } from "@/features/auth/utils";
import { LandingPage } from "@/features/marketing/components/landing-page";
import { getServerSession } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "For Admins",
};

export default async function Page() {
  // Signed-in visitors go straight to their own area. Done on the server, so
  // there is no flash of the marketing page first.
  const session = await getServerSession();
  if (session.authenticated) {
    redirect(landingPathForSession(session));
  }

  return <LandingPage role="admin" />;
}
