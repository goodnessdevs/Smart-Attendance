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


// src/lib/geolocation.ts

export class GeolocationService {
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
        timeout: 60000,
        maximumAge: 60000,
        ...options,
      };
      navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
    });
  }

  static isWithinRadius(
    userLat: number,
    userLng: number,
    targetLat: number,
    targetLng: number,
    radius: number
  ) {
    const distance = this.calculateDistance(
      userLat,
      userLng,
      targetLat,
      targetLng
    );
    return { isWithin: distance <= radius, distance };
  }
}
