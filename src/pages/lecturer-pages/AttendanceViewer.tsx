import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Element, scroller } from "react-scroll";

type Course = {
  id: string;
  code: string;
  title: string;
};

type Attendance = {
  name: string;
  matricNo: string;
  date: string;
  time: string;
};

const courses: Course[] = [
  { id: "phs102", code: "PHS102", title: "General Physics" },
  { id: "chm103", code: "CHM103", title: "Inorganic Chemistry" },
  { id: "csc104", code: "CSC104", title: "Intro to Programming" },
  { id: "ele202", code: "ELE202", title: "Applied Electricity" },
];

const mockAttendance: Record<string, Attendance[]> = {
  csc104: [
    {
      name: "John Doe",
      matricNo: "CSC/20/001",
      date: "2025-08-07",
      time: "08:15 AM",
    },
    {
      name: "Jane Smith",
      matricNo: "CSC/20/002",
      date: "2025-08-07",
      time: "08:17 AM",
    },
  ],
  abe204: [
    {
      name: "Alice Brown",
      matricNo: "ABE/20/003",
      date: "2025-08-07",
      time: "09:05 AM",
    },
  ],
};

export default function AttendanceViewer() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);

    // Scroll smoothly to the attendance section
    scroller.scrollTo("attendance-table", {
      smooth: true,
      offset: -80,
      duration: 500,
    });
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto py-10 px-4 space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">View Students Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={selectedCourse?.id === course.id ? "default" : "outline"}
                  onClick={() => handleCourseClick(course)}
                  className="text-sm"
                >
                  {course.code} - {course.title}
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <Element name="attendance-table">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedCourse
                  ? `Attendance for ${selectedCourse.code} - ${selectedCourse.title}`
                  : "Attendance Viewer"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCourse ? (
                mockAttendance[selectedCourse.id]?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Matric No.</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAttendance[selectedCourse.id].map((student, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.matricNo}</TableCell>
                          <TableCell>{student.date}</TableCell>
                          <TableCell>{student.time}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-sm"
                  >
                    No attendance records yet for this course.
                  </motion.p>
                )
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center text-gray-500 text-sm"
                >
                  Select a course above to view student attendance.
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Element>
    </motion.div>
  );
}
