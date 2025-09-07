import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";

interface Course {
  _id: string;
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  unit: string;
  lecturers: string[];
  courseVenue: string[];
  courseDays: string[];
}

const CourseRegistration = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null); // track course being registered
  const [searchTerm, setSearchTerm] = useState<string>("");

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
  const handleRegister = async (courseName: string) => {
    const token = localStorage.getItem("jwt_token");
    setRegistering(courseName);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/register-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courses: [courseName] }), // ✅ send array with courseName
        }
      );

      if (!res.ok) throw new Error("Failed to register course");

      toast.success(`${courseName} registered successfully!`);
    } catch (error) {
      console.log(error);
      toast.error(`Error registering ${courseName}`);
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourse.map((course) => (
            <Card key={course._id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{course.courseName}</CardTitle>
                <p className="text-sm text-muted-foreground">{course.courseTitle}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* <p className="text-sm">{course.courseDescription}</p> */}
                <p className="text-xs text-muted-foreground">Units: {course.unit}</p>
                <Button
                  className="w-full"
                  disabled={registering === course.courseName}
                  onClick={() => handleRegister(course.courseName)}
                >
                  {registering === course.courseName ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
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
