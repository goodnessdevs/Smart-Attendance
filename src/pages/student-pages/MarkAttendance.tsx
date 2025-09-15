import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthContext } from "../../hooks/use-auth";
import { GeolocationService } from "../../lib/geolocation";
import confetti from "canvas-confetti";
import { getDeviceInfo } from "../../utils/deviceUtils";
import { Loader2 } from "lucide-react";
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
      // Run geolocation + device info in parallel
      const [pos, deviceInfo] = await Promise.all([
        GeolocationService.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000, // shorter timeout for responsiveness
          maximumAge: 60000,
        }),
        getDeviceInfo(),
      ]);

      // --- Check geolocation ---
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
    <div>
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
              disabled={loading || attendanceMarked}
              className="mt-4 w-full  bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex justify-center items-center gap-x-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Verifying...
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

      <div className="flex justify-center w-full mt-8">
        <Link to={`/attendance/${courseId}`}>
          <Button>View Your Attendance</Button>
        </Link>
      </div>
    </div>
  );
}

export default MarkAttendance;
