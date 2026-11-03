"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";
import { useToast } from "@/components/feedback/toast-provider";

type RecipientShipment = {
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  recipientName: string | null;
  deliveryInstructions: string | null;
  eta: string | null;
  events?: Array<{ description: string; occurredAt: string; location?: string | null }>;
  proofOfDelivery?: { signedBy: string | null; notes: string | null; capturedAt: string } | null;
};

export default function RecipientPortalPage({ params }: { params: { token: string } }) {
  const { pushToast } = useToast();
  const [shipment, setShipment] = useState<RecipientShipment | null>(null);
  const [error, setError] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [redirectAddress, setRedirectAddress] = useState("");
  const [preferredWindow, setPreferredWindow] = useState("");
  const [appointmentStart, setAppointmentStart] = useState("");
  const [appointmentEnd, setAppointmentEnd] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const result = await apiFetch<RecipientShipment & { appointments?: unknown[] }>(`/api/recipient/${params.token}`);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setShipment(result.data);
    setInstructions(result.data.deliveryInstructions ?? "");
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token]);

  const patch = async (action: "instructions" | "redeliver" | "hold" | "redirect" | "appointment") => {
    setSaving(true);
    const result = await apiFetch<RecipientShipment | { shipment: RecipientShipment; appointment?: { message?: string } }>(
      `/api/recipient/${params.token}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          action,
          deliveryInstructions: instructions || undefined,
          notes: notes || undefined,
          redirectAddress: redirectAddress || undefined,
          preferredWindow: preferredWindow || undefined,
          appointmentStart: appointmentStart || undefined,
          appointmentEnd: appointmentEnd || undefined
        })
      }
    );
    setSaving(false);
    if (!result.ok) {
      pushToast({ tone: "error", title: "Update failed", message: result.error });
      return;
    }
    if (result.data && "shipment" in result.data && result.data.shipment) {
      setShipment(result.data.shipment);
      pushToast({
        tone: "success",
        title: "Appointment submitted",
        message: result.data.appointment?.message
      });
      return;
    }
    if (result.data && "trackingNumber" in result.data) {
      setShipment(result.data);
    } else {
      await load();
    }
    pushToast({ tone: "success", title: "Delivery preferences updated" });
  };

  if (error) {
    return (
      <PageShell title="Recipient portal" subtitle="Manage delivery for your inbound shipment.">
        <p className="text-sm text-red-700">{error}</p>
      </PageShell>
    );
  }

  if (!shipment) {
    return (
      <PageShell title="Recipient portal" subtitle="Loading shipment…">
        <div className="h-40 animate-pulse rounded-input bg-slate-100" />
      </PageShell>
    );
  }

  return (
    <PageShell title="Recipient portal" subtitle={`Delivery options for ${shipment.trackingNumber}`}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-brand-navy">{shipment.trackingNumber}</p>
            <Badge>{shipment.status}</Badge>
          </div>
          <p className="text-sm text-slate-600">
            {shipment.origin} → {shipment.destination}
          </p>
          <p className="text-sm text-slate-600">Recipient: {shipment.recipientName ?? "—"}</p>
          <p className="text-sm text-slate-600">
            ETA: {shipment.eta ? new Date(shipment.eta).toLocaleString() : "Updating…"}
          </p>
          {shipment.proofOfDelivery ? (
            <div className="rounded-input border border-emerald-200 bg-emerald-50 p-3 text-sm">
              <p className="font-semibold text-emerald-900">Proof of delivery</p>
              <p className="text-emerald-800">Signed by {shipment.proofOfDelivery.signedBy ?? "recipient"}</p>
              {shipment.proofOfDelivery.notes ? (
                <p className="mt-1 text-emerald-800">{shipment.proofOfDelivery.notes}</p>
              ) : null}
              <p className="mt-1 text-xs text-emerald-700">
                {new Date(shipment.proofOfDelivery.capturedAt).toLocaleString()}
              </p>
            </div>
          ) : null}
          <ul className="space-y-2 text-sm">
            {(shipment.events ?? []).slice(-5).map((e, i) => (
              <li key={`${e.occurredAt}-${i}`} className="rounded-input border border-slate-200 px-3 py-2">
                <p className="font-medium text-brand-navy">{e.description}</p>
                <p className="text-xs text-slate-500">
                  {new Date(e.occurredAt).toLocaleString()}
                  {e.location ? ` · ${e.location}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3">
            <p className="font-semibold text-brand-navy">Delivery instructions</p>
            <textarea
              className="min-h-[90px] w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Gate code, leave with receptionist, etc."
            />
            <Button type="button" disabled={saving} onClick={() => void patch("instructions")}>
              Save instructions
            </Button>
          </Card>

          <Card className="space-y-3">
            <p className="font-semibold text-brand-navy">Delivery appointment</p>
            <Input
              type="datetime-local"
              aria-label="Appointment start"
              value={appointmentStart}
              onChange={(e) => setAppointmentStart(e.target.value)}
            />
            <Input
              type="datetime-local"
              aria-label="Appointment end"
              value={appointmentEnd}
              onChange={(e) => setAppointmentEnd(e.target.value)}
            />
            <Button type="button" disabled={saving || !appointmentStart} onClick={() => void patch("appointment")}>
              Schedule carrier appointment
            </Button>
          </Card>

          <Card className="space-y-3">
            <p className="font-semibold text-brand-navy">Redelivery / hold / redirect</p>
            <Input
              placeholder="Preferred window (e.g. Tomorrow 14:00–18:00)"
              value={preferredWindow}
              onChange={(e) => setPreferredWindow(e.target.value)}
            />
            <Input
              placeholder="Redirect address (for redirect only)"
              value={redirectAddress}
              onChange={(e) => setRedirectAddress(e.target.value)}
            />
            <textarea
              className="min-h-[80px] w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
              placeholder="Notes for courier"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" disabled={saving} onClick={() => void patch("redeliver")}>
                Request redelivery
              </Button>
              <Button type="button" variant="secondary" disabled={saving} onClick={() => void patch("hold")}>
                Hold at location
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={saving || redirectAddress.trim().length < 5}
                onClick={() => void patch("redirect")}
              >
                Redirect delivery
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
