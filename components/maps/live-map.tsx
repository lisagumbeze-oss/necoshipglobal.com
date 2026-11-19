"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { LiveMapPoint } from "@/lib/maps/tracking-geo";

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster" as const,
      source: "osm"
    }
  ]
};

const ROUTE_SOURCE = "neco-route";
const ROUTE_LAYER = "neco-route-line";

export function LiveMap({
  points,
  route = [],
  className = "h-64",
  fitBounds = true,
  emptyMessage = "No map coordinates are available for this shipment yet."
}: {
  points: LiveMapPoint[];
  /** GeoJSON line positions as [lng, lat] pairs. */
  route?: Array<[number, number]>;
  className?: string;
  fitBounds?: boolean;
  emptyMessage?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<{ remove: () => void; resize: () => void } | null>(null);
  const markersRef = useRef<Array<{ remove: () => void }>>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reactId = useId();
  const pointsKey = points.map((p) => `${p.id}:${p.lat}:${p.lng}`).join("|");
  const routeKey = route.map((c) => c.join(",")).join("|");

  useEffect(() => {
    if (!points.length) {
      setReady(false);
      setFailed(false);
      return;
    }

    let disposed = false;

    async function boot() {
      try {
        const maplibre = await import("maplibre-gl");
        if (!containerRef.current || disposed) return;

        const maplibregl = maplibre.default;
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: OSM_STYLE as never,
          center: [points[0]!.lng, points[0]!.lat],
          zoom: points.length === 1 ? 4 : 1.4,
          attributionControl: { compact: true }
        });

        map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");

        map.on("load", () => {
          if (disposed) return;

          if (route.length >= 2) {
            map.addSource(ROUTE_SOURCE, {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: route
                }
              }
            });
            map.addLayer({
              id: ROUTE_LAYER,
              type: "line",
              source: ROUTE_SOURCE,
              paint: {
                "line-color": "#0B1F3A",
                "line-width": 3,
                "line-opacity": 0.75
              }
            });
          }

          const bounds = new maplibregl.LngLatBounds();
          points.forEach((p) => {
            const markerNode = document.createElement("div");
            markerNode.className =
              "h-3 w-3 rounded-full border-2 border-white bg-brand-yellow shadow-[0_0_0_4px_rgba(248,224,0,0.35)]";
            markerNode.setAttribute("role", "img");
            markerNode.setAttribute("aria-label", p.label);
            const marker = new maplibregl.Marker({ element: markerNode })
              .setLngLat([p.lng, p.lat])
              .setPopup(new maplibregl.Popup({ offset: 12 }).setText(p.label))
              .addTo(map);
            markersRef.current.push(marker);
            bounds.extend([p.lng, p.lat]);
          });

          if (fitBounds && points.length > 0) {
            if (points.length === 1) {
              map.setCenter([points[0]!.lng, points[0]!.lat]);
              map.setZoom(5);
            } else {
              map.fitBounds(bounds, { padding: 48, maxZoom: 8, duration: 0 });
            }
          }

          map.resize();
          setReady(true);
        });

        mapRef.current = map;
      } catch {
        if (!disposed) setFailed(true);
      }
    }

    void boot();

    return () => {
      disposed = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remount when coordinate sets change
  }, [pointsKey, routeKey, fitBounds]);

  if (!points.length) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500",
          className
        )}
        role="status"
      >
        {emptyMessage}
      </div>
    );
  }

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500",
          className
        )}
        role="alert"
      >
        Map could not be loaded. Tracking details remain available in the timeline.
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-card border border-ns-border bg-white", className)}
      data-map-id={reactId}
    >
      <div ref={containerRef} className="h-full w-full min-h-[12rem]" />
      {!ready ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100/70" aria-label="Loading map" />
      ) : null}
    </div>
  );
}
