// src/lib/geolocation.ts
import * as turf from '@turf/turf';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface DistanceResult {
  isWithin: boolean;
  distance: number;
  accuracy?: number;
}

export class GeolocationService {
  /**
   * Calculate distance between two points using Turf.js
   * Turf uses [longitude, latitude] order (GeoJSON standard)
   * @param lon1 - First point longitude
   * @param lat1 - First point latitude
   * @param lon2 - Second point longitude
   * @param lat2 - Second point latitude
   * @returns Distance in meters
   */
  static calculateDistance(
    lon1: number,
    lat1: number,
    lon2: number,
    lat2: number
  ): number {
    const from = turf.point([lon1, lat1]);
    const to = turf.point([lon2, lat2]);
    
    // turf.distance returns kilometers by default, convert to meters
    const distanceKm = turf.distance(from, to, { units: 'kilometers' });
    return distanceKm * 1000;
  }

  /**
   * Get current position with improved error handling and fallback
   * @param options - Geolocation options
   * @returns Promise with GeolocationPosition
   */
  static async getCurrentPosition(
    options?: PositionOptions
  ): Promise<GeolocationPosition> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser.");
    }

    // Try high accuracy first
    const highAccuracyOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 5000, // 5 seconds
      ...options,
    };

    try {
      return await this._getPosition(highAccuracyOptions);
    } catch (error) {
      // Fallback to lower accuracy if high accuracy fails
      console.warn("High accuracy failed, trying lower accuracy...", error);
      
      const lowAccuracyOptions: PositionOptions = {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
      };

      return await this._getPosition(lowAccuracyOptions);
    }
  }

  /**
   * Private method to get position
   */
  private static _getPosition(
    options: PositionOptions
  ): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  /**
   * Check if user is within radius of target location
   * Uses Turf.js with [longitude, latitude] order
   * @param userLon - User's longitude
   * @param userLat - User's latitude
   * @param targetLon - Target longitude
   * @param targetLat - Target latitude
   * @param radius - Radius in meters
   * @param userAccuracy - Optional GPS accuracy to add as buffer
   * @returns Object with isWithin status and distance
   */
  static isWithinRadius(
    userLon: number,
    userLat: number,
    targetLon: number,
    targetLat: number,
    radius: number,
    userAccuracy?: number
  ): DistanceResult {
    const distance = this.calculateDistance(
      userLon,
      userLat,
      targetLon,
      targetLat
    );

    // Account for GPS accuracy - if accuracy is poor, add it as buffer
    const effectiveRadius = userAccuracy 
      ? radius + Math.min(userAccuracy, 50) // Cap accuracy buffer at 50m
      : radius;

    return {
      isWithin: distance <= effectiveRadius,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      accuracy: userAccuracy,
    };
  }

  /**
   * Alternative: Check if point is within a polygon (for irregular venue shapes)
   * Useful if you want to define custom venue boundaries
   */
  static isWithinPolygon(
    userLon: number,
    userLat: number,
    polygonCoordinates: number[][]
  ): boolean {
    const point = turf.point([userLon, userLat]);
    const polygon = turf.polygon([polygonCoordinates]);
    return turf.booleanPointInPolygon(point, polygon);
  }

  /**
   * Create a circle (buffer) around a point - useful for visualization
   * @param lon - Center longitude
   * @param lat - Center latitude
   * @param radius - Radius in meters
   * @returns GeoJSON polygon representing the circle
   */
  static createCircle(lon: number, lat: number, radius: number) {
    const center = turf.point([lon, lat]);
    // Convert meters to kilometers for turf
    const radiusKm = radius / 1000;
    return turf.circle(center, radiusKm, { units: 'kilometers' });
  }

  /**
   * Get bearing (direction) from user to target
   * @returns Bearing in degrees (0-360)
   */
  static getBearing(
    userLon: number,
    userLat: number,
    targetLon: number,
    targetLat: number
  ): number {
    const from = turf.point([userLon, userLat]);
    const to = turf.point([targetLon, targetLat]);
    return turf.bearing(from, to);
  }

  /**
   * Watch position with continuous updates (useful for live tracking)
   */
  static watchPosition(
    successCallback: (position: GeolocationPosition) => void,
    errorCallback?: (error: GeolocationPositionError) => void,
    options?: PositionOptions
  ): number {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser.");
    }

    const watchOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
      ...options,
    };

    return navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      watchOptions
    );
  }

  /**
   * Clear position watch
   */
  static clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }

  /**
   * Format distance for display
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  }

  /**
   * Get compass direction (N, NE, E, SE, S, SW, W, NW)
   */
  static getCompassDirection(bearing: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((bearing % 360) / 45)) % 8;
    return directions[index];
  }

  /**
   * Get user-friendly error message
   */
  static getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location permission denied. Please enable location access in your browser settings.";
      case error.POSITION_UNAVAILABLE:
        return "Location unavailable. Please check your device's location settings and try again.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again or move to an area with better signal.";
      default:
        return "Unable to retrieve location. Please try again.";
    }
  }

  /**
   * Validate coordinates
   */
  static isValidCoordinates(lon: number, lat: number): boolean {
    return (
      typeof lon === 'number' &&
      typeof lat === 'number' &&
      lon >= -180 &&
      lon <= 180 &&
      lat >= -90 &&
      lat <= 90 &&
      !isNaN(lon) &&
      !isNaN(lat)
    );
  }
}



