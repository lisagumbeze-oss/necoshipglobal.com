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

function isFiniteCoord(lat: unknown, lng: unknown): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

/** Collect plottable points and an ordered polyline from events that already have coordinates. */
export function buildTrackingGeo(events: GeoPointInput[]): TrackingGeoResult {
  const points: LiveMapPoint[] = [];

  events.forEach((event, index) => {
    if (!isFiniteCoord(event.lat, event.lng)) return;
    const label =
      event.label?.trim() ||
      event.location?.trim() ||
      event.description?.trim() ||
      `Event ${index + 1}`;
    points.push({
      id: event.id ?? `geo-${index}`,
      lat: event.lat,
      lng: event.lng,
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
