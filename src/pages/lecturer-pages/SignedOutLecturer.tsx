import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MotionButton = motion.create(Button);

export default function SignedOutLecturerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start mt-24 md:mt-32 overflow-hidden">
      {/* Animated background canvas-like effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold tracking-tight mb-10"
        >
          Welcome to{" "}
          <span className="text-green-700 dark:text-green-300">
            Smart Attendance
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg leading-relaxed mb-8 md:mb-16"
        >
          Easily{" "}
          <span className="font-semibold">
            manage attendance, monitor students, and oversee your courses
          </span>{" "}
          in real-time. Sign in with your lecturer account to access your
          teaching dashboard.
        </motion.p>

        <MotionButton
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          size="lg"
          onClick={() => navigate("/lecturer/login")}
          className="w-fit text-center mx-auto animate-bounce flex items-center gap-2 cursor-pointer"
        >
          <GraduationCap size={18} /> Sign In
        </MotionButton>
      </div>
    </div>
  );
}
