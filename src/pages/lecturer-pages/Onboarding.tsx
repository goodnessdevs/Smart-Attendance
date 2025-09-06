import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { colleges } from "../../components/CollegeData";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "../../hooks/use-auth";
import confetti from "canvas-confetti";

const MotionCard = motion.create(Card);

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
  const [allCourses, setAllCourses] = useState<{ code: string; title: string }[]>([]);

  const d = new Date();
  const year = d.getFullYear();

  // ✅ Fetch available courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const token = localStorage.getItem("jwt_token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/all-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAllCourses(data); // expecting [{ code, title }, ...]
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    }

    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lecturerName || !formData.phoneNumber || !formData.college || formData.coursesOffered.length === 0) {
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
      console.log("Submitting lecturer onboarding data:", formData);

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
        // 🎉 Success effects
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

        navigate("/");
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
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, college: value }))
                }
                value={formData.college}
              >
                <SelectTrigger id="college" className="border-black">
                  <SelectValue placeholder="Select your college" className="text-black" />
                </SelectTrigger>
                <SelectContent side="bottom" className="bg-white text-black">
                  <SelectGroup>
                    <SelectLabel>College</SelectLabel>
                    {colleges.map((college, index) => (
                      <SelectItem key={index} value={college.value}>
                        {college.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* COURSES OFFERED MULTI-SELECT */}
            <div className="space-y-1">
              <Label htmlFor="coursesOffered">Courses Offered</Label>
              <Select
                onValueChange={(value) => {
                  if (!formData.coursesOffered.includes(value)) {
                    setFormData((prev) => ({
                      ...prev,
                      coursesOffered: [...prev.coursesOffered, value],
                    }));
                  }
                }}
              >
                <SelectTrigger id="coursesOffered" className="border-black">
                  <SelectValue placeholder="Search and select courses" />
                </SelectTrigger>
                <SelectContent side="bottom" className="bg-white text-black max-h-60 overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {allCourses.map((course, index) => (
                      <SelectItem key={index} value={course.code}>
                        {course.code} - {course.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

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
                          coursesOffered: prev.coursesOffered.filter((c) => c !== course),
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
          &copy; {year}, Federal University of Agriculture, Abeokuta. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LecturerOnboarding;
