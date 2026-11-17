"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  demoAdminShipments,
  demoAuditEntries,
  demoClaimCases,
  demoRateApprovals,
  demoSupportTickets,
  getAdminOverviewStats
} from "@/lib/demo/admin-fixtures";

export function AdminDashboardView() {
  const stats = getAdminOverviewStats();
  const [from, setFrom] = useState("2026-06-01");
  const [to, setTo] = useState("2026-11-30");

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <DashboardPageHeader
        title="Executive administrator overview"
        description="Company-wide demonstration workspace. Figures are synthetic and not live NECO performance."
      />

      <Card className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="adm-from">
            From
          </label>
          <Input id="adm-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="adm-to">
            To
          </label>
          <Input id="adm-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <p className="text-xs text-amber-800">Date range filters demonstration narrative only.</p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Registered customers", value: stats.customers },
          { label: "Corporate organizations", value: stats.organizations },
          { label: "Active staff accounts", value: stats.staffActive },
          { label: "Total shipments", value: stats.shipments },
          { label: "Active shipments", value: stats.activeShipments },
          { label: "Successful deliveries", value: stats.delivered },
          { label: "Open exceptions", value: stats.exceptions },
          { label: "Open claims", value: stats.openClaims },
          { label: "Pending approvals", value: stats.pendingApprovals },
          { label: "Total invoiced", value: stats.invoicedLabel },
          { label: "Outstanding invoices", value: stats.outstandingLabel },
          { label: "Payment collections", value: stats.collectionsLabel },
          { label: "Credit utilization", value: stats.creditUtilizationLabel }
        ].map((item) => (
          <Card key={item.label} className="space-y-1 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{item.value}</p>
            <p className="text-[11px] text-amber-800">Demonstration figure</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Recent platform activity</h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {demoAuditEntries.map((a) => (
              <li key={a.id} className="py-2">
                <p className="font-medium text-brand-navy">{a.summary}</p>
                <p className="text-xs text-slate-500">
                  {a.user} · {a.category} · {new Date(a.at).toLocaleString()} · {a.outcome}
                </p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-navy">Recent shipment activity</h2>
            <Link href={"/admin/shipments" as never} className="text-sm font-medium text-brand-navy hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 text-sm">
            {demoAdminShipments.slice(0, 5).map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2 py-2">
                <div>
                  <p className="font-mono font-semibold text-brand-navy">{s.trackingNumber}</p>
                  <p className="text-xs text-slate-500">
                    {s.origin} → {s.destination}
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-600">{s.status}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Financial overview</h2>
          <p>Invoiced: {stats.invoicedLabel}</p>
          <p>Outstanding: {stats.outstandingLabel}</p>
          <p>Collections: {stats.collectionsLabel}</p>
          <Link href={"/admin/finance" as never} className="font-semibold text-brand-navy hover:underline">
            Open finance
          </Link>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Operational overview</h2>
          <p>Active shipments: {stats.activeShipments} (demo)</p>
          <p>Exceptions: {stats.exceptions} (demo)</p>
          <p>Pending rate approvals: {demoRateApprovals.length} (demo)</p>
          <Link href={"/admin/exceptions" as never} className="font-semibold text-brand-navy hover:underline">
            Open exceptions
          </Link>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Outstanding issues</h2>
          <p>Open claims: {demoClaimCases.filter((c) => c.status !== "Closed").length}</p>
          <p>Escalated tickets: {demoSupportTickets.filter((t) => t.status === "Escalated").length}</p>
          <p className="text-xs text-amber-800">Administrative alerts are demonstration-only.</p>
          <Link href={"/admin/claims" as never} className="font-semibold text-brand-navy hover:underline">
            Review claims
          </Link>
        </Card>
      </div>
    </section>
  );
}
