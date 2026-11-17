"use client";

import { useState } from "react";
import { Badge, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoNetworkLocations } from "@/lib/demo/admin-fixtures";

export default function AdminLocationsPage() {
  const [selected, setSelected] = useState(demoNetworkLocations[0]?.id ?? "");
  const location = demoNetworkLocations.find((l) => l.id === selected) ?? demoNetworkLocations[0];

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Locations & network"
        description="Warehouses, offices, collection points, hubs and zones. Planned sites are not published as operating facilities."
      />
      <AdminUiNote>
        Location labels are demonstration records. Do not publish fictional addresses as live NECO facilities. Map panel is
        Mapbox-ready placeholder only.
      </AdminUiNote>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoNetworkLocations.map((l) => (
                <tr
                  key={l.id}
                  className={`cursor-pointer border-b border-slate-100 ${selected === l.id ? "bg-slate-50" : ""}`}
                  onClick={() => setSelected(l.id)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{l.reference}</td>
                  <td className="px-4 py-3">{l.name}</td>
                  <td className="px-4 py-3">{l.type}</td>
                  <td className="px-4 py-3">
                    <Badge tone={l.status === "Active" ? "success" : l.status === "Planned" ? "warning" : "default"}>
                      {l.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {location ? (
          <div className="space-y-4">
            <Card className="space-y-2 text-sm">
              <h2 className="font-semibold text-brand-navy">{location.name}</h2>
              <p>Type: {location.type}</p>
              <p>Region / zone: {location.region}</p>
              <p>Status: {location.status}</p>
              <p className="text-amber-900">{location.note}</p>
            </Card>
            <Card className="flex min-h-[220px] flex-col items-center justify-center bg-slate-100 text-center text-sm text-slate-600">
              <p className="font-semibold text-brand-navy">Mapbox-ready map panel</p>
              <p className="mt-1 max-w-sm">
                Coordinate overlay reserved for approved facility geometry. No fictional pin published as an operating site.
              </p>
            </Card>
            <Card className="space-y-1 text-sm text-slate-600">
              <h3 className="font-semibold text-brand-navy">Shipping zones & routes</h3>
              <p>Zone catalogue and route overlays remain presentation-level until network data is approved.</p>
            </Card>
          </div>
        ) : null}
      </div>
    </section>
  );
}
