import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";

// --- Types ---
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

type CourseSelection = {
  courseCode: string;
  courseTitle: string;
  courseDescription: string;
  lecturers: string[];
  courseTime: string;
  courseDays: string[];
  courseVenue: string[];
  isActive: boolean;
  venues?: Venue[];
  date?: Date;
};

// --- Sample list of all available courses ---
const allCourses: CourseSelection[] = [
  {
    courseCode: "MTS101",
    courseTitle: "Introduction to Mathematics",
    courseDescription: "Introduction to Mathematics course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
  {
    courseCode: "PHS102",
    courseTitle: "General Physics",
    courseDescription: "General Physics course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
  {
    courseCode: "CHM103",
    courseTitle: "Inorganic Chemistry",
    courseDescription: "Inorganic Chemistry course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
  {
    courseCode: "CSC104",
    courseTitle: "Intro to Programming",
    courseDescription: "Intro to Programming course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
  {
    courseCode: "BIO105",
    courseTitle: "Cell Biology",
    courseDescription: "Cell Biology course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
  {
    courseCode: "GNS106",
    courseTitle: "English & Communication Skills",
    courseDescription: "English & Communication Skills course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
  {
    courseCode: "ABE204",
    courseTitle: "Workshop Practice",
    courseDescription: "Workshop Practice course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
  {
    courseCode: "ELE202",
    courseTitle: "Applied Electricity",
    courseDescription: "Applied Electricity course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
  {
    courseCode: "MTS205",
    courseTitle: "Calculus II",
    courseDescription: "Calculus II course description",
    lecturers: [],
    courseTime: "",
    courseDays: [],
    courseVenue: [],
    isActive: true,
  },
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

// Days of the week for selection
const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function AttendanceDashboard() {
  const [selectedCourses, setSelectedCourses] = useState<CourseSelection[]>([]);
  const [activeCourses, setActiveCourses] = useState<CourseSelection[]>([]);
  const [createdCourses, setCreatedCourses] = useState<CourseSelection[]>([]);
  const [open, setOpen] = useState(false);
  const [lecturerName, setLecturerName] = useState("");
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [isLoadingCreated, setIsLoadingCreated] = useState(false);

  const handleSelect = (course: CourseSelection) => {
    const alreadyAdded = selectedCourses.find((c) => c.courseCode === course.courseCode);
    if (alreadyAdded) {
      toast.error("Course already selected");
      return;
    }
    
    const newCourseSelection: CourseSelection = {
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      courseDescription: `${course.courseTitle} course description`,
      lecturers: [],
      courseTime: "",
      courseDays: [],
      courseVenue: [],
      venues: [],
      isActive: true,
    };
    
    setSelectedCourses((prev) => [...prev, newCourseSelection]);
    toast.success(`${course.courseCode} added`);
    setOpen(false);
  };

  const removeCourse = (courseCode: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c.courseCode !== courseCode));
  };

  const handleUpdateCourse = (courseCode: string, updates: Partial<CourseSelection>) => {
    setSelectedCourses((prev) =>
      prev.map((c) => (c.courseCode === courseCode ? { ...c, ...updates } : c))
    );
  };

  const toggleDay = (courseCode: string, day: string) => {
    setSelectedCourses((prev) =>
      prev.map((c) => {
        if (c.courseCode === courseCode) {
          const updatedDays = c.courseDays.includes(day)
            ? c.courseDays.filter((d) => d !== day)
            : [...c.courseDays, day];
          return { ...c, courseDays: updatedDays };
        }
        return c;
      })
    );
  };

  const addLecturer = (courseCode: string, lecturer: string) => {
    if (!lecturer.trim()) return;
    
    setSelectedCourses((prev) =>
      prev.map((c) => {
        if (c.courseCode === courseCode) {
          if (!c.lecturers.includes(lecturer.trim())) {
            return { ...c, lecturers: [...c.lecturers, lecturer.trim()] };
          }
        }
        return c;
      })
    );
  };

  const removeLecturer = (courseCode: string, lecturer: string) => {
    setSelectedCourses((prev) =>
      prev.map((c) => {
        if (c.courseCode === courseCode) {
          return { ...c, lecturers: c.lecturers.filter((l) => l !== lecturer) };
        }
        return c;
      })
    );
  };

  const addVenue = (courseCode: string, venue: Venue) => {
    setSelectedCourses((prev) =>
      prev.map((c) => {
        if (c.courseCode === courseCode) {
          const alreadyAdded = c.courseVenue.includes(venue.name);
          if (!alreadyAdded) {
            return { 
              ...c, 
              courseVenue: [...c.courseVenue, venue.name],
              venues: [...(c.venues || []), venue]
            };
          }
        }
        return c;
      })
    );
  };

  const removeVenue = (courseCode: string, venueName: string) => {
    setSelectedCourses((prev) =>
      prev.map((c) => {
        if (c.courseCode === courseCode) {
          return { 
            ...c, 
            courseVenue: c.courseVenue.filter((v) => v !== venueName),
            venues: (c.venues || []).filter((v) => v.name !== venueName)
          };
        }
        return c;
      })
    );
  };

  const createCourse = async (courseData: CourseSelection) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseCode: courseData.courseCode,
          courseTitle: courseData.courseTitle,
          courseDescription: courseData.courseDescription,
          lecturers: courseData.lecturers,
          courseTime: courseData.courseTime,
          courseDays: courseData.courseDays,
          courseVenue: courseData.courseVenue,
          isActive: courseData.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  };

  const fetchActiveCourses = async () => {
    setIsLoadingActive(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/active-courses`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActiveCourses(data);
    } catch (error) {
      console.error('Error fetching active courses:', error);
      toast.error('Failed to fetch active courses');
    } finally {
      setIsLoadingActive(false);
    }
  };

  const fetchCreatedCourses = async () => {
    setIsLoadingCreated(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/all-courses`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCreatedCourses(data);
    } catch (error) {
      console.error('Error fetching created courses:', error);
      toast.error('Failed to fetch created courses');
    } finally {
      setIsLoadingCreated(false);
    }
  };

  const handleSubmit = async () => {
    const coursesToPublish = selectedCourses.filter(
      (c) => c.courseTime && c.courseDays.length > 0 && c.courseVenue.length > 0 && c.lecturers.length > 0
    );

    if (coursesToPublish.length === 0) {
      toast.error("Please fill in all details (lecturers, venue, time, days) for at least one course.");
      return;
    }

    try {
      const promises = coursesToPublish.map(course => createCourse(course));
      await Promise.all(promises);
      
      setSelectedCourses([]);
      toast.success("Courses created and published successfully!");
    } catch (error) {
      toast.error("Failed to create courses. Please try again.");
      console.error('Error:', error);
    }
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
          This dashboard helps you create and manage courses. You can
          add courses, set course parameters, and publish them.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={fetchCreatedCourses}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Created Courses</p>
                <p className="text-2xl font-bold">{createdCourses.length}</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Created Courses</DialogTitle>
            </DialogHeader>
            {isLoadingCreated ? (
              <div className="flex justify-center py-8">
                <p>Loading courses...</p>
              </div>
            ) : createdCourses.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No courses have been created yet.
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {createdCourses.map((course, i) => (
                  <motion.div
                    key={course.courseCode}
                    className="p-4 border rounded-md bg-card shadow-sm space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg">{course.courseCode}</h4>
                      <span className="text-sm text-green-600 font-medium">
                        {course.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Title:</span> {course.courseTitle}
                      </p>
                      <p>
                        <span className="font-medium">Description:</span> {course.courseDescription}
                      </p>
                      <p>
                        <span className="font-medium">Lecturers:</span> {course.lecturers.join(", ")}
                      </p>
                      <p>
                        <span className="font-medium">Venues:</span> {course.courseVenue.join(", ")}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span> {course.courseTime}
                      </p>
                      <p>
                        <span className="font-medium">Days:</span> {course.courseDays.join(", ")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={fetchActiveCourses}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Active Courses</p>
                <p className="text-2xl font-bold">{activeCourses.length}</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Active Courses</DialogTitle>
            </DialogHeader>
            {isLoadingActive ? (
              <div className="flex justify-center py-8">
                <p>Loading active courses...</p>
              </div>
            ) : activeCourses.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No active courses found.
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activeCourses.map((course, i) => (
                  <motion.div
                    key={course.courseCode}
                    className="p-4 border rounded-md bg-card shadow-sm space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg">{course.courseCode}</h4>
                      <span className="text-sm text-green-600 font-medium">
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Title:</span> {course.courseTitle}
                      </p>
                      <p>
                        <span className="font-medium">Description:</span> {course.courseDescription}
                      </p>
                      <p>
                        <span className="font-medium">Lecturers:</span> {course.lecturers.join(", ")}
                      </p>
                      <p>
                        <span className="font-medium">Venues:</span> {course.courseVenue.join(", ")}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span> {course.courseTime}
                      </p>
                      <p>
                        <span className="font-medium">Days:</span> {course.courseDays.join(", ")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Course Selection */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <h2 className="text-2xl font-bold">Create New Course</h2>

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
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, type: "spring" }}
                    >
                      <CommandItem
                        value={course.courseCode + " " + course.courseTitle}
                        onSelect={() => handleSelect(course)}
                      >
                        <div>
                          <p className="font-medium">{course.courseCode}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.courseTitle}
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
                  key={course.courseCode}
                  className="p-4 border rounded-md bg-accent shadow-sm space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{course.courseCode}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCourse(course.courseCode)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Course Description */}
                  <div>
                    <label className="text-sm font-medium">Course Description</label>
                    <Input
                      placeholder="Enter course description"
                      value={course.courseDescription}
                      onChange={(e) =>
                        handleUpdateCourse(course.courseCode, { courseDescription: e.target.value })
                      }
                    />
                  </div>

                  {/* Lecturers */}
                  <div>
                    <label className="text-sm font-medium">Lecturers</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add lecturer name"
                        value={lecturerName}
                        onChange={(e) => setLecturerName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addLecturer(course.courseCode, lecturerName);
                            setLecturerName("");
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          addLecturer(course.courseCode, lecturerName);
                          setLecturerName("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {course.lecturers.map((lecturer) => (
                        <div
                          key={lecturer}
                          className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
                        >
                          {lecturer}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeLecturer(course.courseCode, lecturer)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Venues Selection */}
                  <div>
                    <label className="text-sm font-medium">Venues</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start mb-2">
                          Select venues...
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
                                    onSelect={() => {
                                      addVenue(course.courseCode, venue);
                                      toast.success(`${venue.name} added`);
                                    }}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">{venue.name}</span>
                                      <span className="text-sm text-muted-foreground">
                                        {venue.building} • {venue.floor} • Cap:{" "}
                                        {venue.capacity}
                                      </span>
                                    </div>
                                    {course.courseVenue.includes(venue.name) && (
                                      <Check className="ml-auto w-4 h-4 text-green-500" />
                                    )}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2">
                      {course.courseVenue.map((venueName) => (
                        <div
                          key={venueName}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
                        >
                          {venueName}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeVenue(course.courseCode, venueName)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="text-sm font-medium">Course Time</label>
                    <Input
                      type="time"
                      value={course.courseTime || ""}
                      onChange={(e) =>
                        handleUpdateCourse(course.courseCode, { courseTime: e.target.value })
                      }
                    />
                  </div>

                  {/* Days Selection */}
                  <div>
                    <label className="text-sm font-medium">Course Days</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <Button
                          key={day}
                          variant={course.courseDays.includes(day) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDay(course.courseCode, day)}
                        >
                          {day.substring(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Venues Details */}
                  {course.venues && course.venues.length > 0 && (
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      <p className="font-semibold mb-2">Selected Venues:</p>
                      {course.venues.map((venue) => (
                        <div key={venue.id} className="mb-2 last:mb-0">
                          <p>
                            <strong>{venue.name}</strong> - {venue.building}, {venue.floor}
                          </p>
                          <p>
                            Capacity: {venue.capacity} students | Radius: {venue.radius}m
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <Button onClick={handleSubmit} className="w-full mt-4">
                Create Courses
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

