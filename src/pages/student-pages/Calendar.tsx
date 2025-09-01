import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const sessionActivities = [
  {
    activity:
      "Registration, Medical Screening, ICT Training & Orientation for Fresh Students",
    date: "Monday, August 25, 2025",
  },
  {
    activity: "Registration for Returning Students",
    date: "Monday, September 1, 2025",
  },
  {
    activity: "First Semester Lectures for Returning Students Begin",
    date: "Monday, September 08, 2025",
  },
  {
    activity: "First Semester Lectures for Fresh Students Begin",
    date: "Monday, September 08, 2025",
  },
  {
    activity: "104th Inaugural Lecture",
    date: "Wednesday, September 17, 2025",
  },
  {
    activity: "Late Registration with Penalty Begins",
    date: "Saturday, October 11, 2025",
  },
  { activity: "Matriculation", date: "Wednesday, October 15, 2025" },
  { activity: "105th Inaugural Lecture", date: "Wednesday, October 15, 2025" },
  { activity: "106th Inaugural Lecture", date: "Wednesday, October 29, 2025" },
  {
    activity:
      "Late Registration with Penalty Ends & Registration Portal Closes",
    date: "Sunday, November 16, 2025",
  },
  { activity: "First Semester CAT Begins", date: "Monday, November 24, 2025" },
  { activity: "107th Inaugural Lecture", date: "Wednesday, December 03, 2025" },
  {
    activity: "First Semester Lectures End",
    date: "Friday, December 05, 2025",
  },
  { activity: "First Semester CAT Ends", date: "Friday, December 05, 2025" },
  {
    activity: "First Semester Examinations Begin",
    date: "Monday, December 15, 2025",
  },
  {
    activity: "First Semester Examinations End",
    date: "Monday, January 12, 2026",
  },
  {
    activity: "Second Semester Lectures Begin",
    date: "Monday, January 26, 2026",
  },
  { activity: "108th Inaugural Lecture", date: "Wednesday, January 28, 2026" },
  { activity: "109th Inaugural Lecture", date: "Wednesday, February 11, 2026" },
  {
    activity: "Special Senate to Consider First Semester Examination Results",
    date: "Thursday, February 26, 2026",
  },
  { activity: "110th Inaugural Lecture", date: "Wednesday, March 04, 2026" },
  { activity: "Second Semester CAT Begins", date: "Monday, April 13, 2026" },
  { activity: "111th Inaugural Lecture", date: "Wednesday, March 25, 2026" },
  { activity: "112th Inaugural Lecture", date: "Wednesday, April 08, 2026" },
  { activity: "113th Inaugural Lecture", date: "Wednesday, April 22, 2026" },
  { activity: "Second Semester Lectures End", date: "Friday, April 24, 2026" },
  {
    activity: "Second Semester Examinations Begin",
    date: "Monday, May 04, 2026",
  },
  {
    activity: "Second Semester Examinations End",
    date: "Friday, May 22, 2026",
  },
  {
    activity:
      "Special Senate to Consider Second Semester Examination Results and End of Session",
    date: "Thursday, July 09, 2026",
  },
];

const MotionCard = motion.create(Card);

export default function CalendarPage() {
  return (
    <div className="px-4">
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        viewport={{ once: false }}
        className="w-full max-w-3xl mx-auto my-12 shadow-xl rounded-2xl border border-gray-700 dark:border-gray-200 bg-gradient-to-b from-yellow-100 to-white text-black"
      >
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-3xl font-bold text-center">
            Federal University of Agriculture, Abeokuta <br />
            2025/2026 Session Academic Calendar
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-300">
                  <TableHead className="text-base font-semibold text-gray-700">
                    Activity
                  </TableHead>
                  <TableHead className="text-base font-semibold text-gray-700 md:text-center">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sessionActivities.map((item, index) => (
                  <TableRow
                    key={index}
                  >
                    <TableCell className="p-4 font-medium">
                      {item.activity}
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      {item.date}
                    </TableCell>
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
