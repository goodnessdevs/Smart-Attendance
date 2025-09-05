import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { useState, useEffect } from "react";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/use-auth";
import SignedOutDashboard from "./SignedOutDashboard";

// Venue type
type Venue = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters
  building?: string;
  floor?: string;
  capacity?: number;
  isActive: boolean;
};

// Geolocation utilities
class GeolocationService {
  private static readonly EARTH_RADIUS_METERS = 6371000;

  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS_METERS * c;
  }

  static getCurrentPosition(
    options?: PositionOptions
  ): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
        ...options,
      };

      navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
    });
  }

  static isWithinVenue(
    userLat: number,
    userLng: number,
    venue: Venue
  ): { isWithin: boolean; distance: number } {
    const distance = this.calculateDistance(
      userLat,
      userLng,
      venue.lat,
      venue.lng
    );
    return {
      isWithin: distance <= venue.radius,
      distance,
    };
  }
}

// Mock venues
const availableVenues: Venue[] = [
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

type Course = {
  id: string;
  name: string;
  code: string;
  lecturer: string;
  time: string;
  location: string;
  status: "pending" | "marked";
};

// Mock courses
const activeCourses: Course[] = [
  {
    id: "csc101",
    name: "Introduction to Computer Science",
    code: "CSC 101",
    lecturer: "Prof. John David",
    time: "2:00 PM - 4:00 PM",
    location: "Computer Lab 2",
    status: "pending",
  },
  {
    id: "phy201",
    name: "Physics II",
    code: "PHY 201",
    lecturer: "Dr. Mary Johnson",
    time: "9:00 AM - 11:00 AM",
    location: "Science Block 301",
    status: "marked",
  },
];

export default function Dashboard() {
  const { token, user, isInitializing } = useAuthContext();
  const [locationGranted, setLocationGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const [nearbyVenues, setNearbyVenues] = useState<Array<Venue & { distance: number; isWithin: boolean }>>([]);

  // Check venues when location changes
  useEffect(() => {
    if (userLocation) {
      const venuesWithDistance = availableVenues.map((venue) => {
        const result = GeolocationService.isWithinVenue(userLocation.lat, userLocation.lng, venue);
        return { ...venue, distance: result.distance, isWithin: result.isWithin };
      });

      setNearbyVenues(venuesWithDistance.sort((a, b) => a.distance - b.distance));

      const withinVenues = venuesWithDistance.filter((v) => v.isWithin);
      if (withinVenues.length > 0) {
        toast.success(`You are within range of ${withinVenues.length} venue(s)`);
      }
    }
  }, [userLocation]);

  const handleGrantLocation = async () => {
    setLocationStatus("loading");
    try {
      const position = await GeolocationService.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      });
      const location = { lat: position.coords.latitude, lng: position.coords.longitude };
      setUserLocation(location);
      setLocationGranted(true);
      setLocationStatus("granted");
      toast.success(`Location verified! (±${Math.round(position.coords.accuracy)}m accuracy)`);
    } catch (error: unknown) {
      setLocationStatus("denied");
      setLocationGranted(false);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to retrieve your location.");
      }
    }
  };

  // While auth is still initializing, show a loading indicator
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="animate-spin w-6 h-6"><Loader2 /></p>
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  // Once initialization is done:
  if (!token) {
    return <SignedOutDashboard />;
  }

  return (
    <div className="px-4 md:mx-4 mb-12 overflow-x-hidden">
      {/* Welcome */}
      <div className="mt-10 mb-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 120 }}
          className="text-4xl text-center font-bold"
        >
          Welcome,{" "}
          <span className="text-cyan-700 dark:text-cyan-200 text-5xl">
            {user ? user?.fullName : "student"}!
          </span>
        </motion.h1>
      </div>

      {/* Dashboard Title */}
      <motion.h2
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl font-semibold mb-6 md:mt-2 mt-14"
      >
        Attendance Dashboard – <span className="text-cyan-700 dark:text-cyan-200">Mark Courses</span>
      </motion.h2>

      <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        {/* Location Status */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col space-y-4">
              {/* Status row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Location Status</h3>
                    {locationStatus === "granted" && userLocation && (
                      <p className="text-sm text-muted-foreground">
                        Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                      </p>
                    )}
                    {locationStatus === "denied" && <p className="text-sm text-red-600">Location access denied</p>}
                    {locationStatus === "idle" && <p className="text-sm text-muted-foreground">Location not requested</p>}
                  </div>
                </div>
                <button
                  onClick={handleGrantLocation}
                  disabled={locationStatus === "loading"}
                  className={`px-6 py-2 rounded-xl ${
                    locationStatus === "granted"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-cyan-700 hover:bg-cyan-600"
                  } text-white dark:bg-cyan-200 dark:text-black dark:hover:bg-cyan-300 disabled:opacity-50`}
                >
                  {locationStatus === "loading"
                    ? "Getting Location..."
                    : locationStatus === "granted"
                    ? "Refresh Location"
                    : "Grant Location Access"}
                </button>
              </div>

              {/* ✅ Location Granted Info */}
              <div>
                <p className="text-sm">
                  Location granted:{" "}
                  <span className={locationGranted ? "text-green-600" : "text-red-600"}>
                    {locationGranted ? "Yes" : "No"}
                  </span>
                </p>
              </div>

              {/* ✅ Nearby Venues */}
              {nearbyVenues.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Nearby Venues</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {nearbyVenues.map((venue) => (
                      <li key={venue.id}>
                        {venue.name} – {venue.distance.toFixed(1)}m{" "}
                        {venue.isWithin && <span className="text-green-600 font-medium">(Within Range)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-4">Active Courses</h3>
            <div className="space-y-3">
              {activeCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className={`block p-4 rounded-lg border transition ${
                    course.status === "marked"
                      ? "bg-green-50 border-green-300 dark:bg-green-900/20"
                      : "bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20"
                  } hover:shadow-md`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">{course.code} • {course.lecturer}</p>
                      <p className="text-xs text-muted-foreground">{course.time} • {course.location}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        course.status === "marked"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      }`}
                    >
                      {course.status === "marked" ? "Marked" : "Pending"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
