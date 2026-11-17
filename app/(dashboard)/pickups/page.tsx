"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ToneBadge } from "@/components/dashboard/status-badge";
import { demoPickups, type DemoPickup } from "@/lib/demo/customer-fixtures";

const toneMap = {
  REQUESTED: "warning",
  SCHEDULED: "info",
  COMPLETED: "success",
  CANCELLED: "danger"
} as const;

export default function PickupsPage() {
  const [rows, setRows] = useState<DemoPickup[]>(demoPickups);
  const [form, setForm] = useState({
    shipmentReference: "REF-IND-2404",
    address: "1200 Demo Ave, Los Angeles, CA 90012",
    preferredDate: "",
    preferredTime: "09:00–12:00",
    contactPerson: "Jordan Ellis",
    phone: "+1 (310) 555-0142",
    instructions: ""
  });
  const [message, setMessage] = useState("");

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Pickup Requests"
        description="Create and review demonstration pickup requests. No live dispatch is performed."
      />

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">New pickup request</h2>
          <Input
            placeholder="Shipment reference"
            value={form.shipmentReference}
            onChange={(e) => setForm({ ...form, shipmentReference: e.target.value })}
          />
          <Input placeholder="Pickup address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} aria-label="Preferred collection date" />
          <Input placeholder="Preferred time window" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} />
          <Input placeholder="Contact person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
          <Input placeholder="Telephone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea
            className="focus-ring min-h-[90px] w-full rounded-input border border-slate-300 p-3 text-sm"
            placeholder="Special instructions"
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          />
          <Button
            type="button"
            onClick={() => {
              if (!form.preferredDate) {
                setMessage("Preferred collection date is required.");
                return;
              }
              const row: DemoPickup = {
                id: `pkp_local_${Date.now()}`,
                ...form,
                status: "REQUESTED"
              };
              setRows((prev) => [row, ...prev]);
              setMessage("Demonstration pickup request added to local history only.");
            }}
          >
            Submit demonstration request
          </Button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Pickup history</h2>
          <ul className="space-y-3">
            {rows.map((p) => (
              <li key={p.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-brand-navy">{p.shipmentReference}</p>
                  <ToneBadge label={p.status} tone={toneMap[p.status]} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{p.address}</p>
                <p className="text-xs text-slate-500">
                  {p.preferredDate} · {p.preferredTime} · {p.contactPerson} · {p.phone}
                </p>
                {p.instructions ? <p className="mt-1 text-xs text-slate-500">{p.instructions}</p> : null}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
