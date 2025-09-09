import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
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
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthContext } from "../../hooks/use-auth";
import SignedOutLecturerDashboard from "./SignedOutLecturer";

interface Course {
  courseName: string;
  courseTitle: string;
  courseId: string;
  courseDays: [];
  lecturers: string[];
  venueName: string;
  lat: number;
  long: number;
  isActive: boolean;
}

export default function AttendanceDashboard() {
  const { token, isInitializing } = useAuthContext();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // ✅ Normalize to array
        const coursesArray = Array.isArray(data) ? data : data.courses;
        setAllCourses(coursesArray || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [token]);

  const handleSelect = (course: Course) => {
    const alreadyAdded = selectedCourses.find(
      (c) => c.courseName === course.courseName
    );
    if (alreadyAdded) {
      toast.error("Course already selected");
      return;
    }

    setSelectedCourses((prev) => [...prev, course]);
    toast.success(`${course.courseName} added`);
    setOpen(false);
  };

  const removeCourse = (courseName: string) => {
    setSelectedCourses((prev) =>
      prev.filter((c) => c.courseName !== courseName)
    );
  };

  // ✅ Publish selected courses
  const handlePublish = async () => {
    if (selectedCourses.length === 0) {
      toast.error("No courses selected to publish");
      return;
    }

    setIsPublishing(true);
    try {
      for (const course of selectedCourses) {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/publish-attendance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseName: course.courseName,
            courseTitle: course.courseTitle,
            courseId: course.courseId,
            courseDays: course.courseDays,
            venueName: course.venueName,
            lecturers: course.lecturers,
            lat: course.lat,
            long: course.long,
            isActive: true,
          }),
        });
      }

      setSelectedCourses([]);
      toast.success("Courses published successfully!");
    } catch (error) {
      console.error("Error publishing courses:", error);
      toast.error("Failed to publish courses");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!token) {
    return <SignedOutLecturerDashboard />;
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto py-10 px-4 space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Attendance Dashboard</h2>
        <p className="text-muted-foreground">
          Select courses to publish for attendance.
        </p>
      </div>

      {/* Course Selection */}
      <div className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={loadingCourses}
            >
              {loadingCourses ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Loading
                  courses...
                </span>
              ) : (
                "Select a course..."
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command className="w-full dark:text-white">
              <CommandInput placeholder="Search courses..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Courses">
                  {allCourses.map((course) => (
                    <CommandItem
                      key={course.courseId}
                      value={course.courseName + " " + course.courseTitle}
                      onSelect={() => handleSelect(course)}
                    >
                      <div>
                        <p className="font-medium">{course.courseName}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.courseTitle}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Courses */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Selected Courses</h3>
          {selectedCourses.length === 0 ? (
            <p className="text-muted-foreground">No courses selected yet.</p>
          ) : (
            <div className="space-y-2">
              {selectedCourses.map((course) => (
                <motion.div
                  key={course.courseId}
                  className="flex items-center justify-between p-3 border rounded-md bg-accent shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring" }}
                >
                  <div>
                    <p className="font-medium">{course.courseName}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.courseTitle}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCourse(course.courseName)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Publish Button */}
        {selectedCourses.length > 0 && (
          <Button
            className="w-full mt-4"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" /> Publishing...
              </span>
            ) : (
              "Publish Courses"
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
