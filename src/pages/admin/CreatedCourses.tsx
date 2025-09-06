import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2, BookOpen, Users, MapPin, Calendar } from "lucide-react";

interface Course {
  _id: string;
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  unit: number;
  lecturers: string[];
  venues: string[];
  days: string[];
}

const CreatedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // adjust if you use cookies
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch courses");
        console.log(res.ok)

        const data = await res.json();
        console.log(data)
        setCourses(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600">Loading courses...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Created Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No courses created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course._id}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {course.courseName} <span className="text-sm text-gray-500">({course.courseTitle})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                  {course.courseDescription}
                </p>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{course.lecturers.join(", ")}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{course.venues.join(", ")}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{course.days.join(", ")}</span>
                </div>

                <p className="text-sm font-medium text-blue-600">
                  Units: {course.unit}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatedCourses;
