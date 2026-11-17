import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import {
  demoDeliveryAttempts,
  demoDrivers,
  demoPodPreviews,
  demoVehicles,
  getDelivery
} from "@/lib/demo/operations-fixtures";
import { DELIVERY_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function DeliveryDetailPage({ params }: { params: { deliveryId: string } }) {
  const delivery = getDelivery(params.deliveryId);
  if (!delivery) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Delivery not found" description="No demonstration delivery matches." />
        <Link href={"/deliveries" as never}>
          <Button variant="secondary">Back</Button>
        </Link>
      </section>
    );
  }

  const driver = demoDrivers.find((d) => d.id === delivery.driverId);
  const vehicle = demoVehicles.find((v) => v.id === delivery.vehicleId);
  const attempts = demoDeliveryAttempts.filter((a) => a.deliveryId === delivery.id);
  const pod = demoPodPreviews.find((p) => p.deliveryId === delivery.id);

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <DashboardPageHeader
        title={delivery.reference}
        description={`${delivery.trackingNumber} · demonstration delivery detail`}
        actions={
          <Link href={"/deliveries" as never}>
            <Button variant="secondary">All deliveries</Button>
          </Link>
        }
      />
      <Card className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">{delivery.recipientLabel}</p>
        <OpsStatusBadge
          label={DELIVERY_STATUS_CONFIG[delivery.status].label}
          tone={DELIVERY_STATUS_CONFIG[delivery.status].tone}
        />
      </Card>
      <Card className="grid gap-3 text-sm sm:grid-cols-2">
        <Field label="Address" value={delivery.address} />
        <Field label="Scheduled" value={delivery.scheduledDate} />
        <Field label="Driver" value={driver?.name ?? "Unassigned"} />
        <Field label="Vehicle" value={vehicle?.reference ?? "Unassigned"} />
        <Field label="Instructions" value={delivery.instructions} />
      </Card>
      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Attempt history</h2>
        {attempts.length === 0 ? (
          <p className="text-sm text-slate-500">No attempts recorded in this demonstration case.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {attempts.map((a) => (
              <li key={a.id} className="rounded-xl border border-slate-200 px-3 py-2">
                <p className="font-medium text-brand-navy">{a.outcome}</p>
                <p className="text-slate-600">
                  {new Date(a.at).toLocaleString()} · {a.driverName}
                </p>
                {a.reason ? <p className="text-slate-600">{a.reason}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Proof of delivery</h2>
        {!pod || !pod.available ? (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p>{pod?.signatureNote ?? "No authorized proof-of-delivery preview is available."}</p>
            <p className="mt-1 text-xs text-amber-800">No fabricated signatures or photos are generated.</p>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">Captured {pod.timestamp ? new Date(pod.timestamp).toLocaleString() : "—"}</p>
            <p className="text-slate-600">Recipient confirmation: {pod.recipientConfirmation}</p>
            <p className="text-slate-600">Driver: {pod.driverName}</p>
            <p className="text-amber-900">{pod.signatureNote}</p>
            <p className="text-amber-900">{pod.photoNote}</p>
            <p className="text-xs text-slate-500">{pod.locationNote}</p>
          </div>
        )}
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
