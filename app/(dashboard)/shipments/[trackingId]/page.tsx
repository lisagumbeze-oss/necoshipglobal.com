"use client";

import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import { ShipmentTimeline } from "@/components/dashboard/shipment-timeline";
import { getDemoShipment } from "@/lib/demo/customer-fixtures";

export default function ShipmentDetailPage({ params }: { params: { trackingId: string } }) {
  const shipment = getDemoShipment(params.trackingId);
  if (!shipment) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Shipment not found" description="No demonstration shipment matches this tracking number." />
        <Link href={"/shipments" as never}>
          <Button variant="secondary">Back to My Shipments</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title={shipment.trackingNumber}
        description={`Reference ${shipment.reference} · demonstration shipment detail`}
        actions={
          <>
            <Link href={"/tracking" as never}>
              <Button variant="secondary">Public tracking</Button>
            </Link>
            <Link href={"/shipments" as never}>
              <Button variant="ghost">Back</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-slate-600">
                {shipment.origin} → {shipment.destination}
              </p>
              <p className="text-xs text-slate-500">Booked {new Date(shipment.bookingDate).toLocaleString()}</p>
            </div>
            <ShipmentStatusBadge status={shipment.status} />
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <Item label="Sender" value={shipment.senderName} />
            <Item label="Recipient" value={`${shipment.recipientName} · ${shipment.recipientEmail}`} />
            <Item label="Shipping method" value={shipment.method} />
            <Item
              label="Estimated delivery"
              value={shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleString() : "Not available"}
            />
            <Item label="Package" value={shipment.packageDescription} />
            <Item
              label="Weight / dimensions"
              value={`${shipment.weightKg} kg · ${shipment.lengthCm}×${shipment.widthCm}×${shipment.heightCm} cm`}
            />
            <Item label="Declared value" value={`USD ${shipment.declaredValueUsd.toFixed(2)}`} />
            <Item label="Current location" value={shipment.currentLocation ?? "Not available"} />
          </dl>

          {shipment.deliveryInfo ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              {shipment.deliveryInfo}
            </div>
          ) : null}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Supporting documents</h2>
          {shipment.documents.length ? (
            <ul className="space-y-2 text-sm">
              {shipment.documents.map((doc) => (
                <li key={doc.id} className="rounded-xl border border-slate-200 px-3 py-2">
                  <p className="font-medium text-brand-navy">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.type} · sample file preview only</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No sample documents attached.</p>
          )}
          <p className="text-xs text-slate-500">Document download is demonstration-only and does not retrieve Production files.</p>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Shipment tracking timeline</h2>
        <p className="text-xs text-slate-500">Timeline events are synthetic fixtures — not live carrier telemetry.</p>
        <ShipmentTimeline events={shipment.events} />
      </Card>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-brand-navy">{value}</dd>
    </div>
  );
}
