import { motion } from "framer-motion";
import MarkAttendance from "../components/MarkAttendance";
import { Card, CardContent } from "../components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const [locationGranted, setLocationGranted] = useState(false);

  const handleGrantLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Example lecture hall location (update with real coords)
        const lectureLat = 7.2162;
        const lectureLng = 3.4531;

        // Radius check (25 meters)
        const R = 6371000; // Earth radius in meters
        const dLat = ((lectureLat - userLat) * Math.PI) / 180;
        const dLng = ((lectureLng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((lectureLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (distance <= 25) {
          setLocationGranted(true);
          toast.success("Location verified! You can now mark attendance.");
        } else {
          toast.error("You are not within the lecture hall perimeter.");
        }
      },
      () => {
        toast.error("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div className="px-4 md:mx-4 mb-12 md:mb-0 overflow-x-hidden">
      <div className="mt-14 mb-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            type: "spring",
            stiffness: 120,
          }}
          className="text-4xl text-center font-bold"
        >
          Welcome,{" "}
          <span className="text-cyan-700 dark:text-cyan-200 text-5xl">
            20251234!
          </span>
        </motion.h1>
      </div>
      <motion.h2
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl font-semibold mb-6 md:mt-2 mt-14"
      >
        Attendance Dashboard –{" "}
        <span className="text-cyan-700 dark:text-cyan-200">Mark Courses</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGrantLocation}
            className="px-6 py-2 rounded-xl bg-cyan-700 dark:bg-cyan-200 text-white dark:text-black hover:bg-cyan-600 dark:hover:bg-cyan-300"
          >
            Grant Location Access
          </button>
        </div>
        <Card className="shadow-lg">
          <CardContent className="overflow-x-auto p-0">
            <MarkAttendance locationGranted={locationGranted} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
