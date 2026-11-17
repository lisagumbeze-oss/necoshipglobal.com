"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { getAdminShipment } from "@/lib/demo/admin-fixtures";

export default function AdminShipmentDetailPage() {
  const params = useParams<{ trackingId: string }>();
  const shipment = getAdminShipment(params.trackingId);

  if (!shipment) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Shipment not found" description="No demonstration shipment matches this reference." />
        <Link href={"/admin/shipments" as never} className="text-sm font-semibold text-brand-navy hover:underline">
          Back to shipments
        </Link>
      </section>
    );
  }

  const timeline = [
    { at: shipment.bookedAt, label: "Booking recorded (demo)" },
    { at: shipment.bookedAt, label: "Accepted into network (demo)" },
    { at: "—", label: `Current status: ${shipment.status} (demo)` }
  ];

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title={shipment.trackingNumber}
        description={`${shipment.reference} · Demonstration shipment oversight`}
        actions={
          <Link href={"/admin/shipments" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Back
          </Link>
        }
      />
      <AdminUiNote>
        Administrator visibility only. Fake administrative actions must not change shipment state. Operational edits remain
        out of scope for Module 5.
      </AdminUiNote>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Shipment summary</h2>
          <p>Customer: {shipment.customer}</p>
          <p>Organization: {shipment.organization ?? "—"}</p>
          <p>
            Lane: {shipment.origin} → {shipment.destination}
          </p>
          <p>Method: {shipment.method}</p>
          <p>Booked: {shipment.bookedAt}</p>
          <p>
            Status: <Badge>{shipment.status}</Badge>
          </p>
          <p>Delivery: {shipment.deliveryStatus}</p>
        </Card>
        <Card className="space-y-3 text-sm">
          <h2 className="font-semibold text-brand-navy">Administrative actions (disabled)</h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled>
              Change status
            </Button>
            <Button type="button" variant="secondary" disabled>
              Force deliver
            </Button>
            <Button type="button" variant="secondary" disabled>
              Cancel shipment
            </Button>
          </div>
          <p className="text-xs text-amber-800">Controls are non-operational during this frontend stage.</p>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Tracking history preview</h2>
        <ul className="space-y-2 text-sm">
          {timeline.map((t, idx) => (
            <li key={idx} className="rounded-md border border-slate-100 px-3 py-2">
              <p className="font-medium text-brand-navy">{t.label}</p>
              <p className="text-xs text-slate-500">{t.at}</p>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
