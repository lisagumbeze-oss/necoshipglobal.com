"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoScanPreview, demoWarehouses } from "@/lib/demo/operations-fixtures";

export default function WarehouseReceivingPage() {
  const [tracking, setTracking] = useState("");
  const [condition, setCondition] = useState("Intact");
  const [bin, setBin] = useState("A1-S2-B04");
  const [notice, setNotice] = useState("");

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Inbound receiving"
        description="Demonstration receiving workflow for parcel custody. Does not create live warehouse movements."
      />
      <Card className="space-y-3">
        <Input
          aria-label="Tracking number"
          placeholder="Tracking number"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
        <Input aria-label="Package identifier" placeholder="Package identifier" />
        <select
          className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
          aria-label="Facility"
          defaultValue={demoWarehouses[0]?.code}
        >
          {demoWarehouses.map((w) => (
            <option key={w.code} value={w.code}>
              {w.code} — {w.name}
            </option>
          ))}
        </select>
        <select
          className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
          aria-label="Package condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option>Intact</option>
          <option>Damaged (demo)</option>
          <option>Quantity mismatch (demo)</option>
        </select>
        <Input aria-label="Storage bin" value={bin} onChange={(e) => setBin(e.target.value)} placeholder="Assigned bin" />
        <textarea
          className="focus-ring min-h-[80px] w-full rounded-input border border-slate-300 p-3 text-sm"
          placeholder="Receiving notes"
          aria-label="Receiving notes"
        />
        <Button
          type="button"
          onClick={() =>
            setNotice(
              tracking
                ? `Demonstration receiving preview for ${tracking} → ${bin}. No WarehouseMovement persisted.`
                : "Enter a tracking number to preview receiving feedback."
            )
          }
        >
          Confirm arrival (demo)
        </Button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </Card>

      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Barcode / QR scan panel</h2>
        <p className="text-sm text-slate-600">{demoScanPreview.resultNote}</p>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Scanner hardware integration point — no fake live scan events generated.
        </div>
      </Card>
    </section>
  );
}
