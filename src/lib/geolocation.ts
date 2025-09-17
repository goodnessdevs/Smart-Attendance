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
