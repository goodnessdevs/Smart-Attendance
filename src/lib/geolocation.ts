import { distance, point } from "@turf/turf";

/**
 * Distance helpers for the attendance geofence.
 *
 * IMPORTANT: this is a user-experience aid, not a security control. It runs in
 * the browser, so it can be bypassed with devtools location spoofing. The
 * server has to verify the coordinates it receives before trusting them.
 */
export class GeolocationService {
  /** Metres between two lng/lat pairs. */
  static calculateDistance(
    lng1: number,
    lat1: number,
    lng2: number,
    lat2: number
  ): number {
    return distance(point([lng1, lat1]), point([lng2, lat2]), {
      units: "meters",
    });
  }

  static async getCurrentPosition(
    options?: PositionOptions
  ): Promise<GeolocationPosition> {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser.");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 60_000,
        ...options,
      });
    });
  }

  static isWithinRadius(
    userLng: number,
    userLat: number,
    targetLng: number,
    targetLat: number,
    radius: number
  ) {
    const distanceMeters = this.calculateDistance(
      userLng,
      userLat,
      targetLng,
      targetLat
    );
    return { isWithin: distanceMeters <= radius, distance: distanceMeters };
  }
}

/** Turns a GeolocationPositionError into something worth showing a user. */
export function geolocationErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("code" in error)) return null;

  switch ((error as GeolocationPositionError).code) {
    case 1:
      return "Location permission denied. Enable location access and try again.";
    case 2:
      return "Your position is unavailable right now. Try again in a moment.";
    case 3:
      return "Getting your location timed out. Move somewhere with a clearer signal and retry.";
    default:
      return null;
  }
}
