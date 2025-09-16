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
import { useSEO } from "../../hooks/useSEO";

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

const CourseRegistration = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null); // track course being registered
  const [searchTerm, setSearchTerm] = useState<string>("");

  useSEO({
    title: "Course Registration | Smartendance",
    description:
      "Register for courses quickly and easily with Smartendance. Manage your academic schedule, track attendance, and stay organized in one platform.",
    url: "https://smartendance.vercel.app/register-courses",
    type: "website"
  });

  // Fetch courses from backend
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
        console.log(error);
        toast.error("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Register a course
  const handleRegister = async (courseId: string) => {
    const token = localStorage.getItem("jwt_token");
    setRegistering(courseId);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/register-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId }), // ✅ send just courseName
        }
      );

      if (!res.ok) throw new Error("Failed to register course");
      const data = await res.json();
      console.log(data);
      toast.success(`Course registered successfully!`);
    } catch (error) {
      console.log(error);
      toast.error(`Error registering course`);
    } finally {
      setRegistering(null);
    }
  };

  const filteredCourse = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    const codeMatch = course.courseName.toLowerCase().includes(term);
    const titleMatch = course.courseTitle
      ? course.courseTitle.toLowerCase().includes(term)
      : false;
    return codeMatch || titleMatch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Course Registration</h1>

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
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {filteredCourse.map((course) => (
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
                  size="sm" // ✅ smaller button
                  className="w-full h-8 text-sm"
                  disabled={registering === course.courseId}
                  onClick={() => handleRegister(course.courseId)}
                >
                  {registering === course.courseId ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1" />
                  )}
                  Add
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseRegistration;
