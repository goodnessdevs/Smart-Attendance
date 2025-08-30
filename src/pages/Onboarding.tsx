import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { colleges } from "../components/CollegeData";
import { Loader2 } from "lucide-react";

const MotionCard = motion.create(Card);

function Onboarding() {
  const d = new Date();
  const year = d.getFullYear();
  const [formData, setFormData] = useState({
    matricNo: "",
    department: "",
    college: "",
    phoneNo: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setLoading(false);
        toast.success("Registration Completed");
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error ocurred, pls try again");
      console.error(error);
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

        <CardContent className="">
          <form onSubmit={handleSubmit} className="space-y-5 text-black">
            <div className="space-y-2">
              <Label className="text-black" htmlFor="matricNo">
                Matric Number
              </Label>
              <Input
                name="matricNo"
                placeholder="e.g., 20184215"
                value={formData.matricNo}
                onChange={handleChange}
                className="border-black"
                required
              />
            </div>

            {/* COLLEGE SELECT */}
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    college: value,
                    department: "", // reset department
                  }))
                }
                value={formData.college}
              >
                <SelectTrigger id="college" className="border-black w-3/4">
                  <SelectValue
                    placeholder="Select your college"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent side="bottom" className="bg-white text-black">
                  {colleges.map((college, index) => (
                    <SelectItem key={index} value={college.value}>
                      {college.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DEPARTMENT SELECT */}
            <div className="space-y-2">
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
                  {selectedCollege?.departments.map((dept, index) => (
                    <SelectItem key={index} value={dept.value}>
                      {dept.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-black" htmlFor="matricNo">
                Phone Number
              </Label>
              <Input
                name="phoneNo"
                placeholder="e.g., 08020184215"
                value={formData.phoneNo}
                onChange={handleChange}
                className="border-black"
                required
              />
            </div>

            <Separator />

            <Button
              type="submit"
              className="w-full text-white bg-black hover:bg-gray-800"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Setting up...
                </>
              ) : (
                <>Finish Setup</>
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
