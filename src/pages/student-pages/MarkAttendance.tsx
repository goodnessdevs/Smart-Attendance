import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthContext } from "../../hooks/use-auth";
import { GeolocationService } from "../../lib/geolocation";
import confetti from "canvas-confetti";
import { getDeviceInfo } from "../../utils/deviceUtils";
import { BookCheck, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";

type ActiveCourse = {
  courseTitle: string;
  courseName: string;
  courseId: string;
  venueName: string;
  lat: number;
  long: number;
  isActive: boolean;
};

function MarkAttendance() {
  const { courseId } = useParams<{ courseId: string }>();
  const { token, user } = useAuthContext();

  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<ActiveCourse | null>(null);

  const today =  useMemo(() => new Date(), []);
  const dayName = today.toLocaleString();

  useEffect(() => {
    if (!courseId) return;

    const saved = localStorage.getItem(
      `attendance-${courseId}-${today.toLocaleString()}`
    );

    if (saved) {
      const data = JSON.parse(saved);
      if (data.isPresent) {
        setAttendanceMarked(true);
      }
    }
  }, [courseId, today]);

  // ✅ Fetch venue details for this course
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/active-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch course venues");

        const data = await res.json();
        const courseToMark = data.courses.find(
          (c: ActiveCourse) => c.courseId === courseId
        );

        if (courseToMark) {
          setCourse(courseToMark);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load venue details"
        );
      }
    };

    fetchVenue();
  }, [courseId, token]);

  // Mark attendance handler
  const handleMarkAttendance = async () => {
    if (!course) {
      toast.error("Venue not loaded yet");
      return;
    }

    setLoading(true);

    try {
      // Run geolocation + device info in parallel
      const [pos, deviceInfo] = await Promise.all([
        GeolocationService.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000, // shorter timeout for responsiveness
          maximumAge: 60000,
        }),
        getDeviceInfo(),
      ]);

      // --- Check geolocation ---
      const { isWithin, distance } = GeolocationService.isWithinRadius(
        pos.coords.latitude,
        pos.coords.longitude,
        course.lat,
        course.long,
        30 // 30m radius check
      );

      if (!isWithin) {
        toast.error(
          `You are too far from the venue. Distance: ${distance.toFixed(1)}m`
        );
        setLoading(false);
        return;
      }

      console.log("Backend:", user?.device_uuid, user?.fingerprint);
      console.log("Client:", deviceInfo.device_uuid, deviceInfo.fingerprint);

      // --- Check device identity ---
      // if (
      //   user?.device_uuid !== deviceInfo.device_uuid || // replace with value from backend
      //   user?.fingerprint !== deviceInfo.fingerprint
      // ) {
      //   toast.error("Device authentication failed.");
      //   setLoading(false);
      //   return;
      // }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mark-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId,
            courseName: course.courseName,
            venueName: course.venueName,
            courseTitle: course.courseTitle,
            day: dayName,
            date: today.toLocaleDateString(),
            fullName: user?.fullName,
            email: user?.email,
            isPresent: true,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to mark attendance");
      }

      localStorage.setItem(
        `attendance-${courseId}-${today.toLocaleString()}`,
        JSON.stringify({
          isPresent: true,
          courseName: course.courseName,
          courseTitle: course.courseTitle,
          venueName: course.venueName,
        })
      );

      setAttendanceMarked(true);
      confetti();
      toast.success("🎉 Attendance marked successfully!");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "code" in error) {
        const geolocationError = error as GeolocationPositionError;

        switch (geolocationError.code) {
          case 1:
            toast.error("Permission denied. Please enable location access.");
            break;
          case 2:
            toast.error("Position unavailable. Try again.");
            break;
          case 3:
            toast.error(
              "Request timed out. Please retry or try changing your browser."
            );
            break;
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-10">
      {/* Animated Card */}
      <motion.div
        className="w-full max-w-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 
                   dark:from-zinc-950 dark:via-zinc-800 dark:to-zinc-950 
                   rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
          <BookCheck /> Attendance Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium">Course Title:</span>{" "}
            {course?.courseTitle}
          </p>
          <p>
            <span className="font-medium">Course Code:</span>{" "}
            {course?.courseName}
          </p>
          <p>
            <span className="font-medium">Day:</span> {dayName}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {attendanceMarked ? (
              <span className="text-green-600 font-bold">Marked</span>
            ) : (
              <span className="text-yellow-600 font-medium">Pending</span>
            )}
          </p>
        </div>

        {/* Mark Attendance Button */}
        {!attendanceMarked && (
          <Button
            onClick={handleMarkAttendance}
            disabled={loading || attendanceMarked}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex justify-center items-center gap-x-2">
                <Loader2 className="animate-spin w-4 h-4" /> Verifying...
              </span>
            ) : (
              "Mark My Attendance"
            )}
          </Button>
        )}

        {/* Success Animation */}
        {attendanceMarked && (
          <motion.div
            className="flex flex-col items-center mt-6 text-green-700 dark:text-green-400 font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle2 className="w-12 h-12 mb-2" />
            Your attendance has been marked successfully!
          </motion.div>
        )}
      </motion.div>

      {/* View Attendance Button */}
      <div className="mt-10">
        <Link to={`/attendance/${courseId}`}>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            View Your Attendance
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default MarkAttendance;
