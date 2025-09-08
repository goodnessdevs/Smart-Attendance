import { useState, type FormEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  MapPin,
  Calendar,
  Users,
  AlertCircle,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "../../components/ui/command";
import { venues, type Venue } from "../../utils/Venues";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SignedOutAdminDashboard from "./SignedOutAdmin";
import { useAuthContext } from "../../hooks/use-auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

interface CourseFormData {
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  unit: string;
  lecturers: string[];
  courseVenue: Venue[];
  courseDays: string[];
  isActive: boolean;
}

export default function AdminDashboard() {
  const { token, isInitializing } = useAuthContext();
  const [totalCourses, setTotalCourses] = useState<number>(12);

  const [formData, setFormData] = useState<CourseFormData>({
    courseName: "",
    courseTitle: "",
    courseDescription: "",
    unit: "",
    lecturers: [""],
    courseVenue: [],
    courseDays: [],
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form validation
  const isFormValid = () => {
    return (
      formData.courseName.trim() !== "" &&
      formData.courseTitle.trim() !== "" &&
      formData.courseDescription.trim() !== "" &&
      formData.courseDays.length > 0 &&
      formData.lecturers.some((l) => l.trim() !== "") &&
      formData.courseVenue.some((v) => v.venueName.trim() !== "")
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

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

  // const handleVenueChange = (index: number, value: string) => {
  //   const updated = [...formData.courseVenue];
  //   updated[index] = value;
  //   setFormData((prev) => ({ ...prev, courseVenue: updated }));
  // };

  // const addVenue = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     courseVenue: [...prev.courseVenue, ""],
  //   }));
  // };

  // const removeVenue = (index: number) => {
  //   if (formData.courseVenue.length === 1) return;
  //   const updated = formData.courseVenue.filter((_, i) => i !== index);
  //   setFormData((prev) => ({ ...prev, courseVenue: updated }));
  // };

  const handleDayToggle = (day: string, checked: boolean) => {
    const updated = checked
      ? [...formData.courseDays, day]
      : formData.courseDays.filter((d) => d !== day);
    setFormData((prev) => ({ ...prev, courseDays: updated }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

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

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setSuccess("Course created successfully!");
        toast.success("Course created successfully!");
        setFormData({
          courseName: "",
          courseTitle: "",
          courseDescription: "",
          unit: "",
          lecturers: [""],
          courseVenue: [],
          courseDays: [],
          isActive: true,
        });
        setTotalCourses((c) => c + 1);
      } else {
        toast.error("Failed to create course");
        throw new Error("Failed to create course");
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create course"
      );
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      courseName: "",
      courseTitle: "",
      courseDescription: "",
      unit: "",
      lecturers: [""],
      courseVenue: [],
      courseDays: [],
      isActive: true,
    });
    setError(null);
    setSuccess(null);
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // --- Auth loading ---
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!token) return <SignedOutAdminDashboard />;

  return (
    <motion.div
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          className="text-center sm:text-left"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Manage courses, instructors, and academic content
          </p>
        </motion.div>

        {/* Create Course Form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Plus className="w-5 h-5 text-blue-600" />
                Create New Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6 text-sm sm:text-base"
              >
                {/* Course Name & Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="courseName">
                      Course Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="courseName"
                      name="courseName"
                      placeholder="Intro to Computer Science"
                      value={formData.courseName}
                      onChange={handleChange}
                      className="h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="courseTitle">
                      Course Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="courseTitle"
                      name="courseTitle"
                      placeholder="CSC 101"
                      value={formData.courseTitle}
                      onChange={handleChange}
                      className="h-9 sm:h-10"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="courseDescription">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="courseDescription"
                    name="courseDescription"
                    rows={3}
                    placeholder="Enter a detailed course description..."
                    value={formData.courseDescription}
                    onChange={handleChange}
                    className="resize-none"
                  />
                </div>

                {/* Unit */}
                <div className="space-y-1.5 max-w-[120px]">
                  <Label htmlFor="unit">Credit Units</Label>
                  <Input
                    id="unit"
                    name="unit"
                    type="number"
                    placeholder="3"
                    min="1"
                    max="6"
                    value={formData.unit}
                    onChange={handleChange}
                    className="h-9 sm:h-10"
                  />
                </div>

                {/* Days */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Course Days{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {weekdays.map((day: string) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.courseDays.includes(day)}
                          onCheckedChange={(checked) =>
                            handleDayToggle(day, !!checked)
                          }
                        />
                        <Label htmlFor={day}>{day.slice(0, 3)}</Label>
                      </div>
                    ))}
                  </div>
                  {formData.courseDays.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.courseDays.map((day: string) => (
                        <Badge
                          key={day}
                          variant="secondary"
                          className="text-xs"
                        >
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lecturers */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> Lecturers{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {formData.lecturers.map((lecturer: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder="Dr. John Doe"
                        value={lecturer}
                        onChange={(e) =>
                          handleLecturerChange(i, e.target.value)
                        }
                        className="h-9 sm:h-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLecturer(i)}
                        disabled={formData.lecturers.length === 1}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLecturer}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Lecturer
                  </Button>
                </div>

                {/* Venues */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Venues{" "}
                    <span className="text-red-500">*</span>
                  </Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {formData.courseVenue.length > 0
                          ? `${formData.courseVenue.length} venue(s) selected`
                          : "Select venues..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command className="bg-white text-black">
                        <CommandInput placeholder="Search venues..." />
                        <CommandList className="max-h-60 overflow-y-auto">
                          <CommandEmpty>No venues found.</CommandEmpty>
                          {venues.map((venue) => {
                            const alreadySelected = formData.courseVenue.some(
                              (v) => v.venueName === venue.venueName
                            );

                            return (
                              <CommandItem
                                key={venue.venueName}
                                value={venue.venueName}
                                onSelect={() => {
                                  if (alreadySelected) {
                                    // remove if already selected
                                    setFormData((prev) => ({
                                      ...prev,
                                      courseVenue: prev.courseVenue.filter(
                                        (v) => v.venueName !== venue.venueName
                                      ),
                                    }));
                                  } else {
                                    // add new venue
                                    setFormData((prev) => ({
                                      ...prev,
                                      courseVenue: [
                                        ...prev.courseVenue,
                                        venue,
                                      ],
                                    }));
                                  }
                                }}
                              >
                                {alreadySelected ? "✓ " : ""} {venue.venueName}
                              </CommandItem>
                            );
                          })}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Display selected venues */}
                  {formData.courseVenue.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.courseVenue.map((venue, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs flex items-center gap-1"
                        >
                          {venue.venueName}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                courseVenue: prev.courseVenue.filter(
                                  (v) => v.venueName !== venue.venueName
                                ),
                              }))
                            }
                            className="ml-1 h-4 w-4 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Alerts */}
                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !isFormValid()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Course
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Stats</h2>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    Total Courses
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {totalCourses}
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    Published courses
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
