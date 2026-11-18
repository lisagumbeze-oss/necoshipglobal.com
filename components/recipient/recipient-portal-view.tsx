"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DemoDataBanner } from "@/components/dashboard/demo-banner";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import { ShipmentTimeline } from "@/components/dashboard/shipment-timeline";
import type { DemoRecipientPortal } from "@/lib/demo/customer-fixtures";

export function RecipientPortalView({ data }: { data: DemoRecipientPortal }) {
  const [instructions, setInstructions] = useState(data.deliveryInstructions);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleWindow, setRescheduleWindow] = useState("09:00–12:00");
  const [collectionPointId, setCollectionPointId] = useState(data.collectionPoints[0]?.id ?? "");
  const [notice, setNotice] = useState("");

  return (
    <main className="bg-brand-surface">
      <div className="ns-container max-w-ns-lg space-y-5 py-8">
        <DemoDataBanner />
        <header className="space-y-2">
          <p className="ns-meta font-semibold uppercase tracking-[0.16em] text-brand-navy">Recipient portal</p>
          <h1 className="ns-page-title">Shipment for {data.recipientName}</h1>
          <p className="ns-body">{data.tokenHint}</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-lg font-semibold text-brand-navy">{data.trackingNumber}</p>
                <p className="text-sm text-slate-600">
                  {data.origin} → {data.destination}
                </p>
              </div>
              <ShipmentStatusBadge status={data.status} />
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Info label="Reference" value={data.reference} />
              <Info
                label="Estimated delivery"
                value={data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleString() : "Not available"}
              />
            </dl>
            <div>
              <h2 className="mb-2 font-semibold text-brand-navy">Tracking timeline</h2>
              <ShipmentTimeline events={data.events} />
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="space-y-3">
              <h2 className="font-semibold text-brand-navy">Delivery instructions</h2>
              <textarea
                className="focus-ring min-h-[90px] w-full rounded-input border border-slate-300 p-3 text-sm"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setNotice("Demonstration preference saved locally — not sent to Production.")}
              >
                Save instructions (demo)
              </Button>
            </Card>

            <Card className="space-y-3">
              <h2 className="font-semibold text-brand-navy">Reschedule delivery</h2>
              <Input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} aria-label="Reschedule date" />
              <Input
                value={rescheduleWindow}
                onChange={(e) => setRescheduleWindow(e.target.value)}
                aria-label="Preferred window"
                placeholder="Preferred time window"
              />
              <Button
                type="button"
                onClick={() => {
                  if (!rescheduleDate) {
                    setNotice("Choose a reschedule date.");
                    return;
                  }
                  setNotice("Demonstration reschedule request recorded locally.");
                }}
              >
                Request reschedule (demo)
              </Button>
            </Card>

            <Card className="space-y-3">
              <h2 className="font-semibold text-brand-navy">Collection point</h2>
              <select
                className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
                value={collectionPointId}
                onChange={(e) => setCollectionPointId(e.target.value)}
              >
                {data.collectionPoints.map((cp) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.name}
                  </option>
                ))}
              </select>
              {data.collectionPoints
                .filter((cp) => cp.id === collectionPointId)
                .map((cp) => (
                  <p key={cp.id} className="text-xs text-slate-500">
                    {cp.address} · {cp.hours}
                  </p>
                ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => setNotice("Demonstration collection-point preference saved locally.")}
              >
                Select collection point (demo)
              </Button>
            </Card>
          </div>
        </div>

        <Card className="space-y-2">
          <h2 className="font-semibold text-brand-navy">Delivery exceptions</h2>
          {data.exceptionMessage ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              {data.exceptionMessage}
            </p>
          ) : (
            <p className="text-sm text-slate-600">No active delivery exception on this demonstration shipment.</p>
          )}
        </Card>

        <Card className="space-y-2">
          <h2 className="font-semibold text-brand-navy">Proof of delivery</h2>
          {data.proofOfDelivery ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
              <p>Signed by {data.proofOfDelivery.signedBy}</p>
              <p>Captured {new Date(data.proofOfDelivery.capturedAt).toLocaleString()}</p>
              <p className="mt-1">{data.proofOfDelivery.notes}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No authorized proof-of-delivery preview is available.</p>
          )}
          <p className="text-xs text-slate-500">
            Privacy: recipient identity and POD are shown only in this token-ready demonstration surface.
          </p>
        </Card>

        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-brand-navy">{value}</dd>
    </div>
  );
}
