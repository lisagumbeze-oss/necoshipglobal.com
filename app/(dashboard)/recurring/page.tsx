"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { useToast } from "@/components/feedback/toast-provider";
import { CalendarClock, Play, Plus, Trash2 } from "lucide-react";

type RecurringRow = {
  id: string;
  name: string;
  cadence: string;
  active: boolean;
  nextRunAt: string;
  lastRunAt: string | null;
  lastTrackingNumber: string | null;
  template: {
    origin: string;
    destination: string;
    recipientName: string;
    weightKg: number;
    amountCents: number;
    serviceType?: string;
  };
};

export default function RecurringShipmentsPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const query = useQuery(["recurring"], () => apiQuery<RecurringRow[]>("/api/recurring"));
  const [name, setName] = useState("Weekly LA → FRA restock");
  const [cadence, setCadence] = useState<"weekly" | "biweekly" | "monthly">("weekly");
  const [origin, setOrigin] = useState("Los Angeles, USA");
  const [destination, setDestination] = useState("Frankfurt, Germany");
  const [recipientName, setRecipientName] = useState("Warehouse Desk");
  const [weightKg, setWeightKg] = useState("12");
  const [amount, setAmount] = useState("146");
  const [busy, setBusy] = useState(false);

  const create = async () => {
    setBusy(true);
    try {
      await apiQuery("/api/recurring", {
        method: "POST",
        body: JSON.stringify({
          name,
          cadence,
          template: {
            origin,
            destination,
            recipientName,
            weightKg: Number(weightKg),
            amountCents: Math.round(Number(amount) * 100),
            serviceType: "EXPRESS_AIR",
            carrier: "NecoShip"
          }
        })
      });
      await queryClient.invalidateQueries(["recurring"]);
      pushToast({ tone: "success", title: "Recurring schedule created" });
    } catch (err) {
      pushToast({ tone: "error", title: "Create failed", message: err instanceof Error ? err.message : "Try again" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="space-y-4">
      <header>
        <h1 className="font-display text-3xl font-bold text-brand-navy">Recurring Shipments</h1>
        <p className="text-sm text-slate-600">Schedule automatic label purchases on a weekly, biweekly, or monthly cadence.</p>
      </header>

      <Card className="space-y-3">
        <p className="font-semibold text-brand-navy">New schedule</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Schedule name" />
          <select
            className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm"
            value={cadence}
            onChange={(e) => setCadence(e.target.value as never)}
            aria-label="Cadence"
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />
          <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
          <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient" />
          <Input value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="Weight kg" type="number" />
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount USD" type="number" />
        </div>
        <Button type="button" disabled={busy} onClick={() => void create()}>
          <Plus size={16} aria-hidden /> Create schedule
        </Button>
      </Card>

      <div className="space-y-3">
        {query.isLoading ? <Card className="h-20 animate-pulse bg-slate-100" /> : null}
        {(query.data ?? []).map((row) => (
          <Card key={row.id} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-brand-navy">{row.name}</p>
                <p className="text-xs text-slate-500">
                  {row.template.origin} → {row.template.destination} · {row.template.weightKg} kg
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={row.active ? "success" : "warning"}>{row.active ? "Active" : "Paused"}</Badge>
                <Badge>{row.cadence}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              <CalendarClock size={14} className="mr-1 inline" aria-hidden />
              Next run {new Date(row.nextRunAt).toLocaleString()}
              {row.lastTrackingNumber ? ` · Last ${row.lastTrackingNumber}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={async () => {
                  try {
                    const result = await apiQuery<{ shipment: { trackingNumber: string } }>("/api/recurring", {
                      method: "PATCH",
                      body: JSON.stringify({ id: row.id, runNow: true })
                    });
                    await queryClient.invalidateQueries(["recurring"]);
                    pushToast({
                      tone: "success",
                      title: "Shipment booked",
                      message: result.shipment.trackingNumber
                    });
                  } catch (err) {
                    pushToast({
                      tone: "error",
                      title: "Run failed",
                      message: err instanceof Error ? err.message : "Try again"
                    });
                  }
                }}
              >
                <Play size={16} aria-hidden /> Run now
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={async () => {
                  await apiQuery("/api/recurring", {
                    method: "PATCH",
                    body: JSON.stringify({ id: row.id, active: !row.active })
                  });
                  await queryClient.invalidateQueries(["recurring"]);
                }}
              >
                {row.active ? "Pause" : "Resume"}
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={async () => {
                  await apiQuery(`/api/recurring?id=${encodeURIComponent(row.id)}`, { method: "DELETE" });
                  await queryClient.invalidateQueries(["recurring"]);
                }}
              >
                <Trash2 size={16} aria-hidden /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
