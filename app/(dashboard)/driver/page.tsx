"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";
import { useToast } from "@/components/feedback/toast-provider";

const SEED_PICKUPS = [
  {
    id: "pkp_seed_1",
    trackingNumber: "NSGUS100000001",
    status: "SCHEDULED",
    address: "1200 Flower St, Los Angeles, CA",
    scheduledStart: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    scheduledEnd: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString()
  },
  {
    id: "pkp_seed_2",
    trackingNumber: "NSGUS100000002",
    status: "IN_PROGRESS",
    address: "88 Market St, San Francisco, CA",
    scheduledStart: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    scheduledEnd: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString()
  }
];

export default function DriverPage() {
  const { pushToast } = useToast();
  const pickups = useMemo(() => SEED_PICKUPS, []);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [signedBy, setSignedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const markPod = async () => {
    setSubmitting(true);
    const result = await apiFetch("/api/pod", {
      method: "POST",
      body: JSON.stringify({
        trackingNumber,
        signedBy: signedBy || undefined,
        notes: notes || undefined
      })
    });
    setSubmitting(false);
    if (!result.ok) {
      pushToast({ tone: "error", title: "POD failed", message: result.error });
      return;
    }
    pushToast({ tone: "success", title: "POD captured", message: trackingNumber });
    setNotes("");
    setSignedBy("");
  };

  return (
    <PageShell
      title="Driver"
      subtitle="Mobile-friendly stop list: assigned pickups and proof-of-delivery capture."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-brand-navy">Assigned pickups</p>
          {pickups.map((p) => (
            <Card key={p.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono font-semibold text-brand-navy">{p.trackingNumber}</p>
                <Badge>{p.status}</Badge>
              </div>
              <p className="text-sm text-slate-600">{p.address}</p>
              <p className="text-xs text-slate-500">
                {new Date(p.scheduledStart).toLocaleString()} – {new Date(p.scheduledEnd).toLocaleTimeString()}
              </p>
              <Button type="button" variant="secondary" onClick={() => setTrackingNumber(p.trackingNumber)}>
                Use for POD
              </Button>
            </Card>
          ))}
        </div>

        <Card className="space-y-3">
          <p className="font-semibold text-brand-navy">Mark proof of delivery</p>
          <Input
            placeholder="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Input placeholder="Signed by" value={signedBy} onChange={(e) => setSignedBy(e.target.value)} />
          <textarea
            className="min-h-[100px] w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-sm focus-ring"
            placeholder="Delivery notes / location description"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            type="button"
            disabled={submitting || trackingNumber.length < 3}
            onClick={() => void markPod()}
          >
            {submitting ? "Saving…" : "Capture POD"}
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}
