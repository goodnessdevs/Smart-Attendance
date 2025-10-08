// import { motion } from "framer-motion";
// import { Card, CardContent } from "../../components/ui/card";
// import { useState, useEffect } from "react";
// import { Loader2 } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useAuthContext } from "../../hooks/use-auth";
// import { useSEO } from "../../hooks/useSEO";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "../../components/ui/carousel";
// import Autoplay from "embla-carousel-autoplay";

// // --- Course type ---
// type Course = {
//   _id: string;
//   courseName: string;
//   courseTitle: string;
//   courseId: string;
//   courseDescription: string;
//   venueName: string;
//   lat: number;
//   long: number;
//   isActive: boolean;
// };

// export default function Dashboard() {
//   const { token, user, isInitializing } = useAuthContext();
//   const [activeCourses, setActiveCourses] = useState<Course[]>([]);
//   const [loadingCourses, setLoadingCourses] = useState(true);

//   // --- Stats (mocked for now) ---
//   const totalCourses = activeCourses.length;
//   const attendancesMarked = activeCourses.filter((c) => !c.isActive).length;
//   const missedClasses = activeCourses.filter((c) => c.isActive).length;

//   // const attendancePercentage =
//   //   totalCourses > 0 ? Math.round((attendancesMarked / totalCourses) * 100) : 0;

//   useSEO({
//     title: "Student Dashboard | Smartendance",
//     description:
//       "Track your attendance, view courses, and manage your student account with Smartendance.",
//     url: "https://smartendance.vercel.app/dashboard",
//     type: "website",
//   });

//   // Fetch active courses
//   useEffect(() => {
//     const fetchActiveCourses = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL}/active-courses`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error("Failed to fetch active courses");
//         const data = await res.json();
//         setActiveCourses(data.courses);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoadingCourses(false);
//       }
//     };

//     fetchActiveCourses();
//   }, [token]);

//   // --- Auth loading ---
//   if (isInitializing) {
//     return (
//       <div className="flex items-center justify-center h-screen gap-x-3">
//         <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
//         <p className="text-lg font-semibold">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="px-4 md:px-8 mb-12">
//       <Carousel plugins={[
//               Autoplay({
//                 delay: 3000, // 3 seconds per slide
//               }),
//             ]}
//             className="w-full max-w-2xl mx-auto">
//         <CarouselContent>
//           <CarouselItem>
//             <Card className="text-center">
//               <CardContent>
//                 <h1 className="text-4xl font-bold">
//                   Hello,{" "}
//                   <span className="bg-gradient-to-r from-cyan-600 to-blue-500 dark:from-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
//                     {user ? `${user.matricNumber}!` : "Student"}
//                   </span>
//                 </h1>
//               </CardContent>
//             </Card>
//           </CarouselItem>

//           <CarouselItem>
//             <Card className="shadow-lg">
//               <CardContent className="p-6 space-y-3">
//                 <h3 className="text-xl font-semibold mb-4">
//                   Attendance Overview
//                 </h3>
//                 <p className="text-sm">Total Courses: {totalCourses}</p>
//                 <p className="text-sm">
//                   Attendances Marked: {attendancesMarked}
//                 </p>
//                 <p className="text-sm">Missed Classes: {missedClasses}</p>
//                 <p className="text-sm text-muted-foreground">
//                   Last attendance:{" "}
//                   <span>{new Date().toLocaleDateString()}</span>
//                 </p>
//               </CardContent>
//             </Card>
//             {/* </div> */}
//           </CarouselItem>
//           {/* <CarouselItem>...</CarouselItem> */}
//         </CarouselContent>
//         <CarouselPrevious />
//         <CarouselNext />
//       </Carousel>
//       {/* Welcome Section */}

//       {/* Courses Section */}
//       <motion.div
//         initial={{ y: 40, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         <Card
//           className="shadow-xl bg-gradient-to-br from-white via-gray-50 to-gray-100
//                    dark:from-zinc-950 dark:via-zinc-800 dark:to-zinc-950"
//         >
//           <CardContent className="p-6">
//             <h3 className="text-xl font-semibold mb-5">Active Courses</h3>

