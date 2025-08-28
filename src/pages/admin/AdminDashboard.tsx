import { useState } from "react";
import { X, Check } from "lucide-react";
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
import { Calendar } from "../../components/ui/calendar";
import { Input } from "../../components/ui/input";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "sonner"; // ✅ shadcn sonner

// --- Types ---
type Course = {
  id: string;
  code: string;
  title: string;
};

type Venue = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  building?: string;
  floor?: string;
  capacity?: number;
  isActive: boolean;
};

type CourseSelection = Course & {
  venue?: Venue;
  date?: Date;
  time?: string;
};

// --- Sample list of all available courses ---
const allCourses: Course[] = [
  { id: "mts101", code: "MTS101", title: "Introduction to Mathematics" },
  { id: "phs102", code: "PHS102", title: "General Physics" },
  { id: "chm103", code: "CHM103", title: "Inorganic Chemistry" },
  { id: "csc104", code: "CSC104", title: "Intro to Programming" },
  { id: "bio105", code: "BIO105", title: "Cell Biology" },
  { id: "gns106", code: "GNS106", title: "English & Communication Skills" },
  { id: "abe204", code: "ABE204", title: "Workshop Practice" },
  { id: "ele202", code: "ELE202", title: "Applied Electricity" },
  { id: "mts205", code: "MTS205", title: "Calculus II" },
];

// --- Venues ---
const venues: Venue[] = [
  {
    id: "lh-a",
    name: "Lecture Hall A",
    lat: 7.2162,
    lng: 3.4531,
    radius: 25,
    building: "Academic Block",
    floor: "Ground Floor",
    capacity: 200,
    isActive: true,
  },
  {
    id: "main-aud",
    name: "Main Auditorium",
    lat: 7.2185,
    lng: 3.4542,
    radius: 30,
    building: "Main Building",
    floor: "First Floor",
    capacity: 500,
    isActive: true,
  },
  {
    id: "sci-301",
    name: "Science Block 301",
    lat: 7.2158,
    lng: 3.4529,
    radius: 20,
    building: "Science Block",
    floor: "Third Floor",
    capacity: 50,
    isActive: true,
  },
  {
    id: "eng-lh",
    name: "Engineering Lecture Hall",
    lat: 7.2177,
    lng: 3.455,
    radius: 35,
    building: "Engineering Block",
    floor: "Second Floor",
    capacity: 150,
    isActive: true,
  },
];

