import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/use-auth";

// --- Course type ---
type Course = {
  _id: string;
  courseName: string;
  courseTitle: string;
  courseId: string;
  courseDescription: string;
  venueName: string;
  lat: number;
  long: number;
  isActive: boolean;
};

export default function Dashboard() {
  const { token, user, isInitializing } = useAuthContext();
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // --- Stats (mocked for now) ---
  const totalCourses = activeCourses.length;
  const attendancesMarked = activeCourses.filter((c) => !c.isActive).length;
  const missedClasses = activeCourses.filter((c) => c.isActive).length;

  const attendancePercentage =
    totalCourses > 0 ? Math.round((attendancesMarked / totalCourses) * 100) : 0;

  useEffect(() => {
    document.title = "Student Dashboard | Smartendance";

    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "View your attendance dashboard in Smartendance."
      );
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = "View your attendance dashboard in Smartendance.";
      document.head.appendChild(newMeta);
    }
  }, []);

  // Fetch active courses
  useEffect(() => {
    const fetchActiveCourses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/active-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch active courses");
        const data = await res.json();
        setActiveCourses(data.courses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchActiveCourses();
  }, [token]);

  // --- Auth loading ---
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 mb-12">
      {/* Welcome Section */}
      <div className="mt-12 mb-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <h1 className="text-4xl font-bold">
            Hello,{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-500 dark:from-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
              {user ? `${user.matricNumber}!` : "Student"}
            </span>
          </h1>
        </motion.div>
      </div>

      {/* --- Stats & Attendance Tracker --- */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Stats Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-xl font-semibold mb-4">Attendance Overview</h3>
            <p className="text-sm">Total Courses: {totalCourses}</p>
            <p className="text-sm">Attendances Marked: {attendancesMarked}</p>
            <p className="text-sm">Missed Classes: {missedClasses}</p>
            <p className="text-sm text-muted-foreground">
              Last attendance: <span>{new Date().toLocaleDateString()}</span>
            </p>
          </CardContent>
        </Card>

        {/* Circular Progress Tracker */}
        <Card className="shadow-lg flex items-center justify-center">
          <CardContent className="flex flex-col items-center p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance Progress</h3>
            <motion.svg
              width="140"
              height="140"
              viewBox="0 0 120 120"
              initial={{ rotate: -90 }}
              className="transform"
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                stroke="#06b6d4"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={
                  2 * Math.PI * 50 * (1 - attendancePercentage / 100)
                }
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 50 * (1 - attendancePercentage / 100),
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </motion.svg>
            <p className="mt-4 text-lg font-bold text-cyan-600">
              {attendancePercentage}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-5">Active Courses</h3>

            {loadingCourses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
              </div>
            ) : activeCourses.length === 0 ? (
              <p className="text-muted-foreground">
                No active courses available.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {activeCourses.map((course) => (
                  <Link
                    key={course.courseId}
                    to={`/course/${course.courseId}`}
                    className="block p-5 rounded-xl border shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 bg-white dark:bg-slate-900"
                  >
                    <div>
                      <h4 className="font-semibold text-lg">
                        {course.courseName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {course.courseTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {course.courseDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
