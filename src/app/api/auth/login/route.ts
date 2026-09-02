import { redirect } from "next/navigation";
import { env } from "@/config/env";

/**
 * The OAuth popup opens this instead of the Google URL directly, which keeps
 * GOOGLE_AUTH_URL server-side rather than baking it into the client bundle.
 */
export function GET() {
  redirect(env.GOOGLE_AUTH_URL);
}
