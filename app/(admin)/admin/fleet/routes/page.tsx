import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDrivers, demoRoutes, demoVehicles } from "@/lib/demo/operations-fixtures";

export default function FleetRoutesPage() {
  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Fleet routes"
        description="Map-ready planned and confirmed routes. No fabricated live GPS positions."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {demoRoutes.map((r) => {
          const vehicle = demoVehicles.find((v) => v.id === r.vehicleId);
          const driver = demoDrivers.find((d) => d.id === r.driverId);
          return (
            <Card key={r.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-brand-navy">{r.label}</h2>
                <OpsStatusBadge label={r.kind} tone={r.kind === "CONFIRMED" ? "success" : "info"} />
              </div>
              <p className="text-sm text-slate-600">
                {r.origin} → {r.destination}
              </p>
              <p className="text-sm text-slate-600">Stops: {r.stops.join(" · ")}</p>
              <p className="text-sm text-slate-600">
                Vehicle: {vehicle?.reference ?? "—"} · Driver: {driver?.name ?? "—"}
              </p>
              <p className="text-xs text-slate-500">Shipments: {r.shipmentRefs.join(", ")}</p>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-medium text-brand-navy">Map panel (Mapbox-ready)</p>
                <p className="mt-1">{r.mapNote}</p>
                <p className="mt-2 text-xs text-amber-800">Live vehicle positions: unavailable</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
