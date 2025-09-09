import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

// mock student attendance
const students = [
  { id: "s1", name: "Alice Johnson", status: "Present" },
  { id: "s2", name: "Bob Smith", status: "Pending" },
  { id: "s3", name: "Charlie Brown", status: "Present" },
];

export default function CourseStudentsPage() {
  const { courseId } = useParams();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Students for Course: {courseId}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={student.status === "Present" ? "default" : "secondary"}
                    >
                      {student.status}
                    </Badge>
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
