"use client";

import { useMemo, useState } from "react";
import { Badge, Card, Input } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { locationPins, type LocationPin } from "@/lib/locations-data";
import { MapPin } from "lucide-react";

type ServiceFilter = "All" | LocationPin["serviceTypes"][number];

export default function LocationsPage() {
  const [service, setService] = useState<ServiceFilter>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return locationPins.filter((loc) => {
      const byService = service === "All" || loc.serviceTypes.includes(service);
      const q = query.trim().toLowerCase();
      const byQuery =
        !q ||
        loc.city.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q);
      return byService && byQuery;
    });
  }, [service, query]);

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-brand-navy">Locations</h1>
          <p className="mt-2 text-slate-600">Hubs and gateway offices across the {BRAND.name} network.</p>
        </header>

        <div className="flex flex-wrap gap-2">
          {(["All", "Air", "Ocean", "Ground", "Customs", "Warehouse"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`focus-ring rounded-full px-4 py-2 text-sm font-medium ${
                service === s ? "bg-brand-navy text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
              onClick={() => setService(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="min-h-[320px] space-y-3 p-0 overflow-hidden">
            <div className="flex h-full min-h-[320px] items-center justify-center bg-slate-100 text-slate-500">
              <MapPin className="mr-2" size={20} aria-hidden />
              Interactive world map — {filtered.length} location(s) match filters
            </div>
          </Card>

          <div className="space-y-3">
            <Input placeholder="Search city, country, or address" value={query} onChange={(e) => setQuery(e.target.value)} />
            <ul className="space-y-3">
              {filtered.map((loc) => (
                <li key={loc.id}>
                  <Card className="space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brand-navy">
                          {loc.city}, {loc.country}
                        </p>
                        <p className="text-xs text-slate-500">{loc.address}</p>
                      </div>
                      <Badge tone="default">{loc.id.toUpperCase()}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">Hours: {loc.hours}</p>
                    <div className="flex flex-wrap gap-1">
                      {loc.services.map((s) => (
                        <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
            {filtered.length === 0 ? <p className="text-sm text-slate-600">No locations match your filters.</p> : null}
          </div>
        </div>
      </div>
    </main>
  );
}
