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
import logo from "../assets/funaab.png";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const colleges = [
  {
    title: "COLAMRUD",
    value: "colamrud",
  },
  {
    title: "COLANIM",
    value: "colanim",
  },
  {
    title: "COLBIOS",
    value: "colbios",
  },
  {
    title: "COLCOMS",
    value: "colcoms",
  },
  {
    title: "COLENDS",
    value: "colends",
  },
  {
    title: "COLENG",
    value: "coleng",
  },
  {
    title: "COLERM",
    value: "colerm",
  },
  {
    title: "COLPHYS",
    value: "colphys",
  },
  {
    title: "COLPLANT",
    value: "colplant",
  },
  {
    title: "COLVET",
    value: "colvet",
  },
];

const MotionCard = motion.create(Card);

function Onboarding() {
  const d = new Date();
  const year = d.getFullYear();
  const [formData, setFormData] = useState({
    matricNo: "",
    department: "",
    college: "",
  });

  const navigate = useNavigate();

  const [location, setLocation] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationAccess = () => {
    if (!navigator.geolocation) {
      toast("Geolocation not supported", {
        description: "Your browser does not support location access.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        toast("Location Access Granted", {
          description: `Lat: ${latitude}, Lng: ${longitude}`,
        });
      },
      (error) => {
        toast("Location Access Denied", {
          description: error.message,
        });
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ ...formData, location });
    // send to API or handle onboarding logic
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col items-center justify-center bg-gradient-to-tr from-white to-[#e0ffe7] px-4">
      <div className="flex items-center gap-x-4">
        <div className="w-20 h-20 mb-4">
          <img
            src={logo}
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

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, department: value }))
                }
                value={formData.department}
              >
                <SelectTrigger id="department" className="border-black">
                  <SelectValue
                    placeholder="Select your department"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="computer-science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="electrical-engineering">
                    Electrical Engineering
                  </SelectItem>
                  <SelectItem value="mechanical-engineering">
                    Mechanical Engineering
                  </SelectItem>
                  <SelectItem value="biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="agricultural-economics">
                    Agricultural Economics
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">College</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, college: value }))
                }
                value={formData.college}
              >
                <SelectTrigger id="college" className="border-black">
                  <SelectValue
                    placeholder="Select your college"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent side="top" className="bg-white text-black">
                  {colleges.map((college, index) => (
                    <SelectItem key={index} value={college.value}>
                      {college.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Location Access</Label>
              <Button
                type="button"
                className="text-white bg-black hover:bg-gray-800"
                onClick={handleLocationAccess}
              >
                {location ? "Location Accessed ✅" : "Grant Location Access"}
              </Button>
              {location && <p className="text-sm text-gray-800">{location}</p>}
            </div>

            <Button
              type="submit"
              className="w-full text-white bg-black hover:bg-gray-800"
            >
              Finish Setup
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
