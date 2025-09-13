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
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { AutoPlayCarousel } from "./AutoPlayCarousel";
import Footer from "./Footer";
import { useAuthContext } from "../hooks/use-auth";

export default function SignedOutDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const {token, user} = useAuthContext();

  // Decide role from URL
  const path = location.pathname;
  let role: "student" | "lecturer" | "admin" = "student";
  if (path.startsWith("/lecturer")) role = "lecturer";
  if (path.startsWith("/admin")) role = "admin";

  // If already signed in → redirect them
  if (token) {
    if (user?.isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  // Role-based content
  const roleConfig = {
    student: {
      title: "Welcome to Smart Attendance",
      description:
        "Track your classes, mark attendance, and stay connected with your lecturers.",
      loginPath: "/login",
      icon: <Users size={18} />,
      buttonText: "Sign In",
      slides: [
        {
          title: "Welcome Student",
          description: "Access your courses and track progress.",
        },
        {
          title: "Attendance",
          description: "Mark and review your attendance easily.",
        },
        {
          title: "Updates",
          description:
            "Stay updated with session calendars, dedicated support, and direct messages from lecturers or admins.",
        },
      ],
    },
    lecturer: {
      title: "Welcome Lecturer",
      description:
        "Manage attendance, oversee your courses, and monitor student engagement in real-time.",
      loginPath: "/lecturer/login",
      icon: <GraduationCap size={18} />,
      buttonText: "Sign In",
      slides: [
        {
          title: "Welcome Lecturer",
          description: "Manage your courses and students.",
        },
        {
          title: "Publish Courses",
          description:
            "Easily publish courses to your students for marking attendance.",
        },
        {
          title: "Track Attendance",
          description: "Monitor student engagement in real-time.",
        },
      ],
    },
    admin: {
      title: "Welcome Admin",
      description:
        "Oversee the platform, manage courses, and support both lecturers and students.",
      loginPath: "/admin/login",
      icon: <Shield size={18} />,
      buttonText: "Sign In",
      slides: [
        {
          title: "Welcome Admin",
          description: "Oversee the platform at a glance.",
        },
        {
          title: "Manage Courses",
          description: "create, delete, or update courses for students.",
        },
        {
          title: "Support",
          description: "Provide support for both lecturers and students.",
        },
      ],
    },
  };

  const { slides, loginPath, icon, buttonText } = roleConfig[role];

  return (
    <div>
      <div className="relative min-h-screen afacad-flux flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-cyan-100 via-green-700 to-green-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex justify-around items-center w-full mt-10"
      >
        <h1 className="text-3xl font-bold text-green-950">Smart Attendance</h1>

        <Button
          size="lg"
          onClick={() => navigate(loginPath)}
          className="text-center flex items-center gap-2 cursor-pointer"
        >
          {icon} {buttonText}
        </Button>
      </motion.div>

      {/* Content */}
      <AutoPlayCarousel items={slides} />

    </div>

    <Footer />
    </div>
  );
}
