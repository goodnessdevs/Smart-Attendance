"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  BookCheck,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/common/page-header";
import { EmptyState, LoadingState } from "@/components/common/states";
import { useCurrentUser, useSession } from "@/features/auth/api/auth-api";
import { useActiveCourses } from "@/features/courses/api/courses-api";
import { getDeviceInfo } from "@/lib/device";
import { GeolocationService, geolocationErrorMessage } from "@/lib/geolocation";
import { useMarkAttendance, useStudentAttendance } from "../api/attendance-api";

const VENUE_RADIUS_METRES = 250;

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Records are stored with a full locale timestamp ("1/9/2026, 10:30:00 PM"),
 * so "did I already mark today" is a prefix test on the date portion.
 *
 * The Vite app instead kept a localStorage flag, and wrote it under a
 * toLocaleDateString() key while reading it back under a toLocaleString() key —
 * so the two never matched and the check silently did nothing.
 */
function markedToday(dates: (string | undefined)[]): boolean {
  const today = new Date().toLocaleDateString();
  return dates.some((date) => typeof date === "string" && date.startsWith(today));
}

export function MarkAttendanceView({ courseId }: { courseId: string }) {
  const { data: session } = useSession();
  const { data: user } = useCurrentUser(Boolean(session?.authenticated));
  const activeCourses = useActiveCourses();
  const history = useStudentAttendance(courseId);
  const markAttendance = useMarkAttendance();

  const [justMarked, setJustMarked] = useState(false);

  const course = useMemo(
    () => (activeCourses.data ?? []).find((item) => item.courseId === courseId),
    [activeCourses.data, courseId]
  );

  const alreadyMarked =
    justMarked ||
    markedToday(
      (history.data ?? []).filter((r) => r.isPresent).map((r) => r.date)
    );

  const now = new Date();

  async function handleMark() {
    if (!course) return;

    try {
      const [position, device] = await Promise.all([
        GeolocationService.getCurrentPosition(),
        getDeviceInfo(),
      ]);

      // UX check only — the server must repeat this. See lib/geolocation.ts.
      if (typeof course.long === "number" && typeof course.lat === "number") {
        const { isWithin, distance } = GeolocationService.isWithinRadius(
          position.coords.longitude,
          position.coords.latitude,
          course.long,
          course.lat,
          VENUE_RADIUS_METRES
        );

        if (!isWithin) {
          toast.error(
            `You are ${distance.toFixed(0)}m from ${course.venueName ?? "the venue"}. Move closer and try again.`
          );
          return;
        }
      }

      await markAttendance.mutateAsync({
        courseId,
        courseName: course.courseName,
        courseTitle: course.courseTitle,
        venueName: course.venueName ?? "",
        day: DAYS[now.getDay()],
        date: now.toLocaleString(),
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        device_uuid: device.device_uuid,
        fingerprint: device.fingerprint,
        fullName: user?.fullName,
        email: user?.email,
        matricNo: user?.matricNumber,
        isPresent: true,
      });

      setJustMarked(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      toast.success("Attendance marked");
    } catch (error) {
      const locationMessage = geolocationErrorMessage(error);
      toast.error(
        locationMessage ??
          (error instanceof Error
            ? "Could not mark attendance. Please try again."
            : "Something went wrong.")
      );
    }
  }

  if (activeCourses.isLoading) {
    return (
      <PageShell width="narrow">
        <LoadingState label="Loading course..." />
      </PageShell>
    );
  }

  if (!course) {
    return (
      <PageShell width="narrow">
        <EmptyState
          icon={BookCheck}
          title="Attendance is not open for this course"
          description="Your lecturer has not published an attendance session, or it has already closed."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell width="narrow">
      <PageHeader
        title={course.courseName}
        description={course.courseTitle}
        actions={
          <Badge variant={alreadyMarked ? "success" : "warning"}>
            {alreadyMarked ? "Marked" : "Not marked"}
          </Badge>
        }
      />

      <Card className="shadow-none">
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <Detail
            icon={MapPin}
            label="Venue"
            value={course.venueName ?? "Not set"}
          />
          <Detail
            icon={CalendarDays}
            label="Today"
            value={`${DAYS[now.getDay()]}, ${now.toLocaleDateString()}`}
          />
        </CardContent>
      </Card>

      {alreadyMarked ? (
        <Card className="border-success/30 bg-success/5 shadow-none">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-success" />
            <div className="space-y-1">
              <p className="font-medium">Your attendance is recorded</p>
              <p className="text-sm text-muted-foreground">
                You are marked present for {course.courseName} today.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={handleMark}
          disabled={markAttendance.isPending}
        >
          {markAttendance.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying your location...
            </>
          ) : (
            <>
              <BookCheck className="h-4 w-4" />
              Mark my attendance
            </>
          )}
        </Button>
      )}

      <Button asChild variant="outline" className="w-full">
        <Link href={`/attendance/${courseId}`}>View your attendance history</Link>
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You need to be within {VENUE_RADIUS_METRES}m of the venue, with location
        access enabled.
      </p>
    </PageShell>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
