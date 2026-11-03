"use client";

import { useEffect, useRef, useState } from "react";

type Point = {
  id: string;
  lng: number;
  lat: number;
  label: string;
};

export function MapboxLivePanel({
  points,
  className = "h-64"
}: {
  points: Point[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }

    let disposed = false;

    async function boot() {
      const mod = await import("mapbox-gl");
      const mapboxgl = mod.default;
      mapboxgl.accessToken = token;

      if (!containerRef.current || disposed) return;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [0, 20],
        zoom: 1.1
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

      points.forEach((p) => {
        const markerNode = document.createElement("div");
        markerNode.className = "h-2.5 w-2.5 rounded-full bg-brand-blue shadow-[0_0_0_6px_rgba(30,107,255,0.2)]";
        new mapboxgl.Marker(markerNode).setLngLat([p.lng, p.lat]).setPopup(new mapboxgl.Popup().setText(p.label)).addTo(map);
      });

      mapRef.current = map;
      map.on("load", () => setReady(true));
    }

    void boot();

    return () => {
      disposed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points]);

  if (tokenMissing) {
    return (
      <div className={`flex items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 ${className}`}>
        Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` to enable live map rendering.
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-card border border-slate-200 ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      {!ready ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100/70" aria-label="Loading map" />
      ) : null}
    </div>
  );
}
