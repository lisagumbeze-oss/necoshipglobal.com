import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDrivers, demoMaintenance, getVehicle } from "@/lib/demo/operations-fixtures";
import { VEHICLE_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function VehicleDetailPage({ params }: { params: { vehicleId: string } }) {
  const vehicle = getVehicle(params.vehicleId);
  if (!vehicle) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
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
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title={vehicle.reference}
        description={`${vehicle.make} ${vehicle.model} · demonstration fleet asset`}
        actions={
          <Link href={"/fleet/vehicles" as never}>
            <Button variant="secondary">Directory</Button>
          </Link>
        }
      />
      <Card className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-sm text-slate-600">{vehicle.registration}</p>
        <OpsStatusBadge label={VEHICLE_STATUS_CONFIG[vehicle.status].label} tone={VEHICLE_STATUS_CONFIG[vehicle.status].tone} />
      </Card>
      <Card className="grid gap-3 text-sm sm:grid-cols-2">
        <Field label="Category" value={vehicle.category} />
        <Field label="Year" value={String(vehicle.year)} />
        <Field label="Capacity" value={vehicle.capacityLabel} />
        <Field label="Ownership" value={vehicle.ownership} />
        <Field label="Assigned driver" value={driver?.name ?? "Unassigned"} />
        <Field label="Current assignment" value={vehicle.currentAssignment ?? "None"} />
        <Field label="Maintenance status" value={vehicle.maintenanceStatus} />
        <Field label="Next inspection" value={vehicle.nextInspection} />
      </Card>
      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Documentation / inspection (demo)</h2>
        <p className="text-sm text-slate-600">Registration and inspection documents are placeholders in this module.</p>
        <ul className="space-y-2 text-sm">
          {maintenance.map((m) => (
            <li key={m.id} className="rounded-xl border border-slate-200 px-3 py-2">
              <p className="font-medium text-brand-navy">
                {m.type} · {m.status}
              </p>
              <p className="text-slate-600">
                {m.date} · next {m.nextDue} · {m.notes}
              </p>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="text-xs text-amber-800">
        Assignment and activity history are demonstration-only. No live GPS or real dispatch actions.
      </Card>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-brand-navy">{value}</p>
    </div>
  );
}
