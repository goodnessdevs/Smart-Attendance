import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  /** Actions rendered on the right, e.g. a primary button or a menu. */
  actions?: React.ReactNode;
  className?: string;
};

/**
 * The heading block every page opens with.
 *
 * Exists so page titles stop each picking their own size, weight and margin —
 * the Vite pages ranged from text-xl to text-4xl for the same role of heading.
 */
export function PageHeader({ title, description, actions, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1>{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/**
 * Standard page frame: consistent max width, padding and vertical rhythm.
 */
export function PageShell({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 md:px-6 lg:px-8 space-y-6",
        width === "narrow" && "max-w-3xl",
        width === "default" && "max-w-5xl",
        width === "wide" && "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}
