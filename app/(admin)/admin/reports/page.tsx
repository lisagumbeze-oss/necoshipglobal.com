"use client";

import { useState } from "react";
import { Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminMonthlyShipments, demoAdminRevenueIndex } from "@/lib/demo/admin-fixtures";

const REPORTS = [
  "Shipment volume",
  "Revenue",
  "Invoice aging",
  "Payment collection",
  "Corporate customer performance",
  "Shipping services",
  "Destination analysis",
  "Delivery performance",
  "Fleet utilization",
  "Warehouse activity",
  "Exception analysis",
  "Claims",
  "Customer acquisition"
] as const;

export default function AdminReportsPage() {
  const [report, setReport] = useState<(typeof REPORTS)[number]>("Shipment volume");
  const [from, setFrom] = useState("2026-06-01");
  const [to, setTo] = useState("2026-11-30");

  const maxShip = Math.max(...demoAdminMonthlyShipments.map((m) => m.count));
  const maxRev = Math.max(...demoAdminRevenueIndex.map((m) => m.index));

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Executive reports & analytics"
        description="Company-wide reporting views using clearly identified demonstration series — not actual company performance."
      />
      <AdminUiNote>
        Charts use synthetic indices for UI review. Do not present fabricated financial or operational metrics as genuine
        NECO results.
      </AdminUiNote>

      <Card className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="rep-type">
            Report
          </label>
          <select
            id="rep-type"
            className="mt-1 h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={report}
            onChange={(e) => setReport(e.target.value as (typeof REPORTS)[number])}
          >
            {REPORTS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="rep-from">
            From
          </label>
          <Input id="rep-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="rep-to">
            To
          </label>
          <Input id="rep-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Shipment volume index (demo)</h2>
          <div className="flex h-48 items-end gap-2">
            {demoAdminMonthlyShipments.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-brand-navy/80"
                  style={{ height: `${(m.count / maxShip) * 100}%` }}
                  title={`${m.count} (demo)`}
                />
                <span className="text-[10px] text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-800">Demonstration bars — not live volume.</p>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Revenue index (demo)</h2>
          <div className="flex h-48 items-end gap-2">
            {demoAdminRevenueIndex.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-brand-yellow"
                  style={{ height: `${(m.index / maxRev) * 100}%` }}
                  title={`Index ${m.index} (demo)`}
                />
                <span className="text-[10px] text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-800">Indexed illustration only — not GBP revenue.</p>
        </Card>
      </div>

      <Card className="space-y-2 text-sm text-slate-600">
        <h2 className="font-semibold text-brand-navy">Selected report: {report}</h2>
        <p>
          Date range {from} → {to}. This view surfaces the demonstration narrative for <strong>{report}</strong>. Connect
          approved analytics sources in a later module before treating figures as operational truth.
        </p>
      </Card>
    </section>
  );
}
