// import { motion } from "framer-motion";
// import { Button } from "../../components/ui/button";
// import { UserLock } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const MotionButton = motion.create(Button);

// export default function SignedOutDashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-start mt-24 md:mt-32 overflow-hidden">
//       {/* Animated background canvas-like effect */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.3 }}
//         transition={{ duration: 1.5 }}
//         className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]"
//       />

//       {/* Content */}
//       <div className="relative z-10 max-w-3xl px-6 text-center">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-6xl font-bold tracking-tight mb-10"
//         >
//           Welcome to{" "}
//           <span className="text-green-700 dark:text-green-300">
//             Smart Attendance
//           </span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.8 }}
//           className="text-lg  leading-relaxed mb-8 md:mb-16"
//         >
//           Your all-in-one platform to mark{" "}
//           <span className="font-semibold">
//             your course attendance, and view your courses
//           </span>
//           . Sign in with your account to unlock personalized tools and real-time
//           updates.
//         </motion.p>

//         <MotionButton
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.8 }}
//           size="lg"
//           onClick={() => navigate("/login")}
//           className="w-fit text-center mx-auto animate-bounce flex items-center gap-2 cursor-pointer"
//         >
//           <UserLock size={18} /> Sign in
//         </MotionButton>
//       </div>
//     </div>
//   );
// }


import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { GraduationCap, Users, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SignedOutDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Decide role from URL
  const path = location.pathname;
  let role: "student" | "lecturer" | "admin" = "student";
  if (path.startsWith("/lecturer")) role = "lecturer";
  if (path.startsWith("/admin")) role = "admin";

  // Role-based content
  const roleConfig = {
    student: {
      title: "Welcome to Smart Attendance",
      description:
        "Track your classes, mark attendance, and stay connected with your lecturers.",
      loginPath: "/login",
      icon: <Users size={18} />,
      buttonText: "Student Sign In",
    },
    lecturer: {
      title: "Welcome Lecturer",
      description:
        "Manage attendance, oversee your courses, and monitor student engagement in real-time.",
      loginPath: "/lecturer/login",
      icon: <GraduationCap size={18} />,
      buttonText: "Lecturer Sign In",
    },
    admin: {
      title: "Welcome Admin",
      description:
        "Oversee the platform, manage courses, and support both lecturers and students.",
      loginPath: "/admin/login",
      icon: <Shield size={18} />,
      buttonText: "Admin Sign In",
    },
  };

  const { title, description, loginPath, icon, buttonText } = roleConfig[role];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start mt-24 md:mt-32 overflow-hidden">
      {/* Animated background */}
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
          className="text-5xl font-bold tracking-tight mb-8"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg leading-relaxed mb-10 md:mb-16"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Button
            size="lg"
            onClick={() => navigate(loginPath)}
            className="w-fit text-center mx-auto animate-bounce flex items-center gap-2 cursor-pointer"
          >
            {icon} {buttonText}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
