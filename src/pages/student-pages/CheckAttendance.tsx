import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthContext } from "../../hooks/use-auth";

type Course = {
  id: string;
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  lecturers: string[];
  unit: string;
  venues: string[];
  days: string[];
  isActive: boolean;
};

function CheckAttendance() {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuthContext();

  const [course, setCourse] = useState<Course | null>(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch the course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch course details");
        }

        const data = await res.json();
        setCourse(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load course");
      }
    };

    if (courseId) {
      fetchCourse();
    }

    window.scrollTo(0, 0); // scroll to top on page load
  }, [courseId, token]);

  // Mark attendance handler
  const handleMarkAttendance = async () => {
    if (!course) return;

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/${course.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: false }),
      });

      if (!res.ok) {
        throw new Error("Failed to mark attendance");
      }

      setAttendanceMarked(true);
      setCourse({ ...course, isActive: false });
      toast.success("🎉 Attendance marked successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="p-4 text-center text-red-500 font-semibold">
        Course not found 😕
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-2 text-primary">{course.courseTitle}</h2>
      <p className="dark:text-gray-400 text-gray-700 text-2xs mb-6 font-semibold">
        {course.courseName}
      </p>

      <div className="bg-accent rounded-xl p-5 shadow-md space-y-4">
        <p>
          <span className="font-medium">Lecturers:</span> {course.lecturers}
        </p>
        <p>
          <span className="font-medium">Unit:</span> {course.unit}
        </p>
        <p>
          <span className="font-medium">Venues:</span> {course.venues}
        </p>
        <p>
          <span className="font-medium">Date:</span>{" "}
          {new Date().toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          {attendanceMarked || !course.isActive ? (
            <span className="text-green-600 font-bold">Marked</span>
          ) : (
            <span className="text-yellow-600">Pending</span>
          )}
        </p>

        {!attendanceMarked && course.isActive && (
          <button
            onClick={handleMarkAttendance}
            disabled={loading}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Marking..." : "Mark Attendance"}
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
