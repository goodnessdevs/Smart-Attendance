import { useEffect, useState } from "react";

type Course = {
  _id: string;
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  lecturers: string[];
  courseDays: string[];
  courseVenue: string;
  isActive: boolean;
};

const AllCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/all-courses`);
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data: Course[] = await res.json();
        console.log(data)
        setCourses(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="p-4">Loading courses...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Courses</h2>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-4 rounded-xl shadow-md border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{course.courseTitle}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {course.courseDescription}
              </p>
              <p className="text-sm font-medium">
                <span className="text-gray-500">Code:</span> {course.courseName}
              </p>
              <p className="text-sm font-medium">
                <span className="text-gray-500">Venue:</span> {course.courseVenue}
              </p>
              <p className="text-sm font-medium">
                <span className="text-gray-500">Lecturers:</span>{" "}
                {course.lecturers.join(", ")}
              </p>
              {/* <p className="text-sm font-medium">
                <span className="text-gray-500">Days:</span>{" "}
                {course.courseDays.join(", ")}
              </p> */}
              <p
                className={`mt-2 inline-block px-2 py-1 rounded text-xs font-bold ${
                  course.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {course.isActive ? "true" : "false"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
