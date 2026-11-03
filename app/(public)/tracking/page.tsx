"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { CheckCircle2, MapPin, Package, Plane, Share2, Truck } from "lucide-react";
import { useQuery } from "react-query";
import { BRAND } from "@/lib/brand";
import { MapboxLivePanel } from "@/components/maps/mapbox-live-panel";
import { TrackingSummaryPDFButton } from "@/components/public/tracking-summary-pdf";
import { apiFetch } from "@/lib/client-api";

const STEPS = ["Order Placed", "Picked Up", "In Transit", "Customs Cleared", "Out for Delivery", "Delivered"] as const;

type TrackingShipment = {
  trackingNumber: string;
  status: string;
  origin?: string;
  destination?: string;
  eta?: string | null;
  recipientToken?: string | null;
  events?: Array<{
    description: string;
    location?: string | null;
    occurredAt: string;
    status?: string | null;
  }>;
};

function statusBadgeTone(status: string): "default" | "success" | "warning" | "danger" {
  const s = status.toUpperCase();
  if (s.includes("DELIVERED")) return "success";
  if (s.includes("EXCEPTION")) return "danger";
  if (s.includes("CUSTOMS")) return "warning";
  return "default";
}

function completedStepIndex(status: string): number {
  const s = status.toUpperCase();
  if (s.includes("DELIVERED")) return 5;
  if (s.includes("OUT_FOR_DELIVERY") || s.includes("OUT FOR")) return 4;
  if (s.includes("CUSTOMS")) return 3;
  if (s.includes("IN_TRANSIT") || s.includes("IN TRANSIT")) return 2;
  if (s.includes("PICKED")) return 1;
  return 0;
}

