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

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
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
        console.log(data.courses)
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
  const handleSelect = (courseCode: string) => {
    if (!selectedCourses.includes(courseCode)) {
      setSelectedCourses([...selectedCourses, courseCode]);
    } else {
      toast.info(`${courseCode} already selected`);
    }
    setOpen(false);
  };

  // Remove selected course
  const handleRemove = (courseCode: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c !== courseCode));
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
          body: JSON.stringify({ courses: selectedCourses }),
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
        <PopoverContent className="w-[400px] p-0">
          <Command className="bg-white text-black">
            <CommandInput placeholder="Search course..." />
            <CommandList>
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <>
                  <CommandEmpty>No courses found.</CommandEmpty>
                  <CommandGroup>
                    {courses.map((course) => (
                      <CommandItem
                        key={course.id}
                        onSelect={() => handleSelect(course.courseName)}
                      >
                        {course.courseName}
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
      <div className="flex flex-wrap gap-2">
        {selectedCourses.map((courseCode) => (
          <div
            key={courseCode}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm"
          >
            {courseCode}
            <button
              type="button"
              onClick={() => handleRemove(courseCode)}
              className="ml-1 hover:text-red-500"
            >
              <X size={14} />
            </button>
          </div>
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
