import type { Metadata } from "next";
import { InboxView } from "@/features/inbox/components/inbox-view";

export const metadata: Metadata = {
  title: "Inbox",
  description: "Announcements from your lecturers and the administration.",
};

export default function Page() {
  return <InboxView />;
}
