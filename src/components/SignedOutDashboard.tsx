import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  GraduationCap,
  Users,
  Shield,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { AutoPlayCarousel } from "./AutoPlayCarousel";
import { useAuthContext } from "../hooks/use-auth";
import { Separator } from "./ui/separator";

export default function SignedOutDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuthContext();

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
    <div className="bg-gradient-to-br from-cyan-50 via-green-600 to-green-950">
      <div className="relative min-h-screen afacad-flux flex flex-col items-center justify-start overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex justify-around items-center w-full mt-10"
        >
          <h1 className="text-2xl font-bold text-green-900">
            Smart Attendance
          </h1>

          <Button
            size="lg"
            onClick={() => navigate(loginPath)}
            className="text-center flex items-center gap-2 cursor-pointer bg-white hover:bg-zinc-200 text-black"
          >
            {icon} {buttonText}
          </Button>
        </motion.div>

        {/* Content */}
        <div className="min-h-screen md:mt-36 mt-28">
          <AutoPlayCarousel items={slides} />
        </div>
      </div>

      {/* Demo video */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 py-16 text-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
            Experience <span className="text-green-400">Our App</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10">
            A quick walkthrough of how everything works.
          </p>
        </motion.div>

        {/* Video inside a “mockup” card */}
        <motion.div
          initial={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative w-full sm:w-[90%] md:w-[80%] lg:w-[70%] rounded-2xl overflow-hidden shadow-2xl border border-green-500/40 bg-black"
        >
          <video
            src="/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
          />
          {/* Optional glowing border animation */}
          <div className="absolute inset-0 rounded-2xl ring-2 ring-green-400/30 animate-pulse pointer-events-none" />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white w-full afacad-flux">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row md:justify-between gap-10">
          {/* Logo and Title */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14">
                <img
                  src="/funaab.png"
                  alt="funaab"
                  className="object-cover w-full"
                />
              </div>
              <h2 className="text-2xl font-semibold">Smart Attendance</h2>
            </div>
          </div>

          <Separator className="md:hidden" />

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors">
              <Phone size={16} />
              <a href="tel:+2348012345678">+234 801 234 5678</a>
            </div>
            <div className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors">
              <Mail size={16} />
              <a href="mailto:info@smartattendance.com">
                info@smartattendance.com
              </a>
            </div>
          </div>

          <Separator className="md:hidden" />

          {/* Location Info */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} />
              <span>FUNAAB, Abeokuta, Ogun State, Nigeria</span>
            </div>
          </div>
        </div>

        {/* Copyright at the bottom */}
        <div className="border-t border-gray-700 mt-4 py-6 text-center text-sm">
          &copy; 2025, Smart Attendance. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
