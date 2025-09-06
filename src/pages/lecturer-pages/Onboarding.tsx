import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
  CommandEmpty,
} from "../../components/ui/command"; // ✅ Command import
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { colleges } from "../../components/CollegeData";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "../../hooks/use-auth";
import confetti from "canvas-confetti";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

const MotionCard = motion.create(Card);

interface CourseFormData {
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  unit: string;
  lecturers: string[];
  venues: string[];
  days: string[];
  isActive: boolean;
}

function LecturerOnboarding() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [formData, setFormData] = useState({
    lecturerName: "",
    phoneNumber: "",
    college: "",
    coursesOffered: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [allCourses, setAllCourses] = useState<CourseFormData[]>([]);
  const [search, setSearch] = useState("");

  const d = new Date();
  const year = d.getFullYear();

  // ✅ Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/all-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();

        // assuming API returns { courses: [...] }
        setAllCourses(Array.isArray(data) ? data : data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setAllCourses([]); // fallback to empty array
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.lecturerName ||
      !formData.phoneNumber ||
      !formData.college ||
      formData.coursesOffered.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      toast.error("No authentication token found. Please sign in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/update-lecturer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success("Lecturer Registration Completed!");

        // ✅ Fetch updated user details
        const userResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user-details`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          login(userData, token);
        }

        navigate("/lecturer");
      } else {
        toast.error(data.message || "Registration Failed");
      }
    } catch (error) {
      toast.error("An error occurred, please try again");
      console.error("Lecturer Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter courses by search input
  const filteredCourses = Array.isArray(allCourses)
    ? allCourses.filter(
        (c) =>
          c.courseName.toLowerCase().includes(search.toLowerCase()) ||
          c.courseTitle.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-tr from-white to-[#e0ffe7] px-4">
      <div className="flex items-center gap-x-4">
        <div className="w-20 h-20 mb-4">
          <img
            src="/funaab.png"
            alt="funaab"
            className="object-contain w-full h-full"
          />
        </div>
        <h2 className="text-2xl text-black font-bold">Smart Attendance</h2>
      </div>

      <MotionCard
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:max-w-md bg-white shadow-md border"
      >
        <CardHeader>
          <CardTitle className="text-black">Lecturer Setup</CardTitle>
          <CardDescription className="text-gray-500">
            Fill in your details to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            {/* Lecturer Name */}
            <div className="space-y-1">
              <Label className="text-black" htmlFor="lecturerName">
                Full Name
              </Label>
              <Input
                name="lecturerName"
                placeholder="e.g., Dr. John Doe"
                value={formData.lecturerName}
                onChange={handleChange}
                className="border-black"
                required
              />
            </div>

            {/* Phone number */}
            <div className="space-y-1">
              <Label className="text-black" htmlFor="phoneNumber">
                Phone Number
              </Label>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="e.g., 08020184215"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="border-black"
                required
              />
            </div>

            {/* COLLEGE SELECT */}
            <div className="space-y-1">
              <Label htmlFor="college">College</Label>
              <Select
                value={formData.college}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, college: value }))
                }
              >
                <SelectTrigger
                  id="college"
                  className="w-full border border-black"
                >
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectGroup>
                    <SelectLabel>Colleges</SelectLabel>
                    {colleges.map((college, index) => (
                      <SelectItem key={index} value={college.value}>
                        {college.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* COURSES OFFERED COMMAND MULTI-SELECT */}
            <div className="space-y-1">
              <Label htmlFor="coursesOffered">Courses Offered</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-full border border-black text-left">
                    {formData.coursesOffered.length > 0
                      ? `${formData.coursesOffered.length} course(s) selected`
                      : "Select courses"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command className="bg-white text-black">
                    <CommandInput
                      placeholder="Search courses..."
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandList className="max-h-60 overflow-y-auto">
                      <CommandEmpty>No courses found.</CommandEmpty>
                      <CommandGroup heading="Courses">
                        {filteredCourses.slice(0, 10).map((course, idx) => (
                          <CommandItem
                            key={idx}
                            value={course.courseName}
                            onSelect={(value) => {
                              if (!formData.coursesOffered.includes(value)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  coursesOffered: [
                                    ...prev.coursesOffered,
                                    value,
                                  ],
                                }));
                              }
                            }}
                          >
                            {course.courseName} - {course.courseTitle}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Display selected courses */}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.coursesOffered.map((course, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-200 text-sm rounded-md flex items-center gap-1"
                  >
                    {course}
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          coursesOffered: prev.coursesOffered.filter(
                            (c) => c !== course
                          ),
                        }))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            <Button
              type="submit"
              className="w-full text-white bg-black hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Setting up...
                </>
              ) : (
                "Finish Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </MotionCard>

      <div className="mt-3">
        <p className="text-center text-sm font-semibold">
          &copy; {year}, Federal University of Agriculture, Abeokuta. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}

export default LecturerOnboarding;
