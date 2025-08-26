// import { motion } from "framer-motion";
// import TableComp from "../components/TimeTable";

// function Dashboard() {
//   return (
//     <div className="px-4 md:mx-4">

//       <motion.div
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="flex justify-center font-semibold p-4 mt-10 bg-accent shadow-lg rounded-2xl"
//       >
//         <TableComp />
//       </motion.div>
//     </div>
//   );
// }

// export default Dashboard;

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";

type Course = {
  id: number;
  title: string;
  code: string;
  status: "Marked" | "Pending";
  date: string;
};

const initialCourses: Course[] = [
  { id: 1, title: "Introduction to Entrepreneurship", code: "ETS 206", status: "Pending", date: "2025-08-02" },
  { id: 2, title: "Applied Electricity II", code: "ELE 202", status: "Marked", date: "2025-07-30" },
  { id: 3, title: "Fluid Mechanics", code: "MCE 205", status: "Pending", date: "2025-08-01" },
  { id: 4, title: "Workshop Practice", code: "ABE 204", status: "Marked", date: "2025-07-28" },
];

export default function Dashboard() {
  const [courses, setCourses] = useState(initialCourses);

  const handleMarkAttendance = (id: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id
          ? { ...course, status: "Marked", date: new Date().toISOString().split("T")[0] }
          : course
      )
    );

    // Toast message
    toast.success("Attendance marked successfully!");

    // Confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

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
        <Card className="shadow-lg">
          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr className="bg-muted">
                  <th className="text-left p-4">Course</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Mark</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{course.code}</td>
                    <td className="p-4">
                      <Badge
                        variant={course.status === "Marked" ? "success" : "warning"}
                        className="capitalize"
                      >
                        {course.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500">{course.date}</td>
                    <td className="p-4">
                      {course.status === "Pending" ? (
                        <Checkbox
                          onCheckedChange={() => handleMarkAttendance(course.id)}
                          className="cursor-pointer"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
