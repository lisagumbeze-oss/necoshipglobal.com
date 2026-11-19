"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiFetch } from "@/lib/client-api";
import { demoRecipientPortal } from "@/lib/demo/customer-fixtures";

const DEMO_COLLECTION_POINTS = demoRecipientPortal.collectionPoints;

/**
 * Receiver controls for the public tracking hub.
 * With a real token: PATCH /api/recipient/[token].
 * Without a token on demo shipments: local demo-only preferences (labelled).
 */
export function RecipientActionsPanel({
  token,
  demonstration = false,
  trackingNumber
}: {
  token?: string | null;
  demonstration?: boolean;
  trackingNumber?: string;
}) {
  const [instructions, setInstructions] = useState(demoRecipientPortal.deliveryInstructions);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleWindow, setRescheduleWindow] = useState("09:00–12:00");
  const [collectionPointId, setCollectionPointId] = useState(DEMO_COLLECTION_POINTS[0]?.id ?? "");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [pod, setPod] = useState<{ signedBy?: string; capturedAt?: string; notes?: string } | null>(
    demonstration ? demoRecipientPortal.proofOfDelivery : null
  );
  const [exceptionMessage, setExceptionMessage] = useState<string | null>(
    demonstration ? demoRecipientPortal.exceptionMessage : null
  );

  const canMutate = Boolean(token) || demonstration;

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void (async () => {
      const result = await apiFetch<Record<string, unknown>>(`/api/recipient/${encodeURIComponent(token)}`);
      if (cancelled || !result.ok) return;
      const data = result.data;
      if (typeof data.deliveryInstructions === "string") setInstructions(data.deliveryInstructions);
      const proof = data.proofOfDelivery as { signedBy?: string; capturedAt?: string; notes?: string } | null;
      if (proof) setPod(proof);
      if (typeof data.exceptionMessage === "string") setExceptionMessage(data.exceptionMessage);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function patchRecipient(body: Record<string, unknown>, demoNotice: string) {
    setNotice("");
    if (!token) {
      setNotice(demoNotice);
      return;
    }
    setBusy(true);
    const result = await apiFetch(`/api/recipient/${encodeURIComponent(token)}`, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
    setBusy(false);
    if (!result.ok) {
      setNotice(result.error || "Could not save recipient preference.");
      return;
    }
    setNotice("Preference saved for this shipment.");
  }

  if (!canMutate) {
    return (
      <Card className="space-y-2 text-sm text-slate-600">
        <p className="font-semibold text-brand-navy">Receiver actions</p>
        <p>
          Delivery preferences open when you use a secure recipient link from your booking confirmation. Tracking alone
          stays read-only.
        </p>
      </Card>
    );
  }

  const selectedPoint = DEMO_COLLECTION_POINTS.find((cp) => cp.id === collectionPointId);

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-brand-navy">Receiver dashboard</p>
          {demonstration && !token ? <Badge tone="warning">Demonstration controls</Badge> : null}
          {token ? <Badge tone="success">Secure token</Badge> : null}
        </div>
        <p className="ns-meta">
          {trackingNumber ? `Shipment ${trackingNumber}. ` : null}
          {token
            ? "Changes are sent with your recipient token."
            : "Demonstration preferences stay local — not sent to Production."}
        </p>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Delivery instructions</h2>
        <textarea
          className="focus-ring min-h-[90px] w-full rounded-input border border-slate-300 p-3 text-sm"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          aria-label="Delivery instructions"
        />
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() =>
            void patchRecipient(
              { action: "instructions", deliveryInstructions: instructions },
              "Demonstration preference saved locally — not sent to Production."
            )
          }
        >
          Save instructions
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
          disabled={busy}
          onClick={() => {
            if (!rescheduleDate) {
              setNotice("Choose a reschedule date.");
              return;
            }
            const start = new Date(`${rescheduleDate}T09:00:00`);
            const end = new Date(start.getTime() + 3 * 3600000);
            void patchRecipient(
              {
                action: "appointment",
                appointmentStart: start.toISOString(),
                appointmentEnd: end.toISOString(),
                preferredWindow: rescheduleWindow,
                notes: rescheduleWindow
              },
              "Demonstration reschedule request recorded locally."
            );
          }}
        >
          Request reschedule
        </Button>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Collection point</h2>
        <select
          className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
          value={collectionPointId}
          onChange={(e) => setCollectionPointId(e.target.value)}
          aria-label="Collection point"
        >
          {DEMO_COLLECTION_POINTS.map((cp) => (
            <option key={cp.id} value={cp.id}>
              {cp.name}
            </option>
          ))}
        </select>
        {selectedPoint ? (
          <p className="text-xs text-slate-500">
            {selectedPoint.address} · {selectedPoint.hours}
          </p>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() =>
            void patchRecipient(
              {
                action: "hold",
                notes: selectedPoint ? `${selectedPoint.name} — ${selectedPoint.address}` : "Collection point"
              },
              "Demonstration collection-point preference saved locally."
            )
          }
        >
          Select collection point
        </Button>
      </Card>

      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Delivery exceptions</h2>
        {exceptionMessage ? (
          <p className="rounded-input border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">{exceptionMessage}</p>
        ) : (
          <p className="text-sm text-slate-600">No active delivery exception recorded for this shipment.</p>
        )}
      </Card>

      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Proof of delivery</h2>
        {pod ? (
          <div className="rounded-input border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
            {pod.signedBy ? <p>Signed by {pod.signedBy}</p> : null}
            {pod.capturedAt ? <p>Captured {new Date(pod.capturedAt).toLocaleString()}</p> : null}
            {pod.notes ? <p className="mt-1">{pod.notes}</p> : null}
          </div>
        ) : (
          <p className="text-sm text-slate-600">No proof-of-delivery is available yet.</p>
        )}
      </Card>

      {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
    </div>
  );
}
