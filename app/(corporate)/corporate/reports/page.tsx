"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  demoCostCentres,
  demoDestinationSpend,
  demoInvoiceAging,
  demoMethodDistribution,
  demoMonthlyShipments,
  demoOrganization
} from "@/lib/demo/corporate-fixtures";

const CHART_COLORS = ["#062853", "#F8E000", "#334155", "#94a3b8", "#0f766e"];

export default function CorporateReportsPage() {
  const [from, setFrom] = useState("2026-06-01");
  const [to, setTo] = useState("2026-11-30");

  const costCentreSpend = useMemo(
    () =>
      demoCostCentres.map((c) => ({
        name: c.code,
        /** Numeric demo units for charting only — not currency truth. */
        units: Number.parseInt(c.expenditureLabel.replace(/[^\d]/g, ""), 10) || 0
      })),
    []
  );

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Corporate analytics"
        description="Demonstration charts for shipment and commercial activity. Not actual NECO financial performance."
      />

      <Card className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="rpt-from">
            From
          </label>
          <Input id="rpt-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="rpt-to">
            To
          </label>
          <Input id="rpt-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <p className="text-xs text-amber-800">
          Date range filters the demonstration workspace narrative only ({demoOrganization.tradingName}).
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly shipment activity">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={demoMonthlyShipments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#062853" radius={[6, 6, 0, 0]} name="Shipments (demo)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Transport method distribution">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={demoMethodDistribution} dataKey="value" nameKey="method" innerRadius={50} outerRadius={80}>
                {demoMethodDistribution.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Destination analysis (demo index)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={demoDestinationSpend} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="destination" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="spend" fill="#F8E000" name="Demo index" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cost-centre expenditure (demo units)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={costCentreSpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="units" fill="#062853" name="Demo units" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Invoice aging (demo index)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={demoInvoiceAging}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="amount" fill="#334155" name="Demo index" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="space-y-2">
          <h2 className="font-semibold text-brand-navy">Contract utilization</h2>
          <p className="text-sm text-slate-600">
            Contract utilization analytics are not connected. When commercial utilization metrics are available they will
            appear here for the active demonstration contract.
          </p>
          <p className="text-xs text-amber-800">Placeholder — not NECO financial performance.</p>
        </Card>
      </div>
    </section>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-brand-navy">{title}</h2>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
          Demonstration data
        </span>
      </div>
      {children}
    </Card>
  );
}
