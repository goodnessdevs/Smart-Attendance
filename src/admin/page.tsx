import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { BookOpen, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CourseFormData {
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  unit: string;
  lecturers: string[];
  isActive: boolean;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function AdminDashboard() {
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [formData, setFormData] = useState<CourseFormData>({
    courseName: "",
    courseTitle: "",
    courseDescription: "",
    unit: "",
    lecturers: [""],
    isActive: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ General input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Lecturers array handlers
  const handleLecturerChange = (index: number, value: string) => {
    const updated = [...formData.lecturers];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, lecturers: updated }));
  };

  const addLecturer = () => {
    setFormData((prev) => ({ ...prev, lecturers: [...prev.lecturers, ""] }));
  };

  const removeLecturer = (index: number) => {
    if (formData.lecturers.length === 1) return;
    const updated = formData.lecturers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, lecturers: updated }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("jwt_token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/create-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        toast.success("Course created successfully!");
        setFormData({
          courseName: "",
          courseTitle: "",
          courseDescription: "",
          unit: "",
          lecturers: [""],
          isActive: false,
        });
        setTotalCourses((c) => c + 1);
      } else {
        setFormData({
          courseName: "",
          courseTitle: "",
          courseDescription: "",
          unit: "",
          lecturers: [""],
          isActive: false,
        });
        throw new Error("Failed to publish course");
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to publish course"
      );
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl w-full p-6 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: Stats */}
        <div className="space-y-6">
          <motion.div {...fadeUp}>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-200">Manage courses and instructors.</p>
          </motion.div>

          <motion.div {...fadeUp}>
            <Card className="border-cyan-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-200">
                      Total Courses Published
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-300 mt-1">
                      {totalCourses}
                    </p>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-full">
                    <BookOpen className="w-8 h-8 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* RIGHT: Create Course Form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-3 space-y-3"
          >
            <h1 className="text-lg font-medium">Create Course</h1>

            {/* Course Name */}
            <div className="space-y-1">
              <Label htmlFor="courseName" className="text-xs">
                Course Name *
              </Label>
              <Input
                id="courseName"
                name="courseName"
                placeholder="e.g., Intro to Algorithms"
                value={formData.courseName}
                onChange={handleChange}
                className="h-7 text-xs"
              />
            </div>

            {/* Course Title */}
            <div className="space-y-1">
              <Label htmlFor="courseTitle" className="text-xs">
                Course Title *
              </Label>
              <Input
                id="courseTitle"
                name="courseTitle"
                placeholder="e.g., CSC 201"
                value={formData.courseTitle}
                onChange={handleChange}
                className="h-7 text-xs"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="courseDescription" className="text-xs">
                Description *
              </Label>
              <Textarea
                id="courseDescription"
                name="courseDescription"
                placeholder="Enter description…"
                rows={2}
                value={formData.courseDescription}
                onChange={handleChange}
                className="text-xs"
              />
            </div>

            {/* Unit */}
            <div className="space-y-1">
              <Label htmlFor="unit" className="text-xs">
                Unit
              </Label>
              <Input
                id="unit"
                name="unit"
                type="number"
                placeholder="3"
                value={formData.unit}
                onChange={handleChange}
                className="h-7 w-20 text-xs"
              />
            </div>

            {/* Lecturers */}
            <div className="space-y-1">
              <Label className="text-xs">Lecturers *</Label>
              {formData.lecturers.map((lecturer, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Input
                    placeholder={`Lecturer ${i + 1}`}
                    value={lecturer}
                    onChange={(e) => handleLecturerChange(i, e.target.value)}
                    className="h-7 text-xs"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeLecturer(i)}
                    disabled={formData.lecturers.length === 1}
                    className="h-7 w-7"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLecturer}
                className="h-7 px-2 text-[11px]"
              >
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>

            {/* Alerts */}
            {error && (
              <Alert className="border-red-200 bg-red-50 p-2 text-xs">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={loading}
                className="h-8 min-w-[100px] bg-cyan-600 hover:bg-cyan-700 text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 mr-1" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
