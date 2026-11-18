"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Badge,
  Card,
  ChartContainer,
  EmptyState,
  FilterBar,
  Input,
  KpiCard,
  Tabs
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import {
  demoAdminInvoices,
  demoAdminMonthlyShipments,
  demoAdminRevenueIndex,
  demoAdminShipments,
  demoClaimCases,
  getAdminOverviewStats
} from "@/lib/demo/admin-fixtures";
import { hasPermission } from "@/lib/rbac";

const REPORT_TABS = [
  { id: "shipments", label: "Shipments" },
  { id: "operations", label: "Operations" },
  { id: "finance", label: "Financial" }
] as const;

type ReportTab = (typeof REPORT_TABS)[number]["id"];

export default function AdminReportsPage() {
  const { data: session } = useSession();
  const role = session?.user?.staffRole ?? null;
  const canView = !role || hasPermission(role, "reporting.view");

  const [tab, setTab] = useState<ReportTab>("shipments");
  const [from, setFrom] = useState("2026-06-01");
  const [to, setTo] = useState("2026-11-30");

  const stats = getAdminOverviewStats();
  const maxShip = Math.max(...demoAdminMonthlyShipments.map((m) => m.count), 1);
  const maxRev = Math.max(...demoAdminRevenueIndex.map((m) => m.index), 1);

  const methodRows = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of demoAdminShipments) {
      map.set(s.method, (map.get(s.method) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([method, count]) => ({ method, count }));
  }, []);

  const destinationRows = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of demoAdminShipments) {
      map.set(s.destination, (map.get(s.destination) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  if (!canView) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-6">
        <DashboardPageHeader title="Reporting & analytics" description="reporting.view permission required." />
        <EmptyState title="Access restricted" description="Your session role does not include reporting.view." />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title="Reporting & analytics"
        description="UI-45 executive reporting. Charts and tables use labelled demonstration series only — never invented live business results."
      />

      <AdminUiNote>
        Date-range controls filter presentation context only. Export is unavailable until an approved reporting export API
        exists. Series labelled “demo index” are synthetic illustration values from Module 5 fixtures.
      </AdminUiNote>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Shipments (demo)" value={stats.shipments} hint="Fixture rows" tone="info" />
        <KpiCard label="Exceptions (demo)" value={stats.exceptions} hint="EXCEPTION status" tone="danger" />
        <KpiCard label="Open claims (demo)" value={stats.openClaims} hint="Claims fixtures" tone="warning" />
        <KpiCard label="Outstanding (demo)" value={stats.outstandingLabel} hint="Finance index" tone="default" />
      </div>

      <FilterBar>
        <div>
          <label className="ns-meta uppercase" htmlFor="rep-from">
            From
          </label>
          <Input id="rep-from" className="mt-1" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="ns-meta uppercase" htmlFor="rep-to">
            To
          </label>
          <Input id="rep-to" className="mt-1" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="flex flex-col justify-end">
          <button
            type="button"
            disabled
            className="h-11 cursor-not-allowed rounded-button border border-ns-border bg-slate-50 px-4 text-sm font-semibold text-slate-400"
            title="Export requires an approved reporting API"
          >
            Export (unavailable)
          </button>
        </div>
        <p className="self-end text-sm text-slate-600">
          Range {from} → {to} · presentation context
        </p>
      </FilterBar>

      <Tabs
        items={REPORT_TABS.map((t) => ({ id: t.id, label: t.label }))}
        value={tab}
        onChange={(id) => setTab(id as ReportTab)}
      />

      {tab === "shipments" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartContainer
            title="Shipment volume index (demo)"
            description="Monthly demonstration counts — not live network volume."
          >
            <div className="flex h-48 items-end gap-2" role="img" aria-label="Demonstration shipment volume bars">
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
          </ChartContainer>

          <Card className="space-y-3">
            <h2 className="ns-card-title">Shipment method mix (demo fixtures)</h2>
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-ns-border text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Method</th>
                  <th className="py-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {methodRows.map((row) => (
                  <tr key={row.method} className="border-b border-ns-border last:border-0">
                    <td className="py-2">{row.method}</td>
                    <td className="py-2">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="space-y-3 lg:col-span-2">
            <h2 className="ns-card-title">Destination analysis (demo fixtures)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-ns-border text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-2 py-2">Destination</th>
                    <th className="px-2 py-2">Shipments</th>
                  </tr>
                </thead>
                <tbody>
                  {destinationRows.map((row) => (
                    <tr key={row.destination} className="border-b border-ns-border last:border-0">
                      <td className="px-2 py-2">{row.destination}</td>
                      <td className="px-2 py-2">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}

      {tab === "operations" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-3">
            <h2 className="ns-card-title">Operational summary (demo)</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b border-ns-border py-2">
                <span>Active shipments</span>
                <Badge tone="info">{stats.activeShipments}</Badge>
              </li>
              <li className="flex justify-between border-b border-ns-border py-2">
                <span>Delivered</span>
                <Badge tone="success">{stats.delivered}</Badge>
              </li>
              <li className="flex justify-between border-b border-ns-border py-2">
                <span>Exceptions</span>
                <Badge tone="danger">{stats.exceptions}</Badge>
              </li>
              <li className="flex justify-between py-2">
                <span>Open claims</span>
                <Badge tone="warning">{stats.openClaims}</Badge>
              </li>
            </ul>
          </Card>
          <Card className="space-y-3">
            <h2 className="ns-card-title">Claims snapshot (demo)</h2>
            <ul className="divide-y divide-ns-border text-sm">
              {demoClaimCases.slice(0, 5).map((c) => (
                <li key={c.id} className="py-2">
                  <p className="font-medium text-brand-navy">{c.reference}</p>
                  <p className="ns-meta">
                    {c.category} · {c.status} · {c.priority}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}

      {tab === "finance" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartContainer
            title="Revenue index (demo)"
            description="Indexed illustration only — not GBP revenue or billed totals."
          >
            <div className="flex h-48 items-end gap-2" role="img" aria-label="Demonstration revenue index bars">
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
          </ChartContainer>

          <Card className="space-y-3">
            <h2 className="ns-card-title">Invoice status table (demo)</h2>
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-ns-border text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Reference</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {demoAdminInvoices.map((i) => (
                  <tr key={i.id} className="border-b border-ns-border last:border-0">
                    <td className="py-2 font-mono text-xs">{i.reference}</td>
                    <td className="py-2">
                      <Badge tone={i.status === "Paid" ? "success" : i.status === "Overdue" ? "danger" : "warning"}>
                        {i.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-amber-900">{i.outstandingLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="ns-meta">
              Collections index {stats.collectionsLabel} · credit utilization {stats.creditUtilizationLabel}
            </p>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
