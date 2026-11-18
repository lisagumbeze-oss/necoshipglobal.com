"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge, Button, Card, Input, ButtonLink } from "@/components/design-system/ui";
import { AlertCircle, Loader2, MapPin, Package, Search } from "lucide-react";
import { useQuery } from "react-query";
import { BRAND } from "@/lib/brand";
import { apiFetch } from "@/lib/client-api";

type TrackingShipment = {
  trackingNumber: string;
  status: string;
  origin?: string;
  destination?: string;
  createdAt?: string | null;
  eta?: string | null;
  currentLocation?: string | null;
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

function isValidTrackingFormat(value: string) {
  const cleaned = value.trim();
  if (cleaned.length < 6 || cleaned.length > 40) return false;
  return /^[A-Za-z0-9][A-Za-z0-9\-_/]*$/.test(cleaned);
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
  const [formatError, setFormatError] = useState("");

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

  const invalidNumbers = trackingNumbers.filter((id) => !isValidTrackingFormat(id));
  const queryEnabled = searched && trackingNumbers.length > 0 && invalidNumbers.length === 0;

  const query = useQuery(["public-tracking", trackingNumbers.join(",")], () => fetchTracking(trackingNumbers), {
    enabled: queryEnabled,
    retry: 1
  });

  const primary = query.data?.shipments[0];

  const onTrack = () => {
    setFormatError("");
    if (!trackingQuery.trim()) {
      setFormatError("Enter at least one tracking number.");
      setSearched(false);
      return;
    }
    const ids = trackingQuery
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const bad = ids.filter((id) => !isValidTrackingFormat(id));
    if (bad.length) {
      setFormatError(`Invalid tracking number format: ${bad.join(", ")}`);
      setSearched(true);
      return;
    }
    setSearched(true);
    void query.refetch();
  };

  return (
    <main className="bg-brand-surface">
      <section className="ns-container max-w-ns-xl space-y-6 py-10 md:py-14">
        <header className="mx-auto max-w-2xl space-y-2 text-center">
          <p className="ns-meta font-semibold uppercase tracking-[0.16em] text-brand-navy">Tracking</p>
          <h1 className="ns-page-title">Track Your Shipment</h1>
          <p className="ns-body text-base">
            Look up booking status, locations and timeline events when shipment records are available in {BRAND.name}.
          </p>
        </header>

        <Card className="mx-auto max-w-3xl space-y-3 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <Input
                className="pl-9"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                placeholder="Enter tracking number"
                aria-label="Tracking numbers"
                onKeyDown={(e) => e.key === "Enter" && onTrack()}
              />
            </div>
            <Button type="button" onClick={onTrack}>
              Track Now
            </Button>
          </div>
          <p className="text-xs text-slate-500">You can enter up to 10 numbers separated by spaces or commas.</p>
          {formatError ? <p className="text-sm text-red-700">{formatError}</p> : null}
        </Card>

        {!searched ? (
          <Card className="mx-auto max-w-3xl text-center text-sm text-slate-600">
            Enter a tracking number to begin. No fabricated live tracking events are generated on this page.
          </Card>
        ) : null}

        {searched && invalidNumbers.length > 0 ? (
          <Card className="mx-auto flex max-w-3xl items-start gap-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Invalid tracking number</p>
              <p className="mt-1">Check the format and try again. Example pattern: letters, numbers and hyphens.</p>
            </div>
          </Card>
        ) : null}

        {queryEnabled && query.isLoading ? (
          <Card className="mx-auto flex max-w-3xl items-center gap-3 text-sm text-slate-600">
            <Loader2 className="animate-spin" size={18} aria-hidden />
            Loading tracking data…
          </Card>
        ) : null}

        {queryEnabled && query.isError ? (
          <Card className="mx-auto max-w-3xl space-y-2 text-sm">
            <p className="font-semibold text-brand-navy">Tracking temporarily unavailable</p>
            <p className="text-slate-600">
              {(query.error as Error).message ||
                "We could not retrieve tracking information right now. Please try again shortly or contact support."}
            </p>
            <Link href="/support" className="inline-block font-semibold text-brand-navy hover:underline">
              Contact customer support
            </Link>
          </Card>
        ) : null}

        {primary ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-lg font-semibold text-brand-navy">{primary.trackingNumber}</p>
                  <p className="text-sm text-slate-600">
                    {primary.origin ?? "Origin unavailable"} → {primary.destination ?? "Destination unavailable"}
                  </p>
                </div>
                <Badge tone={statusBadgeTone(primary.status)}>{primary.status.replaceAll("_", " ")}</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Info label="Booking date" value={primary.createdAt ? new Date(primary.createdAt).toLocaleString() : "Not available"} />
                <Info
                  label="Estimated delivery"
                  value={primary.eta ? new Date(primary.eta).toLocaleString() : "Not available"}
                />
                <Info
                  label="Current location"
                  value={primary.currentLocation || primary.events?.[0]?.location || "Not available"}
                />
                <Info label="Shipment status" value={primary.status.replaceAll("_", " ")} />
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-brand-navy">Shipment event timeline</p>
                {(primary.events ?? []).length > 0 ? (
                  (primary.events ?? []).map((event) => (
                    <div key={`${event.occurredAt}-${event.description}`} className="flex gap-3 text-sm">
                      <Package size={16} className="mt-1 text-brand-yellow" aria-hidden />
                      <div>
                        <p className="font-medium text-brand-navy">{event.description}</p>
                        <p className="text-slate-500">
                          {event.location ?? "Location not recorded"} · {new Date(event.occurredAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No checkpoint events have been recorded for this shipment yet.</p>
                )}
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="space-y-3 text-sm text-slate-600">
                <p className="font-semibold text-brand-navy">Need help?</p>
                <p>If status looks incomplete, contact support with your tracking number.</p>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink href="/support" variant="secondary">Customer support</ButtonLink>
                  <ButtonLink href="/quote">Get a Quote</ButtonLink>
                </div>
                {primary.recipientToken ? (
                  <Link href={`/recipient/${primary.recipientToken}` as never} className="block text-brand-navy underline">
                    Open recipient portal
                  </Link>
                ) : null}
              </Card>
            </div>
          </div>
        ) : null}

        {searched && queryEnabled && !query.isLoading && !query.isError && !primary ? (
          <Card className="mx-auto flex max-w-3xl items-start gap-3 text-sm text-slate-600">
            <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold text-brand-navy">No shipment found</p>
              <p className="mt-1">
                We could not find a matching tracking number. Confirm the number with your booking confirmation or
                contact support.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink href="/support" variant="secondary">Customer support</ButtonLink>
                <ButtonLink href="/quote">Request a quotation</ButtonLink>
              </div>
            </div>
          </Card>
        ) : null}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-brand-navy">{value}</p>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-brand-surface p-8 text-sm text-slate-600">
          <Loader2 className="mr-2 animate-spin" size={18} aria-hidden />
          Loading tracking…
        </main>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
