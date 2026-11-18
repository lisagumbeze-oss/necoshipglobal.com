import Link from "next/link";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import { demoDrivers, demoMaintenance, getVehicle } from "@/lib/demo/operations-fixtures";
import { VEHICLE_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function VehicleDetailPage({ params }: { params: { vehicleId: string } }) {
  const vehicle = getVehicle(params.vehicleId);
  if (!vehicle) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-4">
        <DashboardPageHeader title="Vehicle not found" description="No demonstration vehicle matches." />
        <Link href={"/fleet/vehicles" as never}>
          <Button variant="secondary">Back</Button>
        </Link>
      </section>
    );
  }
  const driver = demoDrivers.find((d) => d.id === vehicle.assignedDriverId);
  const maintenance = demoMaintenance.filter((m) => m.vehicleId === vehicle.id);

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title={vehicle.reference}
        description={`UI-38 vehicle profile · ${vehicle.make} ${vehicle.model}`}
        actions={
          <>
            <Link href={"/fleet/maintenance" as never}>
              <Button variant="ghost">Maintenance</Button>
            </Link>
            <Link href={"/fleet/vehicles" as never}>
              <Button variant="secondary">Directory</Button>
            </Link>
          </>
        }
      />

      <OpsDemoNote title="Demonstration fleet asset">
        <p>No live GPS. Capacity and inspection fields are fixture-supported labels only.</p>
      </OpsDemoNote>

      <Card className="flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-brand-yellow">
        <div>
          <p className="ns-meta font-semibold uppercase tracking-wide">Vehicle information</p>
          <p className="mt-1 font-mono text-sm font-semibold text-brand-navy">{vehicle.registration}</p>
          <p className="ns-meta">{vehicle.category}</p>
        </div>
        <OpsStatusBadge label={VEHICLE_STATUS_CONFIG[vehicle.status].label} tone={VEHICLE_STATUS_CONFIG[vehicle.status].tone} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="grid gap-3 text-sm sm:grid-cols-2">
          <Field label="Make / model" value={`${vehicle.make} ${vehicle.model}`} />
          <Field label="Year" value={String(vehicle.year)} />
          <Field label="Capacity" value={vehicle.capacityLabel} />
          <Field label="Ownership" value={vehicle.ownership} />
          <Field label="Assigned driver" value={driver?.name ?? "Unassigned"} />
          <Field label="Current assignment" value={vehicle.currentAssignment ?? "None"} />
        </Card>
        <Card className="space-y-3">
          <h2 className="ns-card-title">Maintenance status</h2>
          <Badge tone={vehicle.status === "UNDER_MAINTENANCE" || vehicle.status === "INSPECTION_REQUIRED" ? "warning" : "success"}>
            {vehicle.maintenanceStatus}
          </Badge>
          <Field label="Next inspection" value={vehicle.nextInspection} />
          <Link href={"/fleet/maintenance" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Open maintenance schedule
          </Link>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="ns-card-title">Inspection history</h2>
        {maintenance.length === 0 ? (
          <p className="ns-body">No maintenance fixtures linked to this vehicle.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {maintenance.map((m) => (
              <li key={m.id} className="rounded-input border border-ns-border px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-brand-navy">{m.type}</p>
                  <Badge tone={m.status === "Completed" ? "success" : "warning"}>{m.status}</Badge>
                </div>
                <p className="ns-meta mt-1">
                  {m.date} · next {m.nextDue}
                </p>
                <p className="mt-1 text-slate-600">{m.notes}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-ns-border bg-brand-surface-muted px-3 py-2">
      <p className="ns-meta font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-brand-navy">{value}</p>
    </div>
  );
}
