import Image from "next/image";
import Link from "next/link";
import {
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/layout/site-footer";
import type { Role } from "@/features/auth/types";
import { ROLE_CONTENT } from "../data/role-content";
import { DemoVideo } from "./demo-video";

const ROLE_ICON: Record<Role, React.ReactNode> = {
  student: <Users className="h-4 w-4" />,
  lecturer: <GraduationCap className="h-4 w-4" />,
  admin: <Shield className="h-4 w-4" />,
};

const SLIDE_ICONS = [BookOpenCheck, MapPin, CalendarDays];

const OTHER_PORTALS: Record<Role, { label: string; href: string }[]> = {
  student: [
    { label: "Lecturer portal", href: "/lecturer" },
    { label: "Admin portal", href: "/admin" },
  ],
  lecturer: [
    { label: "Student portal", href: "/" },
    { label: "Admin portal", href: "/admin" },
  ],
  admin: [
    { label: "Student portal", href: "/" },
    { label: "Lecturer portal", href: "/lecturer" },
  ],
};

/**
 * Public landing page, rendered entirely on the server so its copy is in the
 * HTML for crawlers. Only the video is a client component.
 */
export function LandingPage({ role }: { role: Role }) {
  const content = ROLE_CONTENT[role];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-6">
          <Image
            src="/funaab.png"
            alt=""
            width={32}
            height={32}
            className="object-contain"
            priority
          />
          <span className="font-semibold">Smart Attendance</span>

          <Button asChild size="sm" className="ml-auto gap-2">
            <Link href={content.loginPath}>
              {ROLE_ICON[role]}
              {content.buttonText}
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 text-center md:px-6 md:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Federal University of Agriculture, Abeokuta
          </p>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {content.heading}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            {content.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href={content.loginPath}>
                {ROLE_ICON[role]}
                {content.buttonText}
              </Link>
            </Button>
            {OTHER_PORTALS[role].map((portal) => (
              <Button key={portal.href} asChild size="lg" variant="outline">
                <Link href={portal.href}>{portal.label}</Link>
              </Button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {content.slides.map((slide, index) => {
              const Icon = SLIDE_ICONS[index] ?? BookOpenCheck;
              return (
                <Card key={slide.title} className="shadow-none">
                  <CardContent className="space-y-3 p-6">
                    <div className="w-fit rounded-lg bg-accent p-2.5">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold">{slide.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {slide.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-20 md:px-6">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                See it in action
              </h2>
              <p className="mt-3 text-muted-foreground">
                A quick walkthrough of how everything works.
              </p>
            </div>
            <DemoVideo />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
