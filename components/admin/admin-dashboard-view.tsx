"use client";

import Link from "next/link";
import { Badge, Button, ButtonLink, Card, ChartContainer, KpiCard } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import {
  demoAdminShipments,
  demoAuditEntries,
  demoClaimCases,
  demoRateApprovals,
  demoSupportTickets,
  getAdminOverviewStats
} from "@/lib/demo/admin-fixtures";
import {
  Building2,
  ShieldAlert,
  Users,
  Package,
  FileWarning
} from "lucide-react";

export function AdminDashboardView() {
  const stats = getAdminOverviewStats();
  const openClaims = demoClaimCases.filter((c) => c.status !== "Closed");
  const escalated = demoSupportTickets.filter((t) => t.status === "Escalated");
  const pendingApprovals = demoRateApprovals.filter((r) => r.reviewStatus.includes("Pending"));
  const chartMax = Math.max(stats.shipments, 1);

  const shipmentMix = [
    { label: "Active", value: stats.activeShipments, tone: "bg-brand-info" },
    { label: "Delivered", value: stats.delivered, tone: "bg-brand-success" },
    { label: "Exceptions", value: stats.exceptions, tone: "bg-brand-danger" }
  ];

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title="Administrator overview"
        description="UI-28 enterprise management overview. Counts below are demonstration fixture tallies — not fabricated live company performance."
        actions={
          <>
            <ButtonLink href="/admin/reports" variant="secondary">
              Reports
            </ButtonLink>
            <ButtonLink href="/admin/finance">Finance</ButtonLink>
          </>
        }
      />

      <AdminUiNote>
        Platform figures are derived only from labelled Module 5 demonstration records. Do not treat them as verified
        operational or financial KPIs. Impersonation is not available in this console.
      </AdminUiNote>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Customers" value={stats.customers} hint="Demo directory count" tone="info" icon={<Users size={18} aria-hidden />} />
        <KpiCard label="Organizations" value={stats.organizations} hint="Corporate demo orgs" tone="info" icon={<Building2 size={18} aria-hidden />} />
        <KpiCard label="Active staff" value={stats.staffActive} hint="Account status Active" tone="success" />
        <KpiCard label="Shipments (demo)" value={stats.shipments} hint="Fixture shipment rows" tone="info" icon={<Package size={18} aria-hidden />} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open exceptions" value={stats.exceptions} hint="Shipment EXCEPTION status" tone="danger" icon={<ShieldAlert size={18} aria-hidden />} />
        <KpiCard label="Open claims" value={stats.openClaims} hint="Demo claim cases" tone="warning" icon={<FileWarning size={18} aria-hidden />} />
        <KpiCard label="Pending approvals" value={stats.pendingApprovals} hint="Rate reviews (demo)" tone="warning" />
        <KpiCard label="Outstanding (demo)" value={stats.outstandingLabel} hint="Finance index label only" tone="default" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartContainer
          title="Operational summary"
          description="Shipment status mix from demonstration admin fixtures — not live network volume."
        >
          <div className="space-y-3" role="img" aria-label="Demonstration shipment status mix">
            {shipmentMix.map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-brand-navy">{row.label}</span>
                  <span className="ns-meta">{row.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${row.tone}`}
                    style={{ width: `${Math.max(row.value ? 8 : 0, (row.value / chartMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <Card className="space-y-3 border-l-4 border-l-brand-danger">
          <div className="flex items-center justify-between gap-2">
            <h2 className="ns-card-title">Administrative alerts</h2>
            <Badge tone="warning">Demonstration</Badge>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="rounded-input border border-ns-border px-3 py-2">
              <p className="font-semibold text-brand-navy">{openClaims.length} open claims</p>
              <p className="ns-meta">Requires claims desk review (demo)</p>
            </li>
            <li className="rounded-input border border-ns-border px-3 py-2">
              <p className="font-semibold text-brand-navy">{escalated.length} escalated tickets</p>
              <p className="ns-meta">Support desk fixtures</p>
            </li>
            <li className="rounded-input border border-ns-border px-3 py-2">
              <p className="font-semibold text-brand-navy">{pendingApprovals.length} pending rate approvals</p>
              <p className="ns-meta">Commercial review queue (demo)</p>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link href={"/admin/claims" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Claims
            </Link>
            <Link href={"/admin/support-desk" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Support
            </Link>
            <Link href={"/admin/rate-approvals" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Rate approvals
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="ns-card-title">Recent activities</h2>
            <Link href={"/admin/audit-logs" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Audit logs
            </Link>
          </div>
          <ul className="divide-y divide-ns-border text-sm">
            {demoAuditEntries.slice(0, 6).map((a) => (
              <li key={a.id} className="py-2.5">
                <p className="font-medium text-brand-navy">{a.summary}</p>
                <p className="ns-meta">
                  {a.user} · {a.category} · {new Date(a.at).toLocaleString()} · {a.outcome}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="ns-card-title">Exception summary</h2>
            <Link href={"/admin/exceptions" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Exceptions
            </Link>
          </div>
          <ul className="divide-y divide-ns-border text-sm">
            {demoAdminShipments
              .filter((s) => s.status === "EXCEPTION")
              .slice(0, 5)
              .map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <div>
                    <Link
                      href={`/admin/shipments/${s.trackingNumber}` as never}
                      className="font-mono font-semibold text-brand-navy hover:underline"
                    >
                      {s.trackingNumber}
                    </Link>
                    <p className="ns-meta">
                      {s.origin} → {s.destination}
                    </p>
                  </div>
                  <Badge tone="danger">{s.status}</Badge>
                </li>
              ))}
            {demoAdminShipments.filter((s) => s.status === "EXCEPTION").length === 0 ? (
              <li className="py-2 text-slate-500">No EXCEPTION shipments in demonstration fixtures.</li>
            ) : null}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2 text-sm">
          <h2 className="ns-card-title">User & organization overview</h2>
          <p>Customers: {stats.customers} (demo)</p>
          <p>Organizations: {stats.organizations} (demo)</p>
          <p>Staff active: {stats.staffActive} (demo)</p>
          <Link href={"/admin/staff" as never} className="font-semibold text-brand-navy hover:underline">
            Staff directory
          </Link>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="ns-card-title">Financial administration</h2>
          <p>Invoiced index: {stats.invoicedLabel}</p>
          <p>Outstanding index: {stats.outstandingLabel}</p>
          <p>Collections index: {stats.collectionsLabel}</p>
          <Link href={"/admin/invoices" as never} className="font-semibold text-brand-navy hover:underline">
            Accounts receivable
          </Link>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="ns-card-title">System configuration</h2>
          <p>Roles & permissions reflect `lib/rbac.ts`.</p>
          <p>Audit and settings remain permission-gated.</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href={"/admin/permissions" as never} className="font-semibold text-brand-navy hover:underline">
              Permissions
            </Link>
            <Link href={"/admin/settings" as never} className="font-semibold text-brand-navy hover:underline">
              Settings
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
