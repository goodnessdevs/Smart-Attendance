import { useEffect, useState } from "react";
import { Loader2, Users, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { motion, type Variants } from "framer-motion";
// import { toast } from "sonner";
import { useAuthContext } from "../../hooks/use-auth";
import { useNavigate } from "react-router-dom";
import SignedOutLecturerDashboard from "./SignedOutLecturer";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // delay between children animations
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};


interface Course {
  courseName: string;
  courseTitle: string;
  courseId: string;
  isActive: boolean;
}

export default function LecturerDashboard() {
  const { token, isInitializing, user } = useAuthContext();
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // ✅ Fetch active (published) courses
        const resCourses = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/publish-attendance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resCourses.ok) throw new Error("Failed to fetch active courses");
        const coursesData = await resCourses.json();
        setActiveCourses(coursesData || []);

        // ✅ Fetch student attendance stats
        const resStudents = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/students/attendance-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resStudents.ok) throw new Error("Failed to fetch student stats");
        const { total } = await resStudents.json();
        setTotalStudents(total || 0);
      } catch (error) {
        console.error(error);
        // toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!token) {
    return <SignedOutLecturerDashboard />;
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto py-12 px-4 space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Section */}
      <motion.div className="text-center space-y-3" variants={itemVariants}>
        <h1 className="text-4xl font-bold">Hello {user?.fullName}!</h1>
        <p className="text-lg text-muted-foreground">
          Manage your classes, track attendance, and stay connected with
          students.
        </p>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {/* Active Courses */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Courses</CardTitle>
              <BookOpen className="w-6 h-6 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? "…" : activeCourses.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Courses currently running attendance
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students */}
        <motion.div variants={itemVariants}>
          <Card
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => navigate("/lecturer/students")}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total Students</CardTitle>
              <Users className="w-6 h-6 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? "…" : totalStudents}
              </p>
              <p className="text-sm text-muted-foreground">
                Have marked attendance
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Overview of Active Courses */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <h3 className="text-xl font-semibold">Currently Running Courses</h3>
        {activeCourses.length === 0 ? (
          <p className="text-muted-foreground">
            No active courses at the moment.
          </p>
        ) : (
          <motion.ul
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {activeCourses.map((course) => (
              <motion.li
                key={course.courseId}
                className="p-3 border rounded-md bg-accent shadow-sm flex justify-between"
                variants={itemVariants}
              >
                <div>
                  <p className="font-medium">{course.courseName}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.courseTitle}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </motion.div>
  );
}
