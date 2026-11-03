"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { useToast } from "@/components/feedback/toast-provider";

type Manifest = {
  id: string;
  number: string;
  carrier: string;
  locationCode: string;
  status: string;
  shipmentCount: number;
  trackingNumbers: string[];
  totalAmountCents: number;
  closedAt: string;
};

export default function ManifestsPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const query = useQuery(["admin-manifests"], () => apiQuery<Manifest[]>("/api/admin/manifests"));
  const [carrier, setCarrier] = useState("");
  const [locationCode, setLocationCode] = useState("LAX-01");

  return (
    <main className="space-y-4 p-4 md:p-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-brand-navy">Manifest / End-of-day</h1>
        <p className="text-sm text-slate-600">Close out today’s labeled shipments into a carrier manifest.</p>
      </header>

      <Card className="flex flex-wrap items-end gap-2">
        <Input placeholder="Carrier filter (optional)" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
        <Input placeholder="Location" value={locationCode} onChange={(e) => setLocationCode(e.target.value)} />
        <Button
          type="button"
          onClick={async () => {
            try {
              const man = await apiQuery<Manifest>("/api/admin/manifests", {
                method: "POST",
                body: JSON.stringify({ carrier: carrier || undefined, locationCode })
              });
              await queryClient.invalidateQueries(["admin-manifests"]);
              pushToast({
                tone: "success",
                title: "Manifest closed",
                message: `${man.number} · ${man.shipmentCount} shipments`
              });
            } catch (err) {
              pushToast({ tone: "error", title: "Closeout failed", message: err instanceof Error ? err.message : "" });
            }
          }}
        >
          Run end-of-day closeout
        </Button>
      </Card>

      <div className="space-y-3">
        {(query.data ?? []).map((m) => (
          <Card key={m.id} className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-brand-navy">{m.number}</p>
                <p className="text-xs text-slate-500">
                  {m.carrier} · {m.locationCode} · {new Date(m.closedAt).toLocaleString()}
                </p>
              </div>
              <Badge tone="success">{m.status}</Badge>
            </div>
            <p className="text-sm text-slate-600">
              {m.shipmentCount} shipments · ${(m.totalAmountCents / 100).toFixed(2)}
            </p>
            <p className="font-mono text-xs text-slate-500">{m.trackingNumbers.slice(0, 8).join(", ")}</p>
          </Card>
        ))}
        {!query.isLoading && !(query.data ?? []).length ? (
          <Card className="text-sm text-slate-500">No manifests yet. Run closeout to create one.</Card>
        ) : null}
      </div>
    </main>
  );
}
