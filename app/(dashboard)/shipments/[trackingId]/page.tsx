"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button, Card } from "@/components/design-system/ui";
import { LiveMap } from "@/components/maps";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import { ShipmentTimeline } from "@/components/dashboard/shipment-timeline";
import { DEMO_DATA_NOTICE, getDemoShipment } from "@/lib/demo/customer-fixtures";
import { buildTrackingGeo } from "@/lib/maps/tracking-geo";
import { getShipmentStatus } from "@/lib/demo/shipment-status";
import { MapPin, Package } from "lucide-react";

export default function ShipmentDetailPage({ params }: { params: { trackingId: string } }) {
  const shipment = getDemoShipment(params.trackingId);
  const mapGeo = useMemo(
    () =>
      buildTrackingGeo(
        (shipment?.events ?? []).map((event) => ({
          id: event.id,
          label: event.title,
          description: event.description,
          location: event.location,
          lat: event.lat,
          lng: event.lng
        }))
      ),
    [shipment]
  );
  if (!shipment) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader
          title="Shipment not found"
          description="No demonstration shipment matches this tracking number."
        />
        <Link href={"/shipments" as never}>
          <Button variant="secondary">Back to My Shipments</Button>
        </Link>
      </section>
    );
  }

  const status = getShipmentStatus(shipment.status);
  const milestones = ["BOOKED", "COLLECTED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"] as const;
  const milestoneIndexByStatus: Record<string, number> = {
    PENDING: 0,
    BOOKED: 0,
    COLLECTED: 1,
    PROCESSING: 1,
    IN_TRANSIT: 2,
    CUSTOMS_PROCESSING: 2,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 4,
    EXCEPTION: -1,
    RETURNED: -1
  };
  const activeIndex = milestoneIndexByStatus[shipment.status] ?? 0;

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
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

      <p className="rounded-input border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{DEMO_DATA_NOTICE}</p>

      {/* UI-14 mobile hierarchy: summary → status → actions first */}
      <Card className="space-y-4 border-l-4 border-l-brand-yellow lg:hidden">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="ns-meta uppercase tracking-wide">Current milestone</p>
            <p className="mt-1 font-semibold text-brand-navy">{status.label}</p>
            <p className="ns-meta mt-1">{status.description}</p>
          </div>
          <ShipmentStatusBadge status={shipment.status} />
        </div>
        <p className="text-sm text-brand-navy">
          {shipment.origin} → {shipment.destination}
        </p>
        <div className="flex gap-2">
          <Link href={"/support-tickets" as never} className="flex-1">
            <Button variant="outline" className="w-full">
              Support
            </Button>
          </Link>
          <Link href={"/tracking" as never} className="flex-1">
            <Button className="w-full">Track</Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-slate-600">
                  {shipment.origin} → {shipment.destination}
                </p>
                <p className="ns-meta">Booked {new Date(shipment.bookingDate).toLocaleString()}</p>
              </div>
              <ShipmentStatusBadge status={shipment.status} />
            </div>

            {/* UI-42 route map — coordinates from demo events only when present */}
            <div className="space-y-3 rounded-card border border-ns-border bg-brand-surface-muted p-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="ns-meta mb-1 font-semibold uppercase tracking-wide">Route overview</p>
                  <p className="flex items-center gap-1 text-sm text-brand-navy">
                    <MapPin size={14} aria-hidden />
                    {shipment.origin} → {shipment.destination}
                  </p>
                </div>
                <p className="ns-meta">Reported location: {shipment.currentLocation ?? "Not available"}</p>
              </div>
              <LiveMap
                className="h-64 border-ns-border"
                points={mapGeo.points}
                route={mapGeo.route}
                emptyMessage="No demonstration coordinates on this shipment. Milestone schematic remains below."
              />
              <ol className="flex justify-between gap-1" aria-label="Shipment milestones">
                {milestones.map((m, index) => {
                  const done = activeIndex >= 0 && index <= activeIndex;
                  const current = activeIndex >= 0 && index === activeIndex;
                  return (
                    <li key={m} className="flex flex-1 flex-col items-center gap-1 text-center">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          current ? "bg-brand-yellow ring-2 ring-brand-navy/30" : done ? "bg-brand-navy" : "bg-slate-300"
                        }`}
                        aria-hidden
                      />
                      <span className="text-[10px] font-medium text-slate-500">{m.replaceAll("_", " ")}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="ns-meta">
                Map pins use labelled demonstration coordinates when present — not live carrier GPS telemetry.
              </p>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <Item label="Sender" value={shipment.senderName} />
              <Item label="Recipient" value={`${shipment.recipientName} · ${shipment.recipientEmail}`} />
              <Item label="Shipping method" value={shipment.method} />
              <Item
                label="Estimated delivery"
                value={
                  shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleString() : "Not available"
                }
              />
            </dl>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <Package size={16} aria-hidden className="text-brand-navy" />
              <h2 className="ns-card-title">Package information</h2>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Item label="Description" value={shipment.packageDescription} />
              <Item
                label="Weight / dimensions"
                value={`${shipment.weightKg} kg · ${shipment.lengthCm}×${shipment.widthCm}×${shipment.heightCm} cm`}
              />
              <Item label="Declared value" value={`USD ${shipment.declaredValueUsd.toFixed(2)}`} />
              <Item label="Delivery information" value={shipment.deliveryInfo ?? "Not yet available"} />
            </dl>
            <div
              className={`rounded-input border px-3 py-2 text-sm ${
                shipment.status === "DELIVERED"
                  ? "border-brand-success/30 bg-ns-successSoft text-brand-success"
                  : "border-ns-border bg-brand-surface-muted text-slate-600"
              }`}
            >
              <p className="font-semibold">Proof of delivery</p>
              <p className="mt-1">
                {shipment.status === "DELIVERED"
                  ? shipment.deliveryInfo ?? "Delivered — demonstration proof state."
                  : "Not available until delivery is recorded."}
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="space-y-3">
            <h2 className="ns-card-title">Tracking timeline</h2>
            <p className="ns-meta">Timeline events are synthetic fixtures — not live carrier telemetry.</p>
            <ShipmentTimeline events={shipment.events} />
          </Card>

          <Card className="space-y-3">
            <h2 className="ns-card-title">Supporting documents</h2>
            {shipment.documents.length ? (
              <ul className="space-y-2 text-sm">
                {shipment.documents.map((doc) => (
                  <li key={doc.id} className="rounded-input border border-ns-border px-3 py-2">
                    <p className="font-medium text-brand-navy">{doc.name}</p>
                    <p className="ns-meta">{doc.type} · sample file preview only</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ns-body">No sample documents attached.</p>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-ns-border bg-brand-surface-muted px-3 py-2">
      <dt className="ns-meta font-semibold uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-sm text-brand-navy">{value}</dd>
    </div>
  );
}
