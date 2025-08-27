// import { Checkbox } from "./ui/checkbox";
// import { Badge } from "./ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "./ui/table";
// import { useState } from "react";
// import confetti from "canvas-confetti";
// import { toast } from "sonner";

// type Course = {
//   id: number;
//   title: string;
//   code: string;
//   status: "Marked" | "Pending";
//   date: string;
// };

// const initialCourses: Course[] = [
//   {
//     id: 1,
//     title: "Introduction to Entrepreneurship",
//     code: "ETS 206",
//     status: "Pending",
//     date: "2025-08-02",
//   },
//   {
//     id: 2,
//     title: "Applied Electricity II",
//     code: "ELE 202",
//     status: "Marked",
//     date: "2025-07-30",
//   },
//   {
//     id: 3,
//     title: "Fluid Mechanics",
//     code: "MCE 205",
//     status: "Pending",
//     date: "2025-08-01",
//   },
//   {
//     id: 4,
//     title: "Workshop Practice",
//     code: "ABE 204",
//     status: "Marked",
//     date: "2025-07-28",
//   },
// ];

// function MarkAttendance() {
//   const [courses, setCourses] = useState(initialCourses);

//   const handleMarkAttendance = (id: number) => {
//     setCourses((prev) =>
//       prev.map((course) =>
//         course.id === id
//           ? {
//               ...course,
//               status: "Marked",
//               date: new Date().toISOString().split("T")[0],
//             }
//           : course
//       )
//     );

//     // Toast message
//     toast.success("Attendance marked successfully!");

//     // Confetti burst
//     confetti({
//       particleCount: 120,
//       spread: 80,
//       origin: { y: 0.6 },
//     });
//   };

//   return (
//     <Table className="min-w-full text-sm">
//       <TableHeader className="border-b">
//         <TableRow className="bg-muted">
//           <TableHead className="text-left p-4">Course</TableHead>
//           <TableHead className="text-left p-4">Status</TableHead>
//           <TableHead className="text-left p-4">Date</TableHead>
//           <TableHead className="text-left p-4">Mark</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {courses.map((course) => (
//           <TableRow key={course.id} className="border-b hover:bg-muted/50">
//             <TableCell className="p-4 font-medium">{course.code}</TableCell>
//             <TableCell className="p-4">
//               <Badge
//                 variant={course.status === "Marked" ? "success" : "warning"}
//                 className="capitalize"
//               >
//                 {course.status}
//               </Badge>
//             </TableCell>
//             <TableCell className="p-4 text-gray-900 dark:text-gray-400">
//               {course.date}
//             </TableCell>
//             <TableCell className="p-4">
//               {course.status === "Pending" ? (
//                 <Checkbox
//                   onCheckedChange={() => handleMarkAttendance(course.id)}
//                   className="cursor-pointer"
//                 />
//               ) : (
//                 <span className="text-sm text-muted-foreground">Done</span>
//               )}
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// export default MarkAttendance;

import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

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

function MarkAttendance({ locationGranted }: { locationGranted: boolean }) {
  const [courses, setCourses] = useState(initialCourses);

  const handleMarkAttendance = (id: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id
          ? {
              ...course,
              status: "Marked",
              date: new Date().toISOString().split("T")[0],
            }
          : course
      )
    );

    toast.success("Attendance marked successfully!");
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <Table className="min-w-full text-sm">
      <TableHeader className="border-b">
        <TableRow className="bg-muted">
          <TableHead className="text-left p-4">Course</TableHead>
          <TableHead className="text-left p-4">Status</TableHead>
          <TableHead className="text-left p-4">Date</TableHead>
          <TableHead className="text-left p-4">Mark</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id} className="border-b hover:bg-muted/50">
            <TableCell className="p-4 font-medium">{course.code}</TableCell>
            <TableCell className="p-4">
              <Badge
                variant={course.status === "Marked" ? "success" : "warning"}
                className="capitalize"
              >
                {course.status}
              </Badge>
            </TableCell>
            <TableCell className="p-4 text-gray-900 dark:text-gray-400">
              {course.date}
            </TableCell>
            <TableCell className="p-4">
              {course.status === "Pending" ? (
                <Checkbox
                  disabled={!locationGranted}
                  onCheckedChange={() => handleMarkAttendance(course.id)}
                  className="cursor-pointer"
                />
              ) : (
                <span className="text-sm text-muted-foreground">Done</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default MarkAttendance;
