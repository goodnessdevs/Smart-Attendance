import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";

interface Course {
  _id: string;
  courseName: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  unit: string;
  lecturers: string[];
  venueName: string;
  courseDays: string[];
}

const LecturerCourseRegistration = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null); // track course being selected
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch all courses
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data.courses);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Lecturer selects a course
  const handleSelect = async (courseId: string) => {
    const token = localStorage.getItem("jwt_token");
    setSelecting(courseId);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/lecturer-select`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId }),
        }
      );

      if (!res.ok) throw new Error("Failed to select course");
      const data = await res.json();
      console.log(data);
      toast.success("Course selected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error selecting course");
    } finally {
      setSelecting(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    const codeMatch = course.courseName.toLowerCase().includes(term);
    const titleMatch = course.courseTitle
      ? course.courseTitle.toLowerCase().includes(term)
      : false;
    return codeMatch || titleMatch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Lecturer Course Registration</h1>

      <div className="my-4 mb-6 md:w-md w-[250px]">
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="flex flex-col gap-y-0 p-2">
              <CardHeader className="p-2">
                <CardTitle className="text-base">{course.courseName}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {course.courseTitle}
                </p>
              </CardHeader>
              <CardContent className="space-y-1 p-2">
                <p className="text-xs">{course.courseId}</p>
                <p className="text-xs">{course.venueName}</p>
                <p className="text-xs text-muted-foreground">
                  Units: {course.unit}
                </p>
                <Button
                  size="sm"
                  className="w-full h-8 text-sm"
                  disabled={selecting === course.courseId}
                  onClick={() => handleSelect(course.courseId)}
                >
                  {selecting === course.courseId ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1" />
                  )}
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LecturerCourseRegistration;
