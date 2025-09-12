import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/use-auth";
import SignedOutDashboard from "./SignedOutDashboard";

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
        console.log(data, data.courses);
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

  if (!token) return <SignedOutDashboard />;

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
                    className={`block p-5 rounded-xl border shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 ${
                      course.isActive
                        ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20"
                        : "bg-green-50 border-green-200 dark:bg-green-900/20"
                    }`}
                  >
                    <div className="flex justify-between items-center">
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
                      {course.isActive ? (
                        <motion.span
                          animate={{ scale: [0.9, 1.1, 0.9] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="px-3 py-1 rounded-full text-xs font-semibold shadow bg-yellow-100 text-yellow-700 border border-yellow-200"
                        >
                          Pending
                        </motion.span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold shadow bg-green-100 text-green-700 border border-green-200">
                          Marked
                        </span>
                      )}
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
