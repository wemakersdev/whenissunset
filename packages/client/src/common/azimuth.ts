export type Coordinate = {
  latitude: number;
  longitude: number;
};

export function toRadians(degree: number): number {
  return degree * (Math.PI / 180);
}

export function calculateAzimuthAndAltitude(point1: Coordinate, point2: Coordinate): { azimuth: number; altitude: number } {
  // Convert input coordinates to radians
  const lat1 = toRadians(point1.latitude);
  const lon1 = toRadians(point1.longitude);
  const lat2 = toRadians(point2.latitude);
  const lon2 = toRadians(point2.longitude);

  // Calculate the differences between the two points
  const dLon = lon2 - lon1;
  const dLat = lat2 - lat1;

  // Calculate azimuth
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let azimuth = Math.atan2(y, x);
  azimuth = (azimuth * (180 / Math.PI) + 360) % 360; // Convert radians to degrees and normalize the range to [0, 360)

  // Calculate altitude
  const distance = Math.sqrt(Math.pow(dLat, 2) + Math.pow(dLon, 2));
  const a = Math.sin(distance / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const earthRadius = 6371; // Earth's radius in kilometers
  const altitude = earthRadius * c;

  return {
    azimuth,
    altitude,
  };
}