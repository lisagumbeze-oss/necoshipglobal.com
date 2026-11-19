export type GeoPointInput = {
  id?: string;
  label?: string | null;
  location?: string | null;
  description?: string | null;
  lat?: number | null;
  lng?: number | null;
  kind?: string;
};

export type LiveMapPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind?: string;
};

export type TrackingGeoResult = {
  points: LiveMapPoint[];
  route: Array<[number, number]>;
  hasCoordinates: boolean;
};

function parseCoord(lat: unknown, lng: unknown): { lat: number; lng: number } | null {
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

/** Collect plottable points and an ordered polyline from events that already have coordinates. */
export function buildTrackingGeo(events: GeoPointInput[]): TrackingGeoResult {
  const points: LiveMapPoint[] = [];

  events.forEach((event, index) => {
    const coords = parseCoord(event.lat, event.lng);
    if (!coords) return;
    const label =
      event.label?.trim() ||
      event.location?.trim() ||
      event.description?.trim() ||
      `Event ${index + 1}`;
    points.push({
      id: event.id ?? `geo-${index}`,
      lat: coords.lat,
      lng: coords.lng,
      label,
      kind: event.kind
    });
  });

  const route: Array<[number, number]> = points.map((p) => [p.lng, p.lat]);

  return {
    points,
    route: route.length >= 2 ? route : [],
    hasCoordinates: points.length > 0
  };
}