// // src/lib/geolocation.ts

// const GOOGLE_GEOLOCATION_API_KEY = import.meta.env.VITE_GOOGLE_GEOLOCATION_API_KEY


// import { distance, point } from '@turf/turf';

// export class GeolocationService {
//   static calculateDistance(
//     lng1: number,
//     lat1: number,
//     lng2: number,
//     lat2: number,
//   ): number {
//     const from = point([lng1, lat1]);
//     const to = point([lng2, lat2]);
//     // Turf returns distance in kilometers by default, convert to meters
//     return distance(from, to, { units: 'meters' });
//   }

//   static getCurrentPosition(
//     options?: PositionOptions
//   ): Promise<GeolocationPosition | { coords: { latitude: number; longitude: number } }> {
//     try {
//       return new Promise((resolve, reject) => {
//         if (!navigator.geolocation) {
//           reject(new Error("Geolocation not supported by browser."));
//           return;
//         }

//         const defaultOptions: PositionOptions = {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 60000,
//           ...options,
//         };

//         console.log("📍 Using HTML5 Geolocation");
//         navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
//       });
//     } catch (err) {
//       console.warn("⚠️ HTML5 Geolocation failed, falling back to Google API:", err);
//       return this.getPositionFromGoogle();
//     }
//   }

//   // ✅ Fallback: use Google Cloud Geolocation API (network/cell tower based)
//   static async getPositionFromGoogle(): Promise<{ coords: { latitude: number; longitude: number } }> {
//     if (!GOOGLE_GEOLOCATION_API_KEY) {
//       throw new Error("Google Geolocation API key not found. Please set VITE_GOOGLE_GEOLOCATION_API_KEY in your .env file.");
//     }

//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_GEOLOCATION_API_KEY}`,
//         { method: "POST" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch location from Google Geolocation API");
//       }

//       const data = await response.json();
//       console.log("📡 Using Google Cloud Geolocation API fallback");
//       if (!data.location) {
//         throw new Error("Invalid location data from Google API");
//       }

//       return {
//         coords: {
//           latitude: data.location.lat,
//           longitude: data.location.lng,
//         },
//       };
//     } catch (error) {
//       console.error("Google Geolocation API error:", error);
//       throw new Error("Unable to determine your location. Please enable GPS.");
//     }
//   }

//   static isWithinRadius(
//     userLng: number,
//     userLat: number,
//     targetLng: number,
//     targetLat: number,
//     radius: number
//   ) {
//     const distanceMeters = this.calculateDistance(
//       userLng,
//       userLat,
//       targetLng,
//       targetLat,

//     );
//     return { isWithin: distanceMeters <= radius, distance: distanceMeters };
//   }
// }


// // src/lib/geolocation.ts

// export class GeolocationService {
//   private static readonly EARTH_RADIUS_METERS = 6371000;

//   static calculateDistance(
//     lat1: number,
//     lng1: number,
//     lat2: number,
//     lng2: number
//   ): number {
//     const toRadians = (degrees: number) => degrees * (Math.PI / 180);
//     const dLat = toRadians(lat2 - lat1);
//     const dLng = toRadians(lng2 - lng1);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRadians(lat1)) *
//         Math.cos(toRadians(lat2)) *
//         Math.sin(dLng / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return this.EARTH_RADIUS_METERS * c;
//   }

//   static getCurrentPosition(
//     options?: PositionOptions
//   ): Promise<GeolocationPosition> {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error("Geolocation is not supported by this browser."));
//         return;
//       }
//       const defaultOptions: PositionOptions = {
//         enableHighAccuracy: true,
//         timeout: 60000,
//         maximumAge: 60000,
//         ...options,
//       };
//       navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
//     });
//   }

//   static isWithinRadius(
//     userLat: number,
//     userLng: number,
//     targetLat: number,
//     targetLng: number,
//     radius: number
//   ) {
//     const distance = this.calculateDistance(
//       userLat,
//       userLng,
//       targetLat,
//       targetLng
//     );
//     return { isWithin: distance <= radius, distance };
//   }
// }
