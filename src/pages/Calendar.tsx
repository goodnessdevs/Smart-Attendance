// import { useState } from "react";
// // import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Separator } from "../components/ui/separator";

// const courseEvents = [
//   {
//     date: "2025-07-15",
//     course: "PHS 101",
//     time: "9:00 AM - 11:00 AM",
//     lecturer: "Dr. Stella Okafor",
//   },
//   {
//     date: "2025-07-17",
//     course: "CSC 101",
//     time: "2:00 PM - 4:00 PM",
//     lecturer: "Mr. John Musa",
//   },
// ];

// function CalendarPage() {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const currentMonth = today.getMonth();

//   const [selectedEvent, setSelectedEvent] = useState(null);

//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//   const startDay = new Date(currentYear, currentMonth, 1).getDay();

//   const getEventForDate = (dateNum: any) => {
//     const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
//       dateNum
//     ).padStart(2, "0")}`;
//     return courseEvents.find((event) => event.date === dateStr);
//   };

//   return (
//     <motion.div
//       className="p-6 max-w-4xl mx-auto"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       <h1 className="text-3xl font-bold mb-6 text-primary">📅 Course Calendar</h1>

//       <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//           <div key={day} className="font-semibold text-muted-foreground">
//             {day}
//           </div>
//         ))}

//         {Array.from({ length: startDay }).map((_, i) => (
//           <div key={"blank-" + i} />
//         ))}

//         {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dateNum) => {
//           const event = getEventForDate(dateNum);
//           const isToday = dateNum === today.getDate();

//           return (
//             <Button
//               key={dateNum}
//               variant={event ? "outline" : "ghost"}
//               className={`h-16 flex flex-col items-center justify-center ${
//                 isToday ? "ring-2 ring-blue-500" : ""
//               }`}
//               onClick={() => setSelectedEvent(event ?? null)}
//             >
//               <span>{dateNum}</span>
//               {event && <span className="text-xs text-muted-foreground">{event.course}</span>}
//             </Button>
//           );
//         })}
//       </div>

//       <Separator className="my-6" />

//       {selectedEvent ? (
//         <Card className="mt-4">
//           <CardHeader>
//             <CardTitle>{selectedEvent.course}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p>
//               <strong>Date:</strong> {selectedEvent.date}
//             </p>
//             <p>
//               <strong>Time:</strong> {selectedEvent.time}
//             </p>
//             <p>
//               <strong>Lecturer:</strong> {selectedEvent.lecturer}
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <p className="text-muted-foreground text-center">Select a date to view course info.</p>
//       )}
//     </motion.div>
//   );
// }

// export default CalendarPage;

"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const sessionActivities = [
  { activity: "Resumption", date: "Monday, Sept 16, 2025" },
  { activity: "Orientation for Freshers", date: "Tuesday, Sept 17, 2025" },
  { activity: "Lectures Begin", date: "Wednesday, Sept 18, 2025" },
  { activity: "Mid-Semester Break", date: "Oct 28 - Nov 3, 2025" },
  { activity: "Examination Starts", date: "Monday, Dec 2, 2025" },
  { activity: "Examination Ends", date: "Friday, Dec 13, 2025" },
  { activity: "End of Semester Break", date: "Dec 14, 2025 – Jan 5, 2026" },
  { activity: "Second Semester Begins", date: "Monday, Jan 6, 2026" },
  { activity: "Lectures Resume", date: "Tuesday, Jan 7, 2026" },
  { activity: "Second Semester Exams", date: "April 14–25, 2026" },
  { activity: "Session Ends", date: "April 30, 2026" },
];

const MotionCard = motion(Card);

export default function CalendarPage() {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      viewport={{ once: false }}
      className="md:w-4xl w-[450px] mx-auto my-10 shadow-lg"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          2025/2026 Academic Session Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base font-semibold">
                Activity
              </TableHead>
              <TableHead className="text-base font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionActivities.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="p-4">{item.activity}</TableCell>
                <TableCell className="p-4">{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </MotionCard>
  );
}
