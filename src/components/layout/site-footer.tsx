import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6 lg:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/funaab.png"
              alt=""
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-semibold">Smart Attendance</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Attendance tracking for the Federal University of Agriculture,
            Abeokuta.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Contact</h3>
          <a
            href="tel:+2348012345678"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            +234 801 234 5678
          </a>
          <a
            href="mailto:info@smartattendance.com"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            info@smartattendance.com
          </a>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Location</h3>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            FUNAAB, Abeokuta, Ogun State, Nigeria
          </p>
        </div>
      </div>

      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Smart Attendance. All rights reserved.
      </div>
    </footer>
  );
}
