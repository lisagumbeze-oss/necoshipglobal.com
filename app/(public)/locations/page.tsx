"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, Input, ButtonLink } from "@/components/design-system/ui";
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
    <main className="bg-brand-surface">
      <div className="ns-container max-w-ns-xl space-y-6 py-10 md:py-14">
        <header className="max-w-3xl">
          <p className="ns-meta font-semibold uppercase tracking-[0.16em] text-brand-navy">Network</p>
          <h1 className="ns-page-title mt-2">Shipping locations</h1>
          <p className="ns-body mt-2 text-base">
            Illustrative gateway cities used to describe {BRAND.name} lane planning. Addresses and hours below are
            demonstration references for the public website and may not represent active walk-in facilities.
          </p>
          <p className="mt-3 rounded-input border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Demonstration data — confirm service availability for your lane when requesting a quotation.
          </p>
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

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="flex min-h-[280px] flex-col items-center justify-center gap-3 bg-slate-100 text-center text-slate-600">
            <MapPin size={22} aria-hidden />
            <p className="max-w-sm text-sm">
              Location map placeholder — {filtered.length} demonstration location(s) match the current filters.
            </p>
            <ButtonLink href="/quote">Get a Quote for your lane</ButtonLink>
          </Card>

          <div className="space-y-3">
            <Input
              placeholder="Search city, country, or address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search shipping locations"
            />
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
                    <p className="text-xs text-slate-600">Reference hours: {loc.hours}</p>
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
