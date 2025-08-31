import { motion } from "framer-motion";
import MarkAttendance from "../components/MarkAttendance";
import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../hooks/use-auth";

// Enhanced Venue type with additional metadata
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

// Available venues (would come from DB)
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

export default function Dashboard() {
  const { user } = useAuthContext();
  const [locationGranted, setLocationGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied"
  >("idle");
  const [nearbyVenues, setNearbyVenues] = useState<
    Array<Venue & { distance: number; isWithin: boolean }>
  >([]);

  // Check venues when location changes
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

      const withinVenues = venuesWithDistance.filter((v) => v.isWithin);
      if (withinVenues.length > 0) {
        toast.success(
          `You are within range of ${withinVenues.length} venue(s)`
        );
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
    } catch (error) {
      setLocationStatus("denied");
      setLocationGranted(false);

      let errorMessage = "Unable to retrieve your location.";
      if (error instanceof Error) {
        if (
          error.message.includes("permission denied") ||
          error.message.includes("PERMISSION_DENIED")
        ) {
          errorMessage = "Please grant location access to mark attendance.";
        } else if (
          error.message.includes("timeout") ||
          error.message.includes("TIMEOUT")
        ) {
          errorMessage = "Location request timed out. Please try again.";
        } else if (
          error.message.includes("unavailable") ||
          error.message.includes("POSITION_UNAVAILABLE")
        ) {
          errorMessage = "Location unavailable. Please check your GPS/network.";
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="px-4 md:mx-4 mb-12 overflow-x-hidden">
      <div className="mt-10 mb-6">
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
            {user?.matricNo}!
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
        {/* Location Status Section */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Location Status</h3>
                    {locationStatus === "granted" && userLocation && (
                      <div className="text-sm text-muted-foreground">
                        <p>
                          Lat: {userLocation.lat.toFixed(6)}, Lng:{" "}
                          {userLocation.lng.toFixed(6)}
                        </p>
                      </div>
                    )}
                    {locationStatus === "denied" && (
                      <p className="text-sm text-red-600">
                        Location access denied
                      </p>
                    )}
                    {locationStatus === "idle" && (
                      <p className="text-sm text-muted-foreground">
                        Location not requested
                      </p>
                    )}
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
            </CardContent>
          </Card>
        </div>

        {/* Nearby Venues Section */}
        {userLocation && nearbyVenues.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Nearby Venues</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyVenues.slice(0, 4).map((venue) => (
                <Card
                  key={venue.id}
                  className={`${
                    venue.isWithin
                      ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                      : "border-red-200"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{venue.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {venue.building} • {venue.floor}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          venue.isWithin
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {venue.isWithin ? "In Range" : "Out of Range"}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Distance: {Math.round(venue.distance)}m</p>
                      <p>Required: ≤{venue.radius}m</p>
                      <p>Capacity: {venue.capacity} students</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card className="shadow-lg">
          <CardContent className="overflow-x-auto p-0">
            <MarkAttendance locationGranted={locationGranted} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
