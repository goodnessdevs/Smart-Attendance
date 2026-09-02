import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
};

/** Compact metric tile used on the dashboards. */
export function StatCard({ label, value, hint, icon: Icon, className }: Props) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tabular-nums">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-accent p-2.5">
            <Icon className="h-5 w-5 text-accent-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
