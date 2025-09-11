import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../../hooks/use-auth";

interface Course {
  _id: string;
  courseName: string;
  courseId: string;
  courseTitle: string;
  venueName: string;
  lat: number;
  long: number;
  courseDays: string[];
  lecturers: string[];
  unit: string;
}

const LecturerPublishCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const { token } = useAuthContext();

  // Fetch courses registered by the lecturer
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/lecturer-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch lecturer courses");
        const data = await res.json();
        setCourses(data || []);
        console.log(data);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching lecturer courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  // Publish a course for attendance
  const handlePublish = async (course: Course) => {
    setPublishing(course.courseId);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/publish-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId: course.courseId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to publish course");
      const data = await res.json();
      console.log(data);
      toast.success(`${course.courseName} published successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`Error publishing ${course.courseName}`);
    } finally {
      setPublishing(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold">Publish Attendance</h1>
      <p className="text-sm text-muted-foreground">
        Select from your registered courses to publish attendance.
      </p>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <p className="text-muted-foreground">
          You haven’t registered for any courses yet.
        </p>
      ) : (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {courses.map((course) => (
            <Card key={course._id} className="flex flex-col gap-y-0 p-2">
              <CardHeader className="p-2">
                <CardTitle className="text-sm font-semibold">{course.courseName}</CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {course.courseTitle}
                </p>
              </CardHeader>
              <CardContent className="space-y-2 p-2">
                <p className="text-xs">{course.venueName}</p>
                <p className="text-xs text-muted-foreground">
                  Units: {course.unit}
                </p>
                <Button
                  size="sm"
                  className="w-full h-7 text-xs"
                  disabled={publishing === course.courseId}
                  onClick={() => handlePublish(course)}
                >
                  {publishing === course.courseId ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Upload className="h-3 w-3 mr-1" />
                  )}
                  {publishing === course.courseId ? "Publishing..." : "Publish"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LecturerPublishCourses;
