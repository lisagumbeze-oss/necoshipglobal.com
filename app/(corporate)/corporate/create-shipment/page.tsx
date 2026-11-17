"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoCostCentres, demoOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateCreateShipmentPage() {
  const [notice, setNotice] = useState("");
  const [costCentre, setCostCentre] = useState(demoCostCentres[0]?.code ?? "");

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <DashboardPageHeader
        title="Create corporate shipment"
        description="Capture a demonstration booking draft for the sample organization. No live booking is created."
      />

      <Card className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Organization: {demoOrganization.tradingName}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Shipment reference / PO" aria-label="Shipment reference" />
          <select
            className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
            aria-label="Cost centre"
            value={costCentre}
            onChange={(e) => setCostCentre(e.target.value)}
          >
            {demoCostCentres.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
          <Input placeholder="Origin city / country" aria-label="Origin" />
          <Input placeholder="Destination city / country" aria-label="Destination" />
          <select className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm" aria-label="Method">
            <option>Air freight</option>
            <option>Ocean freight</option>
            <option>Road freight</option>
            <option>Last-mile delivery</option>
            <option>Freight forwarding</option>
          </select>
          <Input type="number" placeholder="Weight (kg)" aria-label="Weight" />
        </div>
        <textarea
          className="focus-ring min-h-[90px] w-full rounded-input border border-slate-300 p-3 text-sm"
          placeholder="Cargo description"
          aria-label="Cargo description"
        />
        <Button
          type="button"
          onClick={() => {
            const id = `DRAFT-CORP-${Date.now().toString().slice(-6)}`;
            window.sessionStorage.setItem(
              "neco_demo_corporate_shipment_draft",
              JSON.stringify({ id, costCentre, organizationId: demoOrganization.id, at: new Date().toISOString() })
            );
            setNotice(`Demonstration draft ${id} saved locally — not submitted to Production.`);
          }}
        >
          Save demonstration draft
        </Button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </Card>
    </section>
  );
}
