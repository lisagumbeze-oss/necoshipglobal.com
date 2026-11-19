import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDeliveries, demoDrivers, demoVehicles, type DemoDelivery } from "@/lib/demo/operations-fixtures";
import { DELIVERY_STATUS_CONFIG, type DeliveryStatus } from "@/lib/demo/operations-status";

export function DeliveryList({ statuses, title, description }: { statuses: DeliveryStatus[]; title: string; description: string }) {
  const rows = demoDeliveries.filter((d) => statuses.includes(d.status));
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-brand-navy md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </header>
      {rows.length === 0 ? (
        <Card className="text-sm text-slate-600">No demonstration deliveries in this state.</Card>
      ) : (
        <div className="grid gap-3">
          {rows.map((d) => (
            <DeliveryRow key={d.id} delivery={d} />
          ))}
        </div>
      )}
    </section>
  );
}

function DeliveryRow({ delivery: d }: { delivery: DemoDelivery }) {
  const driver = demoDrivers.find((x) => x.id === d.driverId);
  const vehicle = demoVehicles.find((x) => x.id === d.vehicleId);
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <div>
        <Link href={`/admin/deliveries/${d.id}` as never} className="font-mono font-semibold text-brand-navy hover:underline">
          {d.reference}
        </Link>
        <p className="text-slate-600">
          {d.trackingNumber} · {d.address}
        </p>
        <p className="text-xs text-slate-500">
          {driver?.name ?? "Unassigned"} · {vehicle?.reference ?? "No vehicle"} · {d.scheduledDate}
        </p>
      </div>
      <OpsStatusBadge label={DELIVERY_STATUS_CONFIG[d.status].label} tone={DELIVERY_STATUS_CONFIG[d.status].tone} />
    </Card>
  );
}
