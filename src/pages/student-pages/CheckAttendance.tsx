import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthContext } from "../../hooks/use-auth";
import { GeolocationService } from "../../lib/geolocation";
import confetti from "canvas-confetti";
import { getDeviceInfo } from "../../utils/deviceUtils";
import { Loader2 } from "lucide-react";

type ActiveCourse = {
  courseTitle: string;
  courseName: string;
  courseId: string;
  venueName: string;
  lat: number;
  long: number;
  isActive: boolean;
};

function CheckAttendance() {
  const { courseId } = useParams<{ courseId: string }>();
  const { token, user } = useAuthContext();

  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courseVenue, setCourseVenue] = useState<ActiveCourse | null>(null);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

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
        const course = data.courses.find(
          (c: ActiveCourse) => c.courseId === courseId
        );

        if (course) {
          setCourseVenue(course);
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
    if (!courseVenue) {
      toast.error("Venue not loaded yet");
      return;
    }

    setLoading(true);

    try {
      // --- Check geolocation ---
      const pos = await GeolocationService.getCurrentPosition();
      const { isWithin, distance } = GeolocationService.isWithinRadius(
        pos.coords.latitude,
        pos.coords.longitude,
        courseVenue.lat,
        courseVenue.long,
        30 // 30m radius check
      );

      if (!isWithin) {
        toast.error(
          `You are too far from the venue. Distance: ${distance.toFixed(1)}m`
        );
        setLoading(false);
        return;
      }

      // --- Check device identity ---
      const { device_uuid, fingerprint } = await getDeviceInfo();

      if (
        user?.device_uuid !== device_uuid || // 👈 replace with value from backend
        user?.fingerprint !== fingerprint
      ) {
        toast.error("Device authentication failed.");
        setLoading(false);
        return;
      }

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
            day: dayName,
            date: today.toLocaleDateString(),
            fullName: user?.fullName,
            email: user?.email,
            matricNo: user?.matricNumber,
            isPresent: true,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to mark attendance");
      }

      setAttendanceMarked(true);
      confetti();
      toast.success("🎉 Attendance marked successfully!");
    } catch (error) {
      // toast.error("Location access is required to mark attendance");
      // setLoading(false);
      // return;
      // toast.error(
      //   error instanceof Error ? error.message : "Something went wrong"
      // );
      console.error("Attendance marking error:", error);

      if (error instanceof GeolocationPositionError) {
        toast.error("Location access is required to mark attendance");
      } else if (error.message?.includes("fetch")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-accent rounded-xl p-5 shadow-md space-y-4">
        <p>
          <span className="font-medium">Course Title:</span>{" "}
          {courseVenue?.courseTitle}
        </p>
        <p>
          <span className="font-medium">Course Code:</span>{" "}
          {courseVenue?.courseName}
        </p>
        <p>
          <span className="font-medium">Day:</span> {dayName}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          {attendanceMarked ? (
            <span className="text-green-600 font-bold">Marked</span>
          ) : (
            <span className="text-yellow-600">Pending</span>
          )}
        </p>

        {!attendanceMarked && (
          <button
            onClick={handleMarkAttendance}
            disabled={loading}
            className="mt-4 w-full  bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex justify-center items-center gap-x-2">
                <Loader2 className="animate-spin w-4 h-4" /> Marking...
              </span>
            ) : (
              "Mark Attendance"
            )}
          </button>
        )}

        {attendanceMarked && (
          <motion.div
            className="mt-6 text-center text-green-700 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Your attendance has been marked successfully!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default CheckAttendance;
