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

const MotionCard = motion.create(Card);

export default function CalendarPage() {
  return (
    <div>
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        viewport={{ once: false }}
        className="w-full max-w-full md:w-full mx-auto my-10 shadow-lg"
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            2025/2026 Academic Session Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md w-full mx-auto">
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
          </div>
        </CardContent>
      </MotionCard>
    </div>
  );
}
