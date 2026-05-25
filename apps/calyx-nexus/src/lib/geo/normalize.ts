
/**
 * CALYX NEXUS — Geo-Normalization & Telemetry Engine
 * Implements Spherical Distribution Math (AVP 4.5 Compliant)
 */

export interface GeoPoint {
  lat: number;
  lng: number;
  label: string;
  size: number;
  color: string;
}

export interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  order: number; // 0 for ambient, 1 for live
}

const TECH_HUBS: Record<string, { lat: number; lng: number }> = {
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Berlin": { lat: 52.5200, lng: 13.4050 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Seattle": { lat: 47.6062, lng: -122.3321 },
  "Austin": { lat: 30.2672, lng: -97.7431 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Amsterdam": { lat: 52.3676, lng: 4.9041 },
};

/**
 * Normalizes location strings into GeoPoints.
 */
export function normalizeLocations(locations: string[]): GeoPoint[] {
  return locations.map(loc => {
    const hub = Object.keys(TECH_HUBS).find(key => 
      loc.toLowerCase().includes(key.toLowerCase())
    );

    if (hub) {
      return {
        ...TECH_HUBS[hub],
        label: loc,
        size: 0.1 + Math.random() * 0.2,
        color: "#4E8A78"
      };
    }

    // High-fidelity fallback distribution
    return {
      ...generateRandomSphericalCoord(),
      label: loc || "Unknown Origin",
      size: 0.1,
      color: "#4E8A78"
    };
  });
}

/**
 * MANDATE 3.1: Ambient Noise Generation (The Pulse)
 * Generates uniform spherical distribution to prevent polar clustering.
 */
export function generateAmbientTelemetry(count: number = 35): ArcData[] {
  return Array.from({ length: count }).map(() => {
    const start = generateRandomSphericalCoord();
    const end = generateRandomSphericalCoord();
    
    return {
      startLat: start.lat,
      startLng: start.lng,
      endLat: end.lat,
      endLng: end.lng,
      color: "rgba(78, 138, 120, 0.15)", // Calyx Ambient Opacity
      order: 0
    };
  });
}

/**
 * Spherical coordinate math helper.
 */
function generateRandomSphericalCoord() {
  const theta = 2 * Math.PI * Math.random();
  const phi = Math.acos(2 * Math.random() - 1);
  
  return {
    lat: 90 - (phi * 180) / Math.PI,
    lng: (theta * 180) / Math.PI - 180
  };
}
