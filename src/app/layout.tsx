import type { Metadata } from "next";
import { Afacad_Flux, Quicksand } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Self-hosted and preloaded by Next, replacing the render-blocking
// @import url(fonts.googleapis.com) the Vite app used.
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const afacadFlux = Afacad_Flux({
  subsets: ["latin"],
  variable: "--font-afacad-flux",
  display: "swap",
});

/**
 * Real server-rendered metadata. The Vite app mutated document.head from a
 * useSEO() hook after hydration, so crawlers that don't execute JS saw none of
 * it. Per-page titles come from each route's own `metadata` export.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://smartendance.vercel.app"),
  title: {
    default: "Smart Attendance",
    template: "%s | Smartendance",
  },
  description:
    "Track attendance, manage courses, and stay on top of your studies at the Federal University of Agriculture, Abeokuta.",
  icons: { icon: "/funaab.png" },
  openGraph: {
    type: "website",
    siteName: "Smartendance",
    title: "Smart Attendance",
    description:
      "Track attendance, manage courses, and stay on top of your studies.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${quicksand.variable} ${afacadFlux.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
