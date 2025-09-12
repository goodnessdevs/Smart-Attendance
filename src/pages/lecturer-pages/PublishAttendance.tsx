import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";

import { Loader2, Upload, MoreVertical, Check } from "lucide-react";
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
  isActive: boolean;
}

const LecturerPublishCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ending, setEnding] = useState(false);
  const [publishedCourseId, setPublishedCourseId] = useState<string | null>(
    null
  );
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
        // const published = data.find((c: Course) => c.isActive);
        // if (published) {
        //   setPublishedCourseId(published.courseId);
        // }
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
    // If this course is already published
    if (publishedCourseId === course.courseId) {
      toast.info(`${course.courseName} is already published.`);
      return;
    }

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
      setPublishedCourseId(course.courseId);

      // Move published course to the top of the list for better UX
      setCourses((prev) => {
        const published = prev.find((c) => c.courseId === course.courseId);
        const others = prev.filter((c) => c.courseId !== course.courseId);
        return published ? [published, ...others] : prev;
      });
      setPublishedCourseId(course.courseId);
      toast.success(`${course.courseName} published successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`Error publishing ${course.courseName}. Please try again`);
    } finally {
      setPublishing(null);
    }
  };

  const handleEndAttendance = async () => {
    if (!selectedCourse) return;

    setEnding(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/end-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId: selectedCourse.courseId }),
        }
      );

      if (!res.ok) throw new Error("Failed to end attendance");
      const data = await res.json();
      console.log(data);
      toast.success(`${selectedCourse.courseName} attendance ended!`);
      setPublishedCourseId(null);
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        `Error ending attendance for ${selectedCourse.courseName}. Please try again`
      );
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between my-5">
        <div>
          <h1 className="text-2xl font-bold">Publish Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Select from your registered courses to publish attendance.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" disabled={!publishedCourseId}>
              <MoreVertical className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2">
            {publishedCourseId && (
              <DropdownMenuItem
                className="text-foreground hover:bg-ring"
                onClick={() => {
                  const course = courses.find(
                    (c) => c.courseId === publishedCourseId
                  );
                  if (course) {
                    setSelectedCourse(course);
                    setDialogOpen(true);
                  }
                }}
              >
                End Attendance Session
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
                <CardTitle className="text-sm font-semibold">
                  {course.courseName}
                </CardTitle>
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
                  className={`w-full h-7 text-xs ${
                    publishedCourseId === course.courseId
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  disabled={
                    publishing === course.courseId ||
                    (publishedCourseId !== null &&
                      publishedCourseId !== course.courseId)
                  }
                  onClick={() => handlePublish(course)}
                >
                  {publishing === course.courseId ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : publishedCourseId === course.courseId ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <Upload className="h-3 w-3 mr-1" />
                  )}
                  {publishing === course.courseId
                    ? "Publishing..."
                    : publishedCourseId === course.courseId
                    ? "Published"
                    : "Publish"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-accent">
          <DialogHeader>
            <DialogTitle>End Attendance Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to end attendance for{" "}
              <span className="font-semibold">
                {selectedCourse?.courseName}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleEndAttendance}
              disabled={ending}
            >
              {ending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerPublishCourses;
