import { Inbox } from "lucide-react";
import { PageHeader, PageShell } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/states";

/**
 * Messaging has no backing endpoint on the API yet.
 *
 * The Vite inbox rendered three hard-coded messages from July 2025 as though
 * they were real, so this shows an honest empty state until a messages
 * endpoint exists.
 */
export function InboxView() {
  return (
    <PageShell width="narrow">
      <PageHeader
        title="Inbox"
        description="Announcements from your lecturers and the administration."
      />

      <EmptyState
        icon={Inbox}
        title="No messages"
        description="Messaging is not switched on yet. When lecturers can send announcements, they will show up here."
      />
    </PageShell>
  );
}
