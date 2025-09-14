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
    <div>
      <div className="relative min-h-screen afacad-flux flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-cyan-100 via-green-700 to-green-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{once: false}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex justify-around items-center w-full mt-10"
        >
          <h1 className="text-3xl font-bold text-green-950">
            Smart Attendance
          </h1>

          <Button
            size="lg"
            onClick={() => navigate(loginPath)}
            className="text-center flex items-center gap-2 cursor-pointer"
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
      <section className="relative flex flex-col items-center justify-center min-h-screen p-24 bg-gradient-to-br from-green-700 to-black text-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Experience <span className="text-green-400">Our App</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            A quick walkthrough of how everything works.
          </p>
        </motion.div>

        {/* Video inside a “mockup” card */}
        <motion.div
          initial={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
        >
          <video
            src="/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

// import { motion } from "framer-motion";
// import { Button } from "./ui/button";
// import { GraduationCap, Users, Shield, Play } from "lucide-react";
// import { useNavigate, useLocation, Navigate } from "react-router-dom";
// import { AutoPlayCarousel } from "./AutoPlayCarousel";
// import Footer from "./Footer";
// import { useAuthContext } from "../hooks/use-auth";

// export default function SignedOutDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { token, user } = useAuthContext();

//   let role: "student" | "lecturer" | "admin" = "student";
//   if (location.pathname.startsWith("/lecturer")) role = "lecturer";
//   if (location.pathname.startsWith("/admin")) role = "admin";

//   if (token) {
//     if (user?.isAdmin) return <Navigate to="/admin/dashboard" replace />;
//     return <Navigate to="/dashboard" replace />;
//   }

//   const roleConfig = {
//     student: {
//       title: "Welcome to Smart Attendance",
//       description:
//         "Track your classes, mark attendance, and stay connected with your lecturers.",
//       loginPath: "/login",
//       icon: <Users size={18} />,
//       buttonText: "Sign In",
//       slides: [
//         { title: "Welcome Student", description: "Access your courses and track progress." },
//         { title: "Attendance", description: "Mark and review your attendance easily." },
//         { title: "Updates", description: "Stay updated with session calendars, support, and messages." },
//       ],
//     },
//     lecturer: {
//       title: "Welcome Lecturer",
//       description:
//         "Manage attendance, oversee your courses, and monitor student engagement in real-time.",
//       loginPath: "/lecturer/login",
//       icon: <GraduationCap size={18} />,
//       buttonText: "Sign In",
//       slides: [
//         { title: "Welcome Lecturer", description: "Manage your courses and students." },
//         { title: "Publish Courses", description: "Easily publish courses for attendance." },
//         { title: "Track Attendance", description: "Monitor student engagement in real-time." },
//       ],
//     },
//     admin: {
//       title: "Welcome Admin",
//       description: "Oversee the platform, manage courses, and support lecturers and students.",
//       loginPath: "/admin/login",
//       icon: <Shield size={18} />,
//       buttonText: "Sign In",
//       slides: [
//         { title: "Welcome Admin", description: "Oversee the platform at a glance." },
//         { title: "Manage Courses", description: "Create, delete, or update courses for students." },
//         { title: "Support", description: "Provide support for both lecturers and students." },
//       ],
//     },
//   };

//   const { slides, loginPath, icon, buttonText } = roleConfig[role];

//   return (
//     <div className="relative overflow-hidden afacad-flux">
//       {/* Hero */}
//       <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 via-green-700 to-green-950 text-green-950">
//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-5xl md:text-6xl font-extrabold mb-4 text-center"
//         >
//           Smart Attendance
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="text-xl md:text-2xl text-center max-w-2xl mb-8"
//         >
//           Track your classes, mark attendance, and stay connected with lecturers and students.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//           className="flex gap-4"
//         >
//           <Button
//             size="lg"
//             className="flex items-center gap-2"
//             onClick={() => navigate(loginPath)}
//           >
//             {icon} {buttonText}
//           </Button>
//         </motion.div>
//       </section>

//       {/* Features / Carousel */}
//       <section className="min-h-screen">
//           <AutoPlayCarousel items={slides} />
//       </section>

//       {/* Demo Video */}
//       <section className="relative flex flex-col items-center justify-center py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="text-center max-w-5xl mx-auto mb-12"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Experience <span className="text-green-400">Our App</span>
//           </h2>
//           <p className="text-lg text-gray-300">
//             A quick walkthrough of how everything works.
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ scale: 0.95, opacity: 0 }}
//           whileInView={{ scale: 1, opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
//         >
//           <video
//             src="/demo.mp4"
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="w-full h-full object-cover rounded-3xl"
//           />

//           {/* Optional play overlay button */}
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <div className="bg-green-500 bg-opacity-50 p-6 rounded-full shadow-lg animate-pulse pointer-events-auto">
//               <Play className="w-8 h-8 text-white" />
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
