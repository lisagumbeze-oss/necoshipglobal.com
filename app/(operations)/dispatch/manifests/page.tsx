import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDrivers, demoManifests, demoVehicles } from "@/lib/demo/operations-fixtures";
import { MANIFEST_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function DispatchManifestsPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Dispatch manifests"
        description="Demonstration manifests with driver, vehicle and shipment allocation."
      />
      <div className="grid gap-3">
        {demoManifests.map((m) => {
          const vehicle = demoVehicles.find((v) => v.id === m.vehicleId);
          const driver = demoDrivers.find((d) => d.id === m.driverId);
          return (
            <Card key={m.id} className="space-y-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono font-semibold text-brand-navy">{m.reference}</p>
                <OpsStatusBadge
                  label={MANIFEST_STATUS_CONFIG[m.status].label}
                  tone={MANIFEST_STATUS_CONFIG[m.status].tone}
                />
              </div>
              <p className="text-slate-600">
                {m.departureLocation} → {m.destination}
              </p>
              <p className="text-slate-600">
                Driver: {driver?.name} · Vehicle: {vehicle?.reference} · Packages: {m.packageCount}
              </p>
              <p className="text-xs text-slate-500">Shipments: {m.shipmentRefs.join(", ")}</p>
              <p className="text-xs text-slate-500">
                Planned departure {new Date(m.plannedDeparture).toLocaleString()}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
