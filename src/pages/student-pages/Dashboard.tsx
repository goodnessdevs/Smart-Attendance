import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { useState, useEffect } from "react";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/use-auth";
import SignedOutDashboard from "./SignedOutDashboard";

// --- Venue type ---
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

// --- Course type ---
type Course = {
  _id: string;
  courseName: string;
  courseTitle: string;
  courseDescription: string;
  isActive: boolean;
};

// --- Mock venues ---
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

// --- Geolocation utility service ---
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
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) ** 2;
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

  static isWithinVenue(userLat: number, userLng: number, venue: Venue) {
    const distance = this.calculateDistance(
      userLat,
      userLng,
      venue.lat,
      venue.lng
    );
    return { isWithin: distance <= venue.radius, distance };
  }
}

export default function Dashboard() {
  const { token, user, isInitializing } = useAuthContext();
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch active courses
  useEffect(() => {
    const fetchActiveCourses = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/active-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch active courses");
        const data = await res.json();
        console.log(data, data.courses);
        setActiveCourses(data.courses); // 🔹 assuming backend returns { courses: [...] }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching active courses");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchActiveCourses();
  }, []);

  // --- Persist states with localStorage ---
  const [locationGranted, setLocationGranted] = useState<boolean>(
    () => localStorage.getItem("locationGranted") === "true"
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(() => {
    const saved = localStorage.getItem("userLocation");
    return saved ? JSON.parse(saved) : null;
  });
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied"
  >(locationGranted ? "granted" : "idle");
  const [nearbyVenues, setNearbyVenues] = useState<
    Array<Venue & { distance: number; isWithin: boolean }>
  >([]);

  useEffect(() => {
    localStorage.setItem("locationGranted", String(locationGranted));
  }, [locationGranted]);

  useEffect(() => {
    if (userLocation) {
      localStorage.setItem("userLocation", JSON.stringify(userLocation));
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      const venuesWithDistance = availableVenues.map((venue) => {
        const result = GeolocationService.isWithinVenue(
          userLocation.lat,
          userLocation.lng,
          venue
        );
        return {
          ...venue,
          distance: result.distance,
          isWithin: result.isWithin,
        };
      });
      setNearbyVenues(
        venuesWithDistance.sort((a, b) => a.distance - b.distance)
      );
    }
  }, [userLocation]);

  const handleGrantLocation = async () => {
    setLocationStatus("loading");
    try {
      const position = await GeolocationService.getCurrentPosition();
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(location);
      setLocationGranted(true);
      setLocationStatus("granted");
      toast.success(
        `Location verified! (±${Math.round(
          position.coords.accuracy
        )}m accuracy)`
      );
    } catch (error: unknown) {
      setLocationStatus("denied");
      setLocationGranted(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to retrieve your location."
      );
    }
  };

  // --- Auth loading ---
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!token) return <SignedOutDashboard />;

  return (
    <div className="px-4 md:px-8 mb-12">
      {/* Welcome Section */}
      <div className="mt-12 mb-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <h1 className="text-4xl font-bold">
            Hello,{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-500 dark:from-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
              {user ? `${user.matricNumber}!` : "Student"}
            </span>
          </h1>
        </motion.div>
      </div>

      {/* Location Section */}
      <Card className="mb-10 shadow-lg border-cyan-100 dark:border-cyan-900">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-600" /> Location Status
              </h3>
              {locationStatus === "granted" && userLocation && (
                <p className="text-sm text-muted-foreground">
                  Lat: {userLocation.lat.toFixed(6)}, Lng:{" "}
                  {userLocation.lng.toFixed(6)}
                </p>
              )}
              {locationStatus === "denied" && (
                <p className="text-sm text-red-600">Location access denied</p>
              )}
              {locationStatus === "idle" && (
                <p className="text-sm text-muted-foreground">
                  Location not requested
                </p>
              )}
            </div>
            <button
              onClick={handleGrantLocation}
              disabled={locationStatus === "loading"}
              className={`px-5 py-2 rounded-xl font-medium shadow ${
                locationStatus === "granted"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-300 dark:text-black dark:hover:bg-cyan-400"
              } disabled:opacity-50`}
            >
              {locationStatus === "loading"
                ? "Locating..."
                : locationStatus === "granted"
                ? "Refresh Location"
                : "Grant Location"}
            </button>
          </div>

          <p className="text-sm">
            Location granted:{" "}
            <span
              className={locationGranted ? "text-green-600" : "text-red-600"}
            >
              {locationGranted ? "Yes" : "No"}
            </span>
          </p>

          {nearbyVenues.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Nearby Venues</h4>
              <div className="flex flex-wrap gap-2">
                {nearbyVenues.map((venue) => (
                  <span
                    key={venue.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium shadow ${
                      venue.isWithin
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {venue.name} • {venue.distance.toFixed(1)}m
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Courses Section */}
      {/* Courses Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-5">Active Courses</h3>

            {loadingCourses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
              </div>
            ) : activeCourses.length === 0 ? (
              <p className="text-muted-foreground">
                No active courses available.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {activeCourses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/course/${course._id}`}
                    className={`block p-5 rounded-xl border shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 ${
                      course.isActive
                        ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20"
                        : "bg-green-50 border-green-200 dark:bg-green-900/20"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {course.courseName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {course.courseTitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {course.courseDescription}
                        </p>
                      </div>
                      {course.isActive ? (
                        <motion.span
                          animate={{ scale: [0.9, 1.1, 0.9] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="px-3 py-1 rounded-full text-xs font-semibold shadow bg-yellow-100 text-yellow-700 border border-yellow-200"
                        >
                          Pending
                        </motion.span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold shadow bg-green-100 text-green-700 border border-green-200">
                          Marked
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
