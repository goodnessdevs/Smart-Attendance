// import { Loader2, Users } from "lucide-react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { motion, type Variants } from "framer-motion";
// import { useAuthContext } from "../../hooks/use-auth";
// import { Link } from "react-router-dom";

// // Animation variants
// const containerVariants: Variants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.15, // delay between children animations
//     },
//   },
// };

// const itemVariants: Variants = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
// };

// const MotionCard = motion(Card);

// export default function LecturerDashboard() {
//   const { isInitializing, user } = useAuthContext();

//   if (isInitializing) {
//     return (
//       <div className="flex items-center justify-center h-screen gap-x-3">
//         <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
//         <p className="text-lg font-semibold">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="max-w-4xl mx-auto py-12 px-4 space-y-12"
//       variants={containerVariants}
//       initial="hidden"
//       animate="show"
//     >
//       {/* Welcome Section */}
//       <motion.div className="text-center space-y-3" variants={itemVariants}>
//         <h1 className="text-4xl font-bold">Hello {user?.fullName}!</h1>
//         <p className="text-lg text-muted-foreground">
//           Manage your classes, track attendance, and stay connected with
//           students.
//         </p>
//       </motion.div>

//       {/* Statistics Cards */}
//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-1 gap-6"
//         variants={containerVariants}
//       >
//         {/* Active Courses */}
//         <Link to={'/lecturer/attendance-list'}>
//           <MotionCard initial={{scaleX: 1}} whileHover={{scaleX: 0.95}} className="hover:shadow-md transition">
//             <CardHeader className="flex flex-row items-center justify-between p-4">
//               <CardTitle>View Active Attendance list</CardTitle>
//               <Users className="w-6 h-6 text-cyan-600" />
//             </CardHeader>
//           </MotionCard>
//         </Link>

//      </motion.div>
//     </motion.div>
//   );
// }

import { Loader2, BookOpen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { motion, type Variants } from "framer-motion";
import { useAuthContext } from "../../hooks/use-auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const MotionCard = motion(Card);

type Attendance = {
  id: string;
  courseTitle: string;
  courseName: string;
  courseId: string;
  venueName: string;
};

export default function LecturerDashboard() {
  const { isInitializing, token, user } = useAuthContext();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/lecturer-active-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setAttendances(data.courses);
        } else {
          console.error(data.message || "Failed to fetch attendances");
        }
      } catch (error) {
        console.error("Error fetching attendances:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAttendances();
  }, [token]);

  if (isInitializing || loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto py-12 px-4 space-y-12"
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

      {/* Attendance List Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {attendances.length > 0 ? (
          attendances.map((attendance) => (
            <MotionCard
              key={attendance.id}
              variants={itemVariants}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="hover:shadow-lg transition"
            >
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle>{attendance.courseTitle}</CardTitle>
                <BookOpen className="w-6 h-6 text-cyan-600" />
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Course:</span>{" "}
                  {attendance.courseName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Venue:</span>{" "}
                  {attendance.venueName}
                </p>
              </CardContent>
              <CardFooter>
                <Link to={`/lecturer/attendance/${attendance.courseId}`}>
                  <Button>View</Button>
                </Link>
              </CardFooter>
            </MotionCard>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No published attendances found.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
