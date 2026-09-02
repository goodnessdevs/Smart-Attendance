import type { Metadata } from "next";
import { AcademicCalendar } from "@/features/calendar/components/academic-calendar";

export const metadata: Metadata = {
  title: "Session Calendar",
  description:
    "The 2025/2026 academic session calendar for the Federal University of Agriculture, Abeokuta.",
};

export default function CalendarPage() {
  return <AcademicCalendar />;
}