//             {loadingCourses ? (
//               <div className="flex items-center justify-center py-8">
//                 <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
//               </div>
//             ) : activeCourses.length === 0 ? (
//               <p className="text-muted-foreground">
//                 No active courses available.
//               </p>
//             ) : (
//               <div className="grid md:grid-cols-2 gap-4">
//                 {activeCourses.map((course) => (
//                   <Link
//                     key={course.courseId}
//                     to={`/course/${course.courseId}`}
//                     className="block p-5 rounded-xl border shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 bg-gradient-to-r from-cyan-600 to-blue-500 dark:from-cyan-300 dark:to-blue-400 text-white dark:text-zinc-900"
//                   >
//                     <div>
//                       <h4 className="font-semibold text-lg">
//                         {course.courseName}
//                       </h4>
//                       <p className="text-sm">{course.courseTitle}</p>
//                       <p className="text-xs mt-1">{course.courseDescription}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "../../components/ui/carousel";

import { useAuthContext } from "../../hooks/use-auth";
import { useSEO } from "../../hooks/useSEO";

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

  // --- Stats ---
  const totalCourses = activeCourses.length;
  const attendancesMarked = activeCourses.filter((c) => !c.isActive).length;
  // const missedClasses = activeCourses.filter((c) => c.isActive).length;

  // --- SEO ---
  useSEO({
    title: "Student Dashboard | Smartendance",
    description:
      "Track your attendance, view courses, and manage your student account with Smartendance.",
    url: "https://smartendance.vercel.app/dashboard",
    type: "website",
  });

  // --- Fetch active courses ---
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
        setActiveCourses(data.courses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchActiveCourses();
  }, [token]);

  // --- Auth Loading ---
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // --- Main Return ---
  return (
    <div className="min-h-screen">
      {/* --- Top Carousel Section --- */}
      <div className="pb-20 mt-10">
        <div className="px-4 md:px-8 pt-8">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {/* --- Greeting Slide --- */}
              <CarouselItem>
                <Card className="border-0 shadow-md bg-white/95 dark:bg-green-700/95 backdrop-blur h-[280px]">
                  <CardContent className="py-12 px-6 h-full flex flex-col items-center justify-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-center">
                      Welcome back,{" "}
                      <span className="bg-gradient-to-r from-cyan-600 to-blue-500 dark:from-cyan-950 dark:to-zinc-900 bg-clip-text text-transparent">
                        {user ? user.matricNumber : "Student"}!
                      </span>
                    </h1>
                    <p className="text-center text-accent-foreground mt-3">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>

              {/* --- Attendance Overview Slide --- */}
              <CarouselItem>
                <Card className="border-0 shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur h-[280px]">
                  <CardContent className="py-8 px-6 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold">
                        Attendance Overview
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 font-normal">
                        Your course attendance summary for today
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
                        <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                          {totalCourses}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Active Courses
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {attendancesMarked}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Attended
                        </p>
                      </div>
                      {/* <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          {missedClasses}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Missed
                        </p>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>

            {/* <CarouselPrevious className="hidden md:block left-2 bg-white/90 dark:bg-zinc-800/90" />
            <CarouselNext className="hidden md:block right-2 bg-white/90 dark:bg-zinc-800/90" /> */}
          </Carousel>
        </div>
      </div>

      {/* --- Active Courses Section --- */}
      <div className="px-4 md:px-8 -mt-12 pb-12">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Active Courses</h3>
                <span className="text-sm text-muted-foreground">
                  {activeCourses.length} course
                  {activeCourses.length !== 1 ? "s" : ""}
                </span>
              </div>

              {loadingCourses ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                </div>
              ) : activeCourses.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    No active courses available at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCourses.map((course, index) => (
                    <motion.div
                      key={course.courseId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/course/${course.courseId}`} className="block">
                        <Card className="border hover:border-cyan-500 dark:hover:border-cyan-400 transition-all hover:shadow-lg group">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                    {course.courseName.substring(0, 2)}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                      {course.courseName}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {course.courseTitle}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                  {course.courseDescription}
                                </p>
                                {course.venueName && (
                                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                    <span className="font-semibold">
                                      Venue:
                                    </span>
                                    {course.venueName}
                                  </p>
                                )}
                              </div>
                              <div
                                className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
                                  course.isActive
                                    ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                }`}
                              >
                                {course.isActive ? "Active" : "Inactive"}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
