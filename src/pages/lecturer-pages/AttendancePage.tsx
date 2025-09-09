import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// mock active courses
const activeCourses = [
  { courseId: "c1", courseName: "Math 101", courseTitle: "Introduction to Algebra" },
  { courseId: "c2", courseName: "PHY 201", courseTitle: "Fundamentals of Mechanics" },
];

export default function StudentsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Courses & Student Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeCourses.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell className="font-medium">{course.courseName}</TableCell>
                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/lecturer/students/${course.courseId}`)}
                    >
                      View Students
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
