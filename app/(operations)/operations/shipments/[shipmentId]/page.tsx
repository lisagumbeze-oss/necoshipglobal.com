import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoOpsEvents, getOpsShipment } from "@/lib/demo/operations-fixtures";
import { OPS_SHIPMENT_PHASE_CONFIG } from "@/lib/demo/operations-status";

export default function OperationsShipmentDetailPage({ params }: { params: { shipmentId: string } }) {
  const shipment = getOpsShipment(params.shipmentId);
  if (!shipment) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Shipment not found" description="No demonstration operational shipment matches." />
        <Link href={"/operations/shipments" as never}>
          <Button variant="secondary">Back</Button>
        </Link>
      </section>
    );
  }

  const events = demoOpsEvents.filter((e) => e.trackingNumber === shipment.trackingNumber);

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title={shipment.trackingNumber}
        description={`Reference ${shipment.reference} · demonstration operational detail`}
        actions={
          <Link href={"/operations/shipments" as never}>
            <Button variant="secondary">All shipments</Button>
          </Link>
        }
      />
      <Card className="grid gap-3 sm:grid-cols-2 text-sm">
        <Field label="Phase" value={<OpsStatusBadge label={OPS_SHIPMENT_PHASE_CONFIG[shipment.phase].label} tone={OPS_SHIPMENT_PHASE_CONFIG[shipment.phase].tone} />} />
        <Field label="Packages" value={String(shipment.packageCount)} />
        <Field label="Origin" value={shipment.origin} />
        <Field label="Destination" value={shipment.destination} />
        <Field label="Method" value={shipment.method} />
        <Field label="Warehouse" value={shipment.warehouseCode ?? "Not at facility"} />
      </Card>
      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Custody / event timeline</h2>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">No demonstration events recorded for this shipment yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {events.map((e) => (
              <li key={e.id} className="rounded-xl border border-slate-200 px-3 py-2">
                <p className="font-medium text-brand-navy">{e.category}</p>
                <p className="text-xs text-slate-500">
                  {new Date(e.at).toLocaleString()} · {e.location} · {e.user}
                </p>
                <p className="text-slate-600">{e.notes}</p>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-amber-800">Events are synthetic UI samples — not live scan or GPS feeds.</p>
      </Card>
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1 text-brand-navy">{value}</div>
    </div>
  );
}
