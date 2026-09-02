import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * The Vite app had no catch-all route, and vercel.json rewrote every path to
 * "/" — so a typo rendered a blank page instead of a 404.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1>This page does not exist</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The link may be out of date, or the page may have moved.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
