"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  ChartContainer,
  KpiCard
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import { CorporateDemoNote } from "@/components/corporate/corporate-ui-note";
import {
  CORPORATE_ROLE_LABELS,
  CORPORATE_ROLE_NAV,
  demoCorporateInvoices,
  demoCorporateQuotes,
  demoCorporateShipments,
  demoCostCentres,
  demoCreditProfile,
  demoOrganization,
  getCorporateOverviewStats,
  getDemoCorporateSession,
  scopeByOrganization
} from "@/lib/demo/corporate-fixtures";
import {
  FileText,
  PackagePlus,
  Layers,
  Search,
  Receipt,
  LifeBuoy,
  Building2,
  BadgePercent
} from "lucide-react";

export function CorporateDashboardView() {
  const stats = getCorporateOverviewStats();
  const session = getDemoCorporateSession();
  const roleMeta = CORPORATE_ROLE_NAV[session.role];
  const recent = scopeByOrganization(demoCorporateShipments).slice(0, 5);
  const quotes = scopeByOrganization(demoCorporateQuotes).slice(0, 4);
  const invoices = scopeByOrganization(demoCorporateInvoices).slice(0, 4);
  const centres = scopeByOrganization(demoCostCentres).slice(0, 4);
  const chartMax = Math.max(stats.total, 1);

  const statusRows = [
    { label: "Pending collection", value: stats.pendingCollection, tone: "bg-slate-400" },
    { label: "Processing", value: stats.processing, tone: "bg-brand-warning" },
    { label: "In transit", value: stats.inTransitExact, tone: "bg-brand-info" },
    { label: "Customs", value: stats.customs, tone: "bg-brand-warning" },
    { label: "Out for delivery", value: stats.outForDelivery, tone: "bg-brand-yellow" },
    { label: "Delivered", value: stats.delivered, tone: "bg-brand-success" },
    { label: "Exceptions", value: stats.exceptions, tone: "bg-brand-danger" }
  ];

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title={demoOrganization.tradingName}
        description="Corporate shipping overview — UI-31 layout with demonstration organization data only."
        actions={
          <>
            <Link href={"/corporate/create-shipment" as never}>
              <Button>
                <PackagePlus size={16} aria-hidden /> Create shipment
              </Button>
            </Link>
            <Link href={"/corporate/quotations" as never}>
              <Button variant="secondary">Request quote</Button>
            </Link>
          </>
        }
      />

      <Card className="grid gap-4 border-l-4 border-l-brand-yellow lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2">
          <p className="ns-meta font-semibold uppercase tracking-wide">Organization context</p>
          <p className="font-display text-xl font-bold text-brand-navy">{demoOrganization.registeredName}</p>
          <p className="text-sm text-slate-600">{demoOrganization.businessEmail}</p>
          <p className="font-mono text-xs font-semibold text-brand-navy">{demoOrganization.accountNumberDemo}</p>
          <p className="ns-meta">Server-validated membership · no client organization switcher</p>
        </div>
        <div className="space-y-2 rounded-input border border-ns-border bg-brand-surface-muted p-3">
          <p className="ns-meta font-semibold uppercase tracking-wide">Demo session role</p>
          <p className="font-semibold text-brand-navy">
            {session.displayName} · {CORPORATE_ROLE_LABELS[session.role]}
          </p>
          <p className="text-sm text-slate-600">{roleMeta.note}</p>
          <p className="ns-meta text-amber-900">
            Role presentation only — UI navigation hints do not enforce security. Authorization remains server-side.
          </p>
        </div>
      </Card>

      {/* UI-31 KPI summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total shipments" value={stats.total} hint="Demonstration count" tone="info" icon={<Building2 size={18} aria-hidden />} />
        <KpiCard label="In progress" value={stats.inTransit} hint="Collected through out for delivery" tone="info" />
        <KpiCard label="Pending quotations" value={stats.pendingQuotes} hint="Open commercial requests" tone="warning" />
        <KpiCard label="Outstanding invoices" value={stats.outstandingInvoices} hint="Due or overdue (demo)" tone="warning" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Delivered" value={stats.delivered} hint="Completed demo records" tone="success" />
        <KpiCard label="Rate cards approved" value={stats.approvedRateCards} hint="Demonstration labels only" tone="success" />
        <KpiCard label="Rate reviews pending" value={stats.pendingRateReviews} hint="No live tariff mutations" tone="warning" />
        <KpiCard
          label="Credit utilization"
          value={demoCreditProfile.connected ? demoCreditProfile.utilizationLabel : "Not connected"}
          hint="Finance not linked"
          tone="default"
        />
      </div>

      {!demoCreditProfile.connected ? (
        <CorporateDemoNote title="Available credit not connected">
          <p>
            Live finance is not connected. Sample illustration only: {demoCreditProfile.availableCreditLabel}. Organization
            users cannot change credit limits here.
          </p>
        </CorporateDemoNote>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="space-y-4">
          <ChartContainer
            title="Shipment status distribution"
            description="Status mix for this demonstration organization — not live network volume."
          >
            <div className="space-y-3" role="img" aria-label="Demonstration corporate shipment status distribution">
              {statusRows.map((row) => (
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

          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="ns-card-title">Recent corporate shipments</h2>
              <Link href={"/corporate/shipments" as never} className="text-sm font-semibold text-brand-navy hover:underline">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ns-border">
                    <th className="ns-table-heading px-2 py-2">Tracking</th>
                    <th className="ns-table-heading px-2 py-2">Lane</th>
                    <th className="ns-table-heading px-2 py-2">Cost centre</th>
                    <th className="ns-table-heading px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((s) => (
                    <tr key={s.id} className="border-b border-ns-border/70 last:border-0">
                      <td className="px-2 py-2.5">
                        <Link
                          href={`/corporate/shipments/${s.trackingNumber}` as never}
                          className="font-mono text-xs font-semibold text-brand-navy hover:underline"
                        >
                          {s.trackingNumber}
                        </Link>
                      </td>
                      <td className="px-2 py-2.5 text-slate-600">
                        {s.origin} → {s.destination}
                      </td>
                      <td className="px-2 py-2.5 text-slate-600">{s.costCentreCode}</td>
                      <td className="px-2 py-2.5">
                        <ShipmentStatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="ns-card-title">Quotation overview</h2>
              <Link href={"/corporate/quotations" as never} className="text-sm font-semibold text-brand-navy hover:underline">
                Open
              </Link>
            </div>
            <ul className="space-y-2">
              {quotes.map((q) => (
                <li key={q.id} className="rounded-input border border-ns-border px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs font-semibold text-brand-navy">{q.reference}</p>
                    <Badge tone={q.status === "QUOTED" ? "success" : "warning"}>{q.status.replaceAll("_", " ")}</Badge>
                  </div>
                  <p className="ns-meta mt-1">
                    {q.origin} → {q.destination} · {q.method}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="ns-card-title">Invoice overview</h2>
              <Link href={"/corporate/invoices" as never} className="text-sm font-semibold text-brand-navy hover:underline">
                Open
              </Link>
            </div>
            <ul className="space-y-2">
              {invoices.map((inv) => (
                <li key={inv.id} className="rounded-input border border-ns-border px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/corporate/invoices/${inv.id}` as never}
                      className="font-mono text-xs font-semibold text-brand-navy hover:underline"
                    >
                      {inv.reference}
                    </Link>
                    <Badge
                      tone={
                        inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "danger" : "warning"
                      }
                    >
                      {inv.status}
                    </Badge>
                  </div>
                  <p className="ns-meta mt-1">
                    {inv.billingPeriod} · {inv.totalLabel}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="ns-card-title">Cost-centre summary</h2>
              <Link href={"/corporate/cost-centres" as never} className="text-sm font-semibold text-brand-navy hover:underline">
                Open
              </Link>
            </div>
            <ul className="space-y-2">
              {centres.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 rounded-input border border-ns-border px-3 py-2">
                  <div>
                    <p className="font-semibold text-brand-navy">
                      {c.code} · {c.name}
                    </p>
                    <p className="ns-meta">{c.expenditureLabel} spent (demo)</p>
                  </div>
                  <Badge tone="success">{c.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="space-y-3">
            <h2 className="ns-card-title">Account activity</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="rounded-input border border-ns-border px-3 py-2">
                Account status: <span className="font-semibold text-brand-navy">{demoOrganization.accountStatus}</span>
              </li>
              <li className="rounded-input border border-ns-border px-3 py-2">
                Contract status: <span className="font-semibold text-brand-navy">{demoOrganization.contractStatus}</span>
              </li>
              <li className="rounded-input border border-ns-border px-3 py-2">
                Account manager: {demoOrganization.accountManagerName}
              </li>
              <li className="rounded-input border border-ns-border px-3 py-2">
                Active cost centres: {stats.activeCostCentres} (demonstration)
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Card className="space-y-3">
        <h2 className="ns-card-title">Corporate actions</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/corporate/quotations", label: "Request Shipping Quote", icon: FileText },
            { href: "/corporate/create-shipment", label: "Create Shipment", icon: PackagePlus },
            { href: "/corporate/bulk-shipments", label: "Bulk Shipment Request", icon: Layers },
            { href: "/tracking", label: "Track Shipment", icon: Search },
            { href: "/corporate/invoices", label: "View Invoices", icon: Receipt },
            { href: "/corporate/rates", label: "Negotiated Rates", icon: BadgePercent },
            { href: "/corporate/settings", label: "Contact Account Support", icon: LifeBuoy }
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href + label}
              href={href as never}
              className="focus-ring flex min-h-touch items-center gap-2 rounded-input border border-ns-border px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-surface-muted"
            >
              <Icon size={16} aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      </Card>
    </section>
  );
}
