import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, PageShell } from "@/components/common/page-header";
import { sessionActivities } from "../data/session-activities";

/**
 * The 2025/2026 session calendar.
 *
 * Previously three byte-identical page components (student, lecturer, admin).
 * All three routes render this, and since it is static it stays a server
 * component — no JavaScript ships for it at all.
 */
export function AcademicCalendar() {
  return (
    <PageShell width="narrow">
      <PageHeader
        title="Session Calendar"
        description="Key dates for the 2025/2026 academic session at the Federal University of Agriculture, Abeokuta."
      />

      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionActivities.map((item) => (
                  <TableRow key={`${item.date}-${item.activity}`}>
                    <TableCell className="font-medium">
                      {item.activity}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                      {item.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
