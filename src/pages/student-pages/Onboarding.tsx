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
import { useAuthContext } from "../../hooks/use-auth"; // ✅ Use the hook consistently
import confetti from "canvas-confetti";
import { getDeviceInfo } from "../../utils/deviceUtils";

const MotionCard = motion.create(Card);

function Onboarding() {
  const navigate = useNavigate();
  const { login } = useAuthContext(); // ✅ Use the hook consistently

  const [formData, setFormData] = useState({
    matricNumber: "",
    department: "",
    college: "",
    level: "",
    phoneNumber: "",
    device_uuid: "",
    fingerprint: "",
  });
  const [loading, setLoading] = useState(false);

  const d = new Date();
  const year = d.getFullYear();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate required fields
    if (
      !formData.matricNumber ||
      !formData.college ||
      !formData.department ||
      !formData.level ||
      !formData.phoneNumber
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
      console.log("Submitting onboarding data:", formData);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/update-profile`,
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
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("Registration Completed!");

        // ✅ Fetch updated user details to get complete user object
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
            login(userData, token);

            // Navigate to main dashboard
            navigate("/dashboard");
          } else {
            console.error("Failed to fetch updated user details. Please reload the page.");
            // Still navigate but user might need to refresh
            navigate("/dashboard");
          }
        } catch (userError) {
          console.error("Error fetching user details:", userError);
          // Still navigate, the context initialization will handle it
          navigate("/dashboard");
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

  // Get departments for selected college
  const selectedCollege = colleges.find(
    (college) => college.value === formData.college
  );

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col items-center justify-center bg-gradient-to-tr from-white to-[#e0ffe7] px-4">
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
        className="w-full max-w-full md:max-w-md bg-white shadow-md border"
      >
        <CardHeader>
          <CardTitle className="text-black">Getting Started</CardTitle>
          <CardDescription className="text-gray-500">
            Fill in your details to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div className="space-y-1">
              <Label className="text-black" htmlFor="matricNumber">
                Matric Number
              </Label>
              <Input
                name="matricNumber"
                placeholder="e.g., 20184215"
                value={formData.matricNumber}
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
                  setFormData((prev) => ({
                    ...prev,
                    college: value,
                    department: "", // reset department when college changes
                  }))
                }
                value={formData.college}
              >
                <SelectTrigger id="college" className="border-black">
                  <SelectValue
                    placeholder="Select your college"
                    className="text-black"
                  />
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

            {/* DEPARTMENT SELECT */}
            <div className="space-y-1">
              <Label htmlFor="department">Department</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, department: value }))
                }
                value={formData.department}
                disabled={!formData.college}
              >
                <SelectTrigger id="department" className="border-black">
                  <SelectValue
                    placeholder={
                      formData.college
                        ? "Select your department"
                        : "Select a college first"
                    }
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectGroup>
                    <SelectLabel>Department</SelectLabel>
                    {selectedCollege?.departments.map((dept, index) => (
                      <SelectItem key={index} value={dept.value}>
                        {dept.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* LEVEL SELECT */}
            <div className="space-y-1">
              <Label htmlFor="level">Level</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, level: value }))
                }
                value={formData.level}
              >
                <SelectTrigger id="level" className="border-black">
                  <SelectValue
                    placeholder="Select your level"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectGroup>
                    <SelectLabel>Level</SelectLabel>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                    <SelectItem value="400">400</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="600">600</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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

            <Separator />

            <Button
              type="submit"
              className="w-full text-white bg-black hover:bg-gray-800"
              disabled={
                loading || !formData.device_uuid || !formData.fingerprint
              }
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

export default Onboarding;
