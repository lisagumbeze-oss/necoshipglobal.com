"use client";

import { useState } from "react";
import { Button, Card, Input, Badge } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  demoNegotiatedRates,
  demoOrganization,
  scopeByOrganization
} from "@/lib/demo/corporate-fixtures";

export default function CorporateRatesPage() {
  const [notice, setNotice] = useState("");
  const rates = scopeByOrganization(demoNegotiatedRates);

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Negotiated shipping rates"
        description="Corporate contract rate cards for demonstration. Values are labelled sample data — not live NECO tariffs."
      />

      {rates.length === 0 ? (
        <Card>
          <p className="font-semibold text-brand-navy">Contract rates not yet configured.</p>
          <p className="mt-1 text-sm text-slate-600">
            When commercial rate cards are linked to this organization, they will appear here.
          </p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Contract</th>
                <th className="px-4 py-3">Rate card</th>
                <th className="px-4 py-3">Lane</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Weight band</th>
                <th className="px-4 py-3">Demo rate</th>
                <th className="px-4 py-3">Minimum</th>
                <th className="px-4 py-3">Effective</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 align-top last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{r.contractReference}</td>
                  <td className="px-4 py-3">{r.rateCardName}</td>
                  <td className="px-4 py-3">
                    {r.origin} → {r.destination}
                    <span className="block text-xs text-slate-500">{r.method}</span>
                  </td>
                  <td className="px-4 py-3">{r.serviceCategory}</td>
                  <td className="px-4 py-3">{r.weightBand}</td>
                  <td className="px-4 py-3 text-amber-900">{r.demoRateLabel}</td>
                  <td className="px-4 py-3 text-amber-900">{r.minimumChargeLabel}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {r.effectiveFrom}
                    <br />
                    {r.effectiveTo ?? "Open-ended (demo)"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={r.approvalStatus === "Approved" ? "success" : "warning"}>{r.approvalStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        {rates.map((r) => (
          <Card key={`${r.id}-detail`} className="space-y-2 text-sm">
            <p className="font-semibold text-brand-navy">{r.rateCardName}</p>
            <p className="text-slate-600">
              <span className="font-medium">Surcharges:</span> {r.surcharges}
            </p>
            <p className="text-slate-600">
              <span className="font-medium">Conditions:</span> {r.conditions}
            </p>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Request rate review</h2>
        <p className="text-sm text-slate-600">
          Submit a demonstration review request for {demoOrganization.tradingName}. Commercial approval remains with NECO
          — this form does not change live rates.
        </p>
        <Input placeholder="Lane or rate card to review" aria-label="Rate review subject" />
        <textarea
          className="focus-ring min-h-[90px] w-full rounded-input border border-slate-300 p-3 text-sm"
          placeholder="Reason for review"
          aria-label="Rate review reason"
        />
        <Button type="button" onClick={() => setNotice("Demonstration rate-review request saved locally.")}>
          Submit review request (demo)
        </Button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </Card>
    </section>
  );
}
