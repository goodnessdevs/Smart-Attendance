import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";

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
  const [open, setOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

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

  // Add selected course
  const handleSelect = (courseName: string) => {
    if (!selectedCourses.includes(courseName)) {
      setSelectedCourses([...selectedCourses, courseName]);
    } else {
      toast.info(`${courseName} already selected`);
    }
    setOpen(false);
  };

  // Remove selected course
  const handleRemove = (courseName: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c !== courseName));
  };

  // Submit selected courses
  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    const token = localStorage.getItem("jwt_token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/register-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courses: selectedCourses }), // ✅ sending courseName only
        }
      );

      if (!res.ok) throw new Error("Failed to register courses");

      toast.success("Courses registered successfully!");
      setSelectedCourses([]); // Reset selection
    } catch (error) {
      console.log(error);
      toast.error("Error registering courses");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Course Registration</h1>

      {/* Course Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {loading ? "Loading..." : "Select Course"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Command className="bg-white text-black dark:text-black">
            <CommandInput placeholder="Search course..." />
            <CommandList>
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <>
                  <CommandEmpty>No courses found.</CommandEmpty>
                  <CommandGroup className="text-black dark:text-black">
                    {courses.map((course) => (
                      <CommandItem
                        key={course._id}
                        onSelect={() => handleSelect(course.courseName)}
                      >
                        {course.courseName} — {course.courseTitle}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Courses */}
      <div className="flex flex-wrap gap-3">
        {selectedCourses.map((courseName) => (
          <Badge
            key={courseName}
            variant="secondary"
            className="flex items-center gap-2 px-4 py-2 text-base rounded-lg"
          >
            {courseName}
            <button
              type="button"
              onClick={() => handleRemove(courseName)}
              className="hover:text-red-500"
            >
              <X size={16} />
            </button>
          </Badge>
        ))}
      </div>

      {/* Submit */}
      <Button className="w-full" onClick={handleSubmit}>
        Register Selected Courses
      </Button>
    </div>
  );
};

export default CourseRegistration;