export default function AttendanceDashboard() {
  const [selectedCourses, setSelectedCourses] = useState<CourseSelection[]>([]);
  const [publishedCourses, setPublishedCourses] = useState<CourseSelection[]>([]);
  const [open, setOpen] = useState(false);

  const handleSelect = (course: Course) => {
    const alreadyAdded =
      selectedCourses.find((c) => c.id === course.id) ||
      publishedCourses.find((c) => c.id === course.id);
    if (alreadyAdded) {
      toast.error("Course already selected");
      return;
    }
    setSelectedCourses((prev) => [...prev, { ...course }]);
    toast.success(`${course.code} added`);
    setOpen(false);
  };

  const removeCourse = (id: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCourse = (id: string, updates: Partial<CourseSelection>) => {
    setSelectedCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleSubmit = () => {
    const coursesToPublish = selectedCourses.filter(
      (c) => c.date && c.time && c.venue
    );

    if (coursesToPublish.length === 0) {
      toast.error("Please select a course and fill in all details (venue, date, time).");
      return;
    }

    setPublishedCourses((prev) => [...prev, ...coursesToPublish]);
    setSelectedCourses([]);
    toast.success("Attendance published successfully!");
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto py-10 px-4 space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Header */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
      >
        <h2 className="text-3xl font-bold">Welcome, Lecturer</h2>
        <p className="text-primary max-w-2xl">
          This dashboard helps you manage student attendance efficiently. You can
          add courses, set attendance parameters, and start a new session.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Courses Assigned</p>
            <p className="text-2xl font-bold">{allCourses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Sessions Published</p>
            <p className="text-2xl font-bold">{publishedCourses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Sessions</p>
            <p className="text-2xl font-bold">
              {publishedCourses.filter((c) => c.date && c.date >= new Date()).length}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Course Selection */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <h2 className="text-2xl font-bold">Set Up Attendance Session</h2>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="default" className="w-full justify-start">
              Select courses...
            </Button>
          </PopoverTrigger>
          <PopoverContent className="md:w-md w-[300px] p-0">
            <Command className="w-full dark:text-white">
              <CommandInput placeholder="Search courses..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Courses">
                  {allCourses.map((course, i) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, type: "spring" }}
                    >
                      <CommandItem
                        value={course.code + " " + course.title}
                        onSelect={() => handleSelect(course)}
                      >
                        <div>
                          <p className="font-medium">{course.code}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.title}
                          </p>
                        </div>
                      </CommandItem>
                    </motion.div>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Courses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Courses</h3>
          {selectedCourses.length === 0 ? (
            <p className="text-muted-foreground">No courses selected yet.</p>
          ) : (
            <div className="space-y-4">
              {selectedCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  className="p-4 border rounded-md bg-accent shadow-sm space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{course.code}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCourse(course.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Venue Selection */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {course.venue
                          ? `${course.venue.name} (${course.venue.building})`
                          : "Select venue"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search venues..." />
                        <CommandList>
                          <CommandEmpty>No venues found.</CommandEmpty>
                          <CommandGroup heading="Venues">
                            {venues
                              .filter((v) => v.isActive)
                              .map((venue) => (
                                <CommandItem
                                  key={venue.id}
                                  value={venue.name + " " + venue.building}
                                  onSelect={() =>
                                    handleUpdateCourse(course.id, { venue })
                                  }
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{venue.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {venue.building} • {venue.floor} • Cap:{" "}
                                      {venue.capacity}
                                    </span>
                                  </div>
                                  {course.venue?.id === venue.id && (
                                    <Check className="ml-auto w-4 h-4 text-green-500" />
                                  )}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Date & Time */}
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          {course.date
                            ? course.date.toDateString()
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={course.date}
                          onSelect={(date) => {
                            if (date) handleUpdateCourse(course.id, { date });
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      className="flex-1"
                      value={course.time || ""}
                      onChange={(e) =>
                        handleUpdateCourse(course.id, { time: e.target.value })
                      }
                    />
                  </div>

                  {/* Venue Details */}
                  {course.venue && (
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      <p>
                        <strong>Building:</strong> {course.venue.building}
                      </p>
                      <p>
                        <strong>Floor:</strong> {course.venue.floor}
                      </p>
                      <p>
                        <strong>Capacity:</strong> {course.venue.capacity} students
                      </p>
                      <p>
                        <strong>Detection Radius:</strong> {course.venue.radius}m
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
              <Button onClick={handleSubmit} className="w-full mt-4">
                Publish Attendance
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Published Courses */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <h2 className="text-2xl font-bold">Active Attendance Sessions</h2>
        {publishedCourses.length === 0 ? (
          <p className="text-muted-foreground">
            No attendance sessions have been published yet.
          </p>
        ) : (
          <div className="space-y-4">
            {publishedCourses.map((course, i) => (
              <motion.div
                key={course.id}
                className="p-4 border rounded-md bg-white dark:bg-zinc-800 shadow-sm space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring" }}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-lg">{course.code}</h4>
                  <span className="text-sm text-green-600 font-medium">
                    Active
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Venue:</span>{" "}
                    {course.venue?.name} ({course.venue?.building})
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {course.date?.toDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {course.time}
                  </p>
                  <p>
                    <span className="font-medium">Detection Radius:</span>{" "}
                    {course.venue?.radius}m
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
