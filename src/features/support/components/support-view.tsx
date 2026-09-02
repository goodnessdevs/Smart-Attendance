import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/common/page-header";

const CONTACTS = [
  {
    icon: Mail,
    label: "Email",
    value: "info@smartattendance.com",
    href: "mailto:info@smartattendance.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 801 234 5678",
    href: "tel:+2348012345678",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "FUNAAB, Abeokuta, Ogun State",
  },
];

/**
 * A contact page rather than a form.
 *
 * The Vite support page rendered a complaint form whose submit handler was
 * `await new Promise(r => setTimeout(r, 1500))` followed by "Complaint
 * submitted successfully." — the message was discarded and the user was told
 * it had been received. There is no support endpoint on the API, so this shows
 * real contact routes instead of faking delivery.
 */
export function SupportView() {
  return (
    <PageShell width="narrow">
      <PageHeader
        title="Support"
        description="Something not working, or attendance recorded incorrectly? Get in touch and we will sort it out."
      />

      <div className="grid gap-3">
        {CONTACTS.map((contact) => {
          const body = (
            <Card className="shadow-none transition-colors hover:border-primary/50">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="rounded-lg bg-accent p-2.5">
                  <contact.icon className="h-5 w-5 text-accent-foreground" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {contact.label}
                  </p>
                  <p className="font-medium">{contact.value}</p>
                </div>
              </CardContent>
            </Card>
          );

          return contact.href ? (
            <a key={contact.label} href={contact.href} className="block">
              {body}
            </a>
          ) : (
            <div key={contact.label}>{body}</div>
          );
        })}
      </div>

      <Card className="shadow-none">
        <CardContent className="space-y-2 p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            When reporting an attendance problem
          </p>
          <p>
            Include your matric number, the course code, and the date of the
            class. That is usually enough to trace what happened.
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
