/* eslint-disable react/no-unescaped-entities */
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { Bell, FileDown, MapPin, MessageSquareWarning } from "lucide-react";
import { apiQuery, titleStatus } from "@/lib/query-api";

type ShipmentDetail = {
  id: string;
  origin: string;
  destination: string;
  service: string;
  status: string;
  eta: string;
  weightKg: number;
  costUsd: number;
  updatedAt: string;
  recipient: string;
};

async function loadShipment(trackingId: string): Promise<ShipmentDetail | null> {
  const rows = await apiQuery<
    Array<{
      trackingNumber: string;
      origin: string;
      destination: string;
      serviceType: string;
      status: string;
      eta: string | null;
      amountCents: number | null;
      weightKg?: number | null;
      recipientName?: string | null;
      updatedAt?: string;
    }>
  >(`/api/shipments?q=${encodeURIComponent(trackingId)}`);
  const s = rows.find((r) => r.trackingNumber === trackingId) ?? rows[0];
  if (!s) return null;
  return {
    id: s.trackingNumber,
    origin: s.origin,
    destination: s.destination,
    service: titleStatus(s.serviceType),
    status: titleStatus(s.status),
    eta: s.eta ? new Date(s.eta).toLocaleDateString() : "—",
    weightKg: s.weightKg ?? 0,
    costUsd: (s.amountCents ?? 0) / 100,
    updatedAt: s.updatedAt ?? new Date().toISOString(),
    recipient: s.recipientName ?? ""
  };
}

export default function ShipmentDetailPage() {
  const params = useParams<{ trackingId: string }>();
  const trackingId = params?.trackingId ?? "";
  const query = useQuery(["shipment-detail", trackingId], () => loadShipment(trackingId), {
    enabled: Boolean(trackingId)
  });

  if (query.isLoading) {
    return (
      <main className="min-h-screen bg-brand-surface p-4 md:p-8">
        <section className="mx-auto max-w-7xl">
          <Card>
            <div className="h-20 animate-pulse rounded-input bg-slate-100" />
          </Card>
        </section>
      </main>
    );
  }

  if (query.isError) {
    return (
      <main className="min-h-screen bg-brand-surface p-4 md:p-8">
        <section className="mx-auto max-w-7xl">
          <Card className="text-sm text-red-700">Unable to load shipment detail. Please refresh and retry.</Card>
        </section>
      </main>
    );
  }

  if (!query.data) {
    return (
      <main className="min-h-screen bg-brand-surface p-4 md:p-8">
        <section className="mx-auto max-w-7xl">
          <Card className="text-sm text-slate-600">Shipment not found for this tracking number.</Card>
        </section>
      </main>
    );
  }

  const shipment = query.data;

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <p className="text-xs text-slate-500">My Shipments / {shipment.id}</p>
        <Card className="flex flex-wrap items-center justify-between gap-3 bg-blue-50">
          <div>
            <p className="text-xs text-slate-500">Current Status</p>
            <h1 className="font-display text-2xl font-bold text-brand-navy">
              {shipment.status} to {shipment.destination}
            </h1>
            <p className="text-sm text-slate-600">Last updated: {shipment.updatedAt}</p>
          </div>
          <Badge>ETA {shipment.eta}</Badge>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="space-y-4">
            <p className="font-semibold text-brand-navy">Live Map</p>
            <div className="flex h-72 items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 text-slate-500">
              <MapPin size={16} className="mr-2" /> Route map with pulsing carrier dot
            </div>
            <p className="font-semibold text-brand-navy">Progress Timeline</p>
            {[
              "Order placed - Los Angeles",
              "Picked up by courier - LAX",
              "In transit - Pacific route",
              "Customs cleared - Tokyo"
            ].map((row) => (
              <div key={row} className="rounded-input border border-slate-200 p-3 text-sm">
                {row}
              </div>
            ))}
          </Card>

          <div className="space-y-4">
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Package Info</p>
              <p className="text-sm text-slate-600">{shipment.weightKg} kg · {shipment.service} · General Cargo</p>
              <p className="text-sm text-slate-600">Booked amount: ${shipment.costUsd.toFixed(2)} · Insurance: Enabled</p>
            </Card>
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Recipient</p>
              <p className="text-sm text-slate-600">{shipment.recipient} · {shipment.destination}</p>
              <p className="text-sm text-slate-600">Delivery instructions: Verify identity before handoff.</p>
            </Card>
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Documents</p>
              <Button className="w-full" variant="secondary">
                <FileDown size={16} /> Download Commercial Invoice
              </Button>
              <Button className="w-full" variant="secondary">
                <FileDown size={16} /> Download Bill of Lading
              </Button>
            </Card>
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Notifications & Support</p>
              <Button className="w-full" variant="ghost">
                <Bell size={16} /> Manage SMS/Email Alerts
              </Button>
              <Button className="w-full">
                <MessageSquareWarning size={16} /> Report an Issue
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
