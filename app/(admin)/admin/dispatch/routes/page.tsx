import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import { MapWorkspace } from "@/components/shell/app-chrome";
import { demoDrivers, demoRoutes, demoVehicles } from "@/lib/demo/operations-fixtures";
import { Map as MapIcon } from "lucide-react";

export default function DispatchRoutesPage() {
  const primary = demoRoutes[0];

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Dispatch route plans"
        description="UI-32 / UI-26 route presentation with honest non-live map panels. Planned vs confirmed demonstration routes only."
        actions={
          <Link href={"/admin/dispatch/queue" as never}>
            <Button variant="secondary">Dispatch board</Button>
          </Link>
        }
      />

      <OpsDemoNote title="No live GPS tracking">
        <p>{primary?.mapNote ?? "Map panels remain placeholders until operational Mapbox data is connected."}</p>
      </OpsDemoNote>

      <MapWorkspace
        list={
          <div className="space-y-3 p-4">
            <h2 className="ns-card-title">Route list</h2>
            <ul className="space-y-2">
              {demoRoutes.map((r) => {
                const vehicle = demoVehicles.find((v) => v.id === r.vehicleId);
                const driver = demoDrivers.find((d) => d.id === r.driverId);
                return (
                  <li key={r.id} className="rounded-input border border-ns-border px-3 py-2 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-brand-navy">{r.label}</p>
                      <OpsStatusBadge label={r.kind} tone={r.kind === "CONFIRMED" ? "success" : "info"} />
                    </div>
                    <p className="ns-meta mt-1">
                      {r.origin} → {r.destination}
                    </p>
                    <p className="ns-meta">
                      {vehicle?.reference ?? "Vehicle unassigned"} · {driver?.name ?? "Driver unassigned"}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        }
        map={
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-2 p-6 text-center">
            <MapIcon className="text-brand-navy/35" size={36} aria-hidden />
            <p className="ns-card-title">Mapbox-ready placeholder</p>
            <p className="ns-body max-w-sm">
              Non-live location display. Route geometry and vehicle pins are not simulated.
            </p>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {demoRoutes.map((r) => {
          const vehicle = demoVehicles.find((v) => v.id === r.vehicleId);
          const driver = demoDrivers.find((d) => d.id === r.driverId);
          return (
            <Card key={r.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="ns-card-title">{r.label}</h2>
                <OpsStatusBadge label={r.kind} tone={r.kind === "CONFIRMED" ? "success" : "info"} />
              </div>
              <p className="text-sm text-slate-600">
                {r.origin} → {r.destination}
              </p>
              <div>
                <p className="ns-meta mb-2 font-semibold uppercase tracking-wide">Stop sequencing</p>
                <ol className="space-y-1 text-sm">
                  {r.stops.map((stop, index) => (
                    <li key={stop} className="flex gap-2 rounded-input border border-ns-border px-3 py-2">
                      <span className="font-semibold text-brand-navy">{index + 1}.</span>
                      <span>{stop}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className="text-sm text-slate-600">
                Vehicle {vehicle?.reference ?? "unassigned"} · Driver {driver?.name ?? "unassigned"}
              </p>
              <p className="ns-meta">Shipments: {r.shipmentRefs.join(", ") || "None linked"}</p>
              <div className="min-h-[120px] rounded-card border border-dashed border-ns-border bg-brand-surface-muted p-4 text-sm text-slate-600">
                <p className="font-medium text-brand-navy">Map layout</p>
                <p className="mt-1">{r.mapNote}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
