"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGoogleSignIn } from "../hooks/use-google-sign-in";
import type { Role } from "../types";

type Props = {
  role: Role;
  title: string;
  subtitle: string;
  /** Where the "back" link goes, i.e. this portal's landing page. */
  backHref: string;
  footnote?: string;
};

/**
 * One sign-in screen for all three portals. Replaces three login pages that
 * had each grown their own copy of the popup and postMessage handling.
 */
export function LoginCard({
  role,
  title,
  subtitle,
  backHref,
  footnote,
}: Props) {
  const { signIn, isPending, error } = useGoogleSignIn(role);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Image
          src="/funaab.png"
          alt=""
          width={56}
          height={56}
          className="object-contain"
          priority
        />
        <span className="font-semibold">Smart Attendance</span>
      </div>

      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="space-y-1.5 text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={signIn}
            disabled={isPending}
            size="lg"
            variant="outline"
            className="w-full gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <GoogleMark />
                {error ? "Try again with Google" : "Continue with Google"}
              </>
            )}
          </Button>

          {footnote && (
            <p className="text-center text-xs text-muted-foreground">
              {footnote}
            </p>
          )}
        </CardContent>
      </Card>

      <Button asChild variant="ghost" size="sm" className="mt-6 gap-2">
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <p className="mt-8 max-w-xs text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Federal University of Agriculture,
        Abeokuta. All rights reserved.
      </p>
    </div>
  );
}

/** Inlined so the sign-in button does not depend on an external image host. */
function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5a11 11 0 0 0-9.82 6.55l3.66 2.84c.87-2.6 3.3-4.14 6.16-4.14Z"
      />
    </svg>
  );
}
