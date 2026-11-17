"use client";

import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import {
  demoCorporateShipments,
  demoCreditProfile,
  demoOrganization,
  getCorporateOverviewStats,
  scopeByOrganization
} from "@/lib/demo/corporate-fixtures";
import {
  FileText,
  PackagePlus,
  Layers,
  Search,
  Receipt,
  LifeBuoy
} from "lucide-react";

export function CorporateDashboardView() {
  const stats = getCorporateOverviewStats();
  const recent = scopeByOrganization(demoCorporateShipments).slice(0, 5);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <DashboardPageHeader
        title={demoOrganization.tradingName}
        description="Corporate shipping overview using demonstration organization data. Not a live enterprise account."
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

      <Card className="grid gap-4 lg:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Organization</p>
          <p className="mt-1 font-semibold text-brand-navy">{demoOrganization.registeredName}</p>
          <p className="text-sm text-slate-600">{demoOrganization.businessEmail}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Demo account number</p>
          <p className="mt-1 font-mono text-sm font-semibold text-brand-navy">{demoOrganization.accountNumberDemo}</p>
          <p className="text-xs text-slate-500">Demonstration reference only</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase text-slate-500">Account</p>
            <p className="font-semibold text-brand-navy">{demoOrganization.accountStatus}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase text-slate-500">Contract</p>
            <p className="font-semibold text-brand-navy">{demoOrganization.contractStatus}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Total shipments", value: stats.total },
          { label: "In transit", value: stats.inTransit },
          { label: "Delivered", value: stats.delivered },
          { label: "Pending quotations", value: stats.pendingQuotes },
          { label: "Outstanding invoices", value: stats.outstandingInvoices },
          {
            label: "Credit utilization",
            value: demoCreditProfile.connected ? demoCreditProfile.utilizationLabel : "Not connected"
          }
        ].map((item) => (
          <Card key={item.label} className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="font-display text-2xl font-bold text-brand-navy md:text-3xl">{item.value}</p>
            <p className="text-[11px] text-amber-800">Demonstration figure</p>
          </Card>
        ))}
      </div>

      {!demoCreditProfile.connected ? (
        <Card className="border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
          Available credit: Not connected to live finance. Sample illustration: {demoCreditProfile.availableCreditLabel}.
        </Card>
      ) : null}

      <div>
        <h2 className="mb-3 font-semibold text-brand-navy">Operational summary</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {[
            { label: "Pending collection", value: stats.pendingCollection },
            { label: "Processing", value: stats.processing },
            { label: "In transit", value: stats.inTransitExact },
            { label: "Customs", value: stats.customs },
            { label: "Out for delivery", value: stats.outForDelivery },
            { label: "Delivered", value: stats.delivered },
            { label: "Exceptions", value: stats.exceptions }
          ].map((item) => (
            <Card key={item.label} className="space-y-1 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="text-xl font-bold text-brand-navy">{item.value}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-brand-navy">Quick actions</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/corporate/quotations", label: "Request Shipping Quote", icon: FileText },
            { href: "/corporate/create-shipment", label: "Create Shipment", icon: PackagePlus },
            { href: "/corporate/bulk-shipments", label: "Bulk Shipment Request", icon: Layers },
            { href: "/tracking", label: "Track Shipment", icon: Search },
            { href: "/corporate/invoices", label: "View Invoices", icon: Receipt },
            { href: "/corporate/settings", label: "Contact Account Support", icon: LifeBuoy }
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href + label} href={href as never}>
              <Card className="flex h-full items-center gap-2 transition hover:-translate-y-0.5 hover:shadow-md">
                <Icon size={16} className="text-brand-navy" aria-hidden />
                <span className="text-sm font-semibold text-brand-navy">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-brand-navy">Recent shipment activity</h2>
          <Link href={"/corporate/shipments" as never} className="text-sm font-medium text-brand-navy underline-offset-2 hover:underline">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {recent.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <Link
                  href={`/corporate/shipments/${s.trackingNumber}` as never}
                  className="font-mono text-sm font-semibold text-brand-navy hover:underline"
                >
                  {s.trackingNumber}
                </Link>
                <p className="text-xs text-slate-500">
                  {s.origin} → {s.destination} · {s.department}
                </p>
              </div>
              <ShipmentStatusBadge status={s.status} />
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
