import { motion } from "framer-motion";
import MarkAttendance from "../components/MarkAttendance";

export default function Dashboard() {

  return (
    <div className="px-4 md:mx-4 mb-12 md:mb-0">
      <div className="mt-14 mb-6">
        <motion.h1 
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", type:"spring", stiffness: 120 }}
        className="text-4xl text-center font-bold">Welcome, <span className="text-cyan-700 dark:text-cyan-200 text-5xl">20251234!</span></motion.h1>
      </div>
      <motion.h2
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl font-semibold mb-6 md:mt-2 mt-14"
      >
        Attendance Dashboard – <span className="text-cyan-700 dark:text-cyan-200">Mark Courses</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <MarkAttendance />
      </motion.div>
    </div>
  );
}
