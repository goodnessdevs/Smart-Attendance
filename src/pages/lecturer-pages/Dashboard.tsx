import { Loader2, Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { motion, type Variants } from "framer-motion";
import { useAuthContext } from "../../hooks/use-auth";
import { Link } from "react-router-dom";

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

const MotionCard = motion(Card);

export default function LecturerDashboard() {
  const { isInitializing, user } = useAuthContext();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
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
        className="grid grid-cols-1 md:grid-cols-1 gap-6"
        variants={containerVariants}
      >
        {/* Active Courses */}
        <Link to={'/lecturer/attendance-list'}>
          <MotionCard initial={{scaleX: 1}} whileHover={{scaleX: 0.95}} className="hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle>View Active Attendance list</CardTitle>
              <Users className="w-6 h-6 text-cyan-600" />
            </CardHeader>
          </MotionCard>
        </Link>

     </motion.div>
    </motion.div>
  );
}
