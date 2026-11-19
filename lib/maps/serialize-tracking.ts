import { getDemoShipment } from "@/lib/demo/customer-fixtures";

export type TrackingEventDto = {
  description: string;
  location?: string | null;
  occurredAt: string;
  status?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export type TrackingShipmentDto = {
  trackingNumber: string;
  status: string;
  origin?: string;
  destination?: string;
  createdAt?: string | null;
  eta?: string | null;
  currentLocation?: string | null;
  recipientToken?: string | null;
  events?: TrackingEventDto[];
  demonstration?: boolean;
};

function asIso(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return null;
}

/** Normalize repository / Prisma shipment rows for public tracking clients. */
export function serializeTrackingShipment(shipment: Record<string, unknown>): TrackingShipmentDto {
  const originAddress = shipment.originAddress as { city?: string; country?: string } | null | undefined;
  const destinationAddress = shipment.destinationAddress as
    | { city?: string; country?: string }
    | null
    | undefined;

  const originFromAddress = [originAddress?.city, originAddress?.country].filter(Boolean).join(", ");
  const destinationFromAddress = [destinationAddress?.city, destinationAddress?.country]
    .filter(Boolean)
    .join(", ");

  const eventsRaw = Array.isArray(shipment.events) ? shipment.events : [];
  const events: TrackingEventDto[] = eventsRaw.map((event) => {
    const e = event as Record<string, unknown>;
    return {
      description: String(e.description ?? e.title ?? "Tracking event"),
      location: (e.location as string | null | undefined) ?? null,
      occurredAt: asIso(e.occurredAt ?? e.timestamp) ?? new Date(0).toISOString(),
      status: (e.status as string | null | undefined) ?? null,
      lat: typeof e.lat === "number" ? e.lat : null,
      lng: typeof e.lng === "number" ? e.lng : null
    };
  });

  return {
    trackingNumber: String(shipment.trackingNumber ?? ""),
    status: String(shipment.status ?? "UNKNOWN"),
    origin: (shipment.origin as string | undefined) ?? (originFromAddress || undefined),
    destination: (shipment.destination as string | undefined) ?? (destinationFromAddress || undefined),
    createdAt: asIso(shipment.createdAt ?? shipment.bookingDate),
    eta: asIso(shipment.eta ?? shipment.estimatedDelivery),
    currentLocation: (shipment.currentLocation as string | null | undefined) ?? null,
    recipientToken: (shipment.recipientToken as string | null | undefined) ?? null,
    events,
    demonstration: Boolean(shipment.demonstration)
  };
}

/** Labelled demo fallback for NS-DEMO-* tracking numbers when no live/memory record exists. */
export function getDemoTrackingShipment(trackingNumber: string): TrackingShipmentDto | null {
  const demo = getDemoShipment(trackingNumber);
  if (!demo) return null;
  return serializeTrackingShipment({
    trackingNumber: demo.trackingNumber,
    status: demo.status,
    origin: demo.origin,
    destination: demo.destination,
    createdAt: demo.bookingDate,
    eta: demo.estimatedDelivery,
    currentLocation: demo.currentLocation,
    recipientToken: null,
    events: demo.events.map((event) => ({
      description: event.description,
      location: event.location,
      occurredAt: event.timestamp,
      status: event.status,
      lat: event.lat ?? null,
      lng: event.lng ?? null
    })),
    demonstration: true
  });
}
