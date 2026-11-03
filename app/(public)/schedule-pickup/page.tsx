"use client";

import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";
import { useToast } from "@/components/feedback/toast-provider";

export default function SchedulePickupPage() {
  const { pushToast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!address || !windowStart || !windowEnd || !contactName) {
      pushToast({ tone: "error", title: "Missing fields", message: "Address, contact, and window are required." });
      return;
    }
    setLoading(true);

    const pickupId = `pickup_${trackingNumber || Date.now()}`;

    if (email || phone) {
      await apiFetch("/api/alerts/subscribe", {
        method: "POST",
        body: JSON.stringify({
          trackingNumber: trackingNumber || pickupId,
          email: email || undefined,
          phone: phone || undefined
        })
      });
    }

    setLoading(false);
    setConfirmation(pickupId);
    pushToast({
      tone: "success",
      title: "Pickup requested",
      message: `${pickupId} · SCHEDULED`
    });
  };

  return (
    <PageShell
      title="Schedule a pickup"
      subtitle="Book a courier window for package collection from your address."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Input
            placeholder="Tracking number (optional if label already booked)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Input placeholder="Pickup address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input placeholder="Contact name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="datetime-local"
            aria-label="Window start"
            value={windowStart}
            onChange={(e) => setWindowStart(e.target.value)}
          />
          <Input
            type="datetime-local"
            aria-label="Window end"
            value={windowEnd}
            onChange={(e) => setWindowEnd(e.target.value)}
          />
          <textarea
            className="min-h-[90px] w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
            placeholder="Access notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button type="button" disabled={loading} onClick={() => void submit()}>
            {loading ? "Scheduling…" : "Schedule pickup"}
          </Button>
        </div>

        <Card className="space-y-3">
          <p className="font-semibold text-brand-navy">Confirmation</p>
          {confirmation ? (
            <>
              <Badge tone="success">Scheduled</Badge>
              <p className="font-mono text-sm">{confirmation}</p>
              <p className="text-sm text-slate-600">
                {contactName} · {address}
              </p>
              <p className="text-xs text-slate-500">
                Window {windowStart ? new Date(windowStart).toLocaleString() : "—"} –{" "}
                {windowEnd ? new Date(windowEnd).toLocaleString() : "—"}
              </p>
              {notes ? <p className="text-sm text-slate-600">{notes}</p> : null}
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Same-day windows close at 14:00 local hub time. International commercial pickups may require a booked
              shipment label.
            </p>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