async function fetchTracking(ids: string[]) {
  const result = await apiFetch<{ count: number; shipments: TrackingShipment[] }>(
    `/api/tracking?ids=${encodeURIComponent(ids.join(","))}`
  );
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const [trackingQuery, setTrackingQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertPhone, setAlertPhone] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    const q = searchParams.get("q") ?? searchParams.get("id");
    if (q) {
      setTrackingQuery(q);
      setSearched(true);
    }
  }, [searchParams]);

  const trackingNumbers = useMemo(
    () =>
      trackingQuery
        .split(/[,\s]+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10),
    [trackingQuery]
  );

  const query = useQuery(["public-tracking", trackingNumbers.join(",")], () => fetchTracking(trackingNumbers), {
    enabled: searched && trackingNumbers.length > 0
  });

  const primary = query.data?.shipments[0];
  const doneIdx = primary ? completedStepIndex(primary.status) : 0;

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-8 md:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="font-display text-4xl font-bold text-brand-navy">Track Your Shipment</h1>
          <p className="text-slate-600">Enter up to 10 tracking numbers separated by spaces or commas.</p>
        </header>

        <Card className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={trackingQuery}
              onChange={(e) => setTrackingQuery(e.target.value)}
              placeholder="NS-2026-0012345, NS-2026-0012346"
              aria-label="Tracking numbers"
            />
            <Button
              type="button"
              onClick={() => {
                setSearched(true);
                void query.refetch();
              }}
            >
              Track Now
            </Button>
          </div>
        </Card>

        {query.isLoading ? <Card>Loading tracking data…</Card> : null}
        {query.isError ? (
          <Card className="text-red-700">{(query.error as Error).message}</Card>
        ) : null}

        {primary ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-lg font-semibold text-brand-navy">{primary.trackingNumber}</p>
                  <p className="text-sm text-slate-600">
                    {primary.origin ?? "Origin"} → {primary.destination ?? "Destination"}
                  </p>
                </div>
                <Badge tone={statusBadgeTone(primary.status)}>{primary.status.replaceAll("_", " ")}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
                {STEPS.map((step, index) => (
                  <div
                    key={step}
                    className={`rounded-input px-2 py-2 text-center text-[11px] ${index <= doneIdx ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    {step}
                  </div>
                ))}
              </div>

              <MapboxLivePanel
                points={[
                  { id: "origin", lat: 34.05, lng: -118.25, label: primary.origin ?? "Origin" },
                  { id: "dest", lat: 50.11, lng: 8.68, label: primary.destination ?? "Destination" }
                ]}
              />

              <div className="space-y-3">
                {(primary.events ?? []).map((event) => (
                  <div key={`${event.occurredAt}-${event.description}`} className="flex gap-3 text-sm">
                    <Package size={16} className="mt-1 text-brand-blue" />
                    <div>
                      <p className="font-medium text-brand-navy">{event.description}</p>
                      <p className="text-slate-500">
                        {event.location ?? "—"} · {new Date(event.occurredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(primary.events ?? []).length === 0 ? (
                  <p className="text-sm text-slate-500">No checkpoint events yet.</p>
                ) : null}
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="space-y-3">
                <p className="font-semibold text-brand-navy">Estimated delivery</p>
                <p className="text-sm text-slate-600">
                  {primary.eta ? new Date(primary.eta).toLocaleString() : "Calculating…"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      void navigator.clipboard.writeText(
                        `${window.location.origin}/tracking?id=${primary.trackingNumber}`
                      )
                    }
                  >
                    <Share2 size={16} /> Share link
                  </Button>
                  <TrackingSummaryPDFButton
                    shipment={{
                      id: primary.trackingNumber,
                      origin: primary.origin ?? "—",
                      destination: primary.destination ?? "—",
                      service: "—",
                      status: primary.status.replaceAll("_", " ") as never,
                      eta: primary.eta ? new Date(primary.eta).toLocaleString() : "—",
                      weightKg: 0,
                      costUsd: 0,
                      updatedAt: new Date().toISOString(),
                      recipient: ""
                    }}
                  />
                </div>
                {primary.recipientToken ? (
                  <Link href={`/recipient/${primary.recipientToken}` as never} className="text-sm text-brand-blue underline">
                    Open recipient portal
                  </Link>
                ) : null}
              </Card>

              <Card className="space-y-3">
                <p className="font-semibold text-brand-navy">SMS / Email alerts</p>
                <Input placeholder="Email" value={alertEmail} onChange={(e) => setAlertEmail(e.target.value)} />
                <Input placeholder="Phone" value={alertPhone} onChange={(e) => setAlertPhone(e.target.value)} />
                <Button
                  type="button"
                  onClick={async () => {
                    const res = await apiFetch("/api/alerts/subscribe", {
                      method: "POST",
                      body: JSON.stringify({
                        trackingNumber: primary.trackingNumber,
                        email: alertEmail || undefined,
                        phone: alertPhone || undefined
                      })
                    });
                    setAlertMsg(res.ok ? "Alert preferences saved." : res.error);
                  }}
                >
                  Subscribe
                </Button>
                {alertMsg ? <p className="text-sm text-slate-600">{alertMsg}</p> : null}
                <p className="text-xs text-slate-500">
                  Prefer an account? <Link href={"/register" as never}>Sign up</Link> to manage all shipment alerts.
                </p>
              </Card>

              {(query.data?.shipments.length ?? 0) > 1 ? (
                <Card className="space-y-2">
                  <p className="font-semibold text-brand-navy">Bulk results</p>
                  {query.data!.shipments.map((s) => (
                    <div key={s.trackingNumber} className="flex items-center justify-between text-sm">
                      <span className="font-mono">{s.trackingNumber}</span>
                      <Badge tone={statusBadgeTone(s.status)}>{s.status.replaceAll("_", " ")}</Badge>
                    </div>
                  ))}
                </Card>
              ) : null}
            </div>
          </div>
        ) : searched && !query.isLoading ? (
          <Card className="flex items-start gap-3 text-sm text-slate-600">
            <MapPin size={18} />
            No shipments found for that query. Book a shipment or check the tracking number.
          </Card>
        ) : null}

        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Truck size={14} /> Ground
          </span>
          <span className="inline-flex items-center gap-1">
            <Plane size={14} /> Air
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 size={14} /> Delivered
          </span>
        </div>
      </section>
    </main>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<main className="p-8">Loading tracking…</main>}>
      <TrackingContent />
    </Suspense>
  );
}
