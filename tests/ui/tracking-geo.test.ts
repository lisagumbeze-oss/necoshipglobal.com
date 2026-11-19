import { describe, expect, it } from "vitest";
import { buildTrackingGeo } from "@/lib/maps/tracking-geo";

describe("buildTrackingGeo", () => {
  it("returns empty when events lack coordinates", () => {
    const result = buildTrackingGeo([
      { id: "1", description: "Booked", location: "Los Angeles, US" },
      { id: "2", description: "In transit", location: "Chicago, US" }
    ]);
    expect(result.hasCoordinates).toBe(false);
    expect(result.points).toHaveLength(0);
    expect(result.route).toHaveLength(0);
  });

  it("builds points and polyline from chronological coordinates", () => {
    const result = buildTrackingGeo([
      { id: "a", label: "LAX", lat: 33.94, lng: -118.4 },
      { id: "b", description: "ORD", lat: 41.97, lng: -87.9 },
      { id: "c", location: "No coords" }
    ]);
    expect(result.hasCoordinates).toBe(true);
    expect(result.points).toHaveLength(2);
    expect(result.route).toEqual([
      [-118.4, 33.94],
      [-87.9, 41.97]
    ]);
    expect(result.points[0]?.label).toBe("LAX");
  });

  it("rejects invalid coordinate pairs", () => {
    const result = buildTrackingGeo([
      { id: "bad", lat: 120, lng: -118 },
      { id: "ok", lat: 34.05, lng: -118.24, label: "LA" }
    ]);
    expect(result.points).toHaveLength(1);
    expect(result.route).toHaveLength(0);
  });
});
