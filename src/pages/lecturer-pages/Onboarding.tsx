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
import { getDeviceInfo } from "../../utils/deviceUtils";

const MotionCard = motion.create(Card);

function LecturerOnboarding() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lecturerName: "",
    phoneNumber: "",
    college: "",
    device_uuid: "",
    fingerprint: "",
  });

  // ✅ Initialize device data on component mount
  useEffect(() => {
    async function initDevice() {
      try {
        const { device_uuid, fingerprint } = await getDeviceInfo();

        setFormData((prev) => ({
          ...prev,
          device_uuid,
          fingerprint,
        }));
      } catch (error) {
        console.error("Failed to initialize device data:", error);
        toast.error("Failed to initialize device data");
      }
    }

    initDevice();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lecturerName || !formData.phoneNumber || !formData.college) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      toast.error("No authentication token found. Please sign in again.");
      navigate("/lecturer/login");
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
        toast.success("Registration Completed!");

        try {
          const userResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/user-details`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();

            // ✅ Update AuthContext with complete user data
            login(userData.user, token);

            // Navigate to main dashboard
            navigate("/lecturer/dashboard");
          } else {
            console.error(
              "Failed to fetch updated user details. Please reload the page."
            );
            // Still navigate but user might need to refresh
            navigate("/lecturer/dashboard");
          }
        } catch (userError) {
          console.error("Error fetching user details:", userError);
          // Still navigate, the context initialization will handle it
          navigate("/lecturer/dashboard");
        }
      } else {
        toast.error(data.message || "Registration Failed");
        console.error("Onboarding failed:", data);
      }
    } catch (error) {
      toast.error("An error occurred, please try again");
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-white to-[#91d9a0] px-4">
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
        <p className="text-center text-black text-sm font-semibold">
          &copy; 2025, Federal University of Agriculture, Abeokuta. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}

export default LecturerOnboarding;
