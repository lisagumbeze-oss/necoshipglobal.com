"use client";

import Link from "next/link";
import {
  Button,
  Card,
  ChartContainer,
  KpiCard
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import { DEMO_DATA_NOTICE, demoCustomer, demoNotifications, demoShipments, getDemoOverviewStats } from "@/lib/demo/customer-fixtures";
import { Bell, PackagePlus, Search, FileText, CalendarClock, LifeBuoy, Truck } from "lucide-react";

export default function UserDashboardHomePage() {
  const stats = getDemoOverviewStats();
  const recent = demoShipments.slice(0, 5);
  const active = demoShipments.find((s) =>
    ["IN_TRANSIT", "OUT_FOR_DELIVERY", "PROCESSING", "CUSTOMS_PROCESSING", "COLLECTED"].includes(s.status)
  );
  const notes = demoNotifications.slice(0, 4);
  const chartMax = Math.max(stats.total, 1);

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title={`${greeting()}, ${demoCustomer.name.split(" ")[0]}`}
        description="Individual customer overview. Figures below are demonstration fixtures unless live APIs are connected."
        actions={
          <>
            <Link href={"/create-shipment" as never}>
              <Button>
                <PackagePlus size={16} aria-hidden /> Create Shipment
              </Button>
            </Link>
            <Link href={"/quote" as never}>
              <Button variant="secondary">Get a Quote</Button>
            </Link>
          </>
        }
      />

      <p className="rounded-input border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{DEMO_DATA_NOTICE}</p>

      {/* UI-15: KPI summary row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total shipments" value={stats.total} hint="Demonstration count" tone="info" icon={<Truck size={18} aria-hidden />} />
        <KpiCard label="Pending" value={stats.pending} hint="Awaiting confirmation" tone="warning" />
        <KpiCard label="In progress" value={stats.inTransit} hint="Collected through out for delivery" tone="info" />
        <KpiCard label="Delivered" value={stats.delivered} hint="Completed demonstration records" tone="success" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-4">
          <ChartContainer
            title="Shipment activity"
            description="Status mix from demonstration shipments — not live network volume."
          >
            <div className="space-y-3" role="img" aria-label="Demonstration shipment status breakdown">
              {[
                { label: "Pending", value: stats.pending, tone: "bg-brand-warning" },
                { label: "In progress", value: stats.inTransit, tone: "bg-brand-info" },
                { label: "Delivered", value: stats.delivered, tone: "bg-brand-success" },
                { label: "Quotes open", value: stats.pendingQuotes, tone: "bg-brand-yellow" }
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-brand-navy">{row.label}</span>
                    <span className="ns-meta">{row.value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${row.tone}`}
                      style={{ width: `${Math.max(6, (row.value / chartMax) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>

          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="ns-card-title">Recent shipments</h2>
              <Link href={"/shipments" as never} className="text-sm font-semibold text-brand-navy hover:underline">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ns-border">
                    <th className="ns-table-heading px-2 py-2">Tracking</th>
                    <th className="ns-table-heading px-2 py-2">Lane</th>
                    <th className="ns-table-heading px-2 py-2">Booked</th>
                    <th className="ns-table-heading px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((s) => (
                    <tr key={s.id} className="border-b border-ns-border/70 last:border-0">
                      <td className="px-2 py-2.5">
                        <Link
                          href={`/shipments/${s.trackingNumber}` as never}
                          className="font-mono text-xs font-semibold text-brand-navy hover:underline"
                        >
                          {s.trackingNumber}
                        </Link>
                      </td>
                      <td className="px-2 py-2.5 text-slate-600">
                        {s.origin} → {s.destination}
                      </td>
                      <td className="px-2 py-2.5 text-slate-600">{new Date(s.bookingDate).toLocaleDateString()}</td>
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
          {/* UI-15 tracking overview panel / UI-14 mobile hierarchy cues */}
          <Card className="space-y-3 border-l-4 border-l-brand-yellow">
            <h2 className="ns-card-title">Tracking overview</h2>
            {active ? (
              <>
                <p className="font-mono text-sm font-semibold text-brand-navy">{active.trackingNumber}</p>
                <ShipmentStatusBadge status={active.status} />
                <p className="text-sm text-slate-600">
                  {active.origin} → {active.destination}
                </p>
                <p className="ns-meta">
                  Milestone location: {active.currentLocation ?? "Not available"} · Demo timeline only
                </p>
                <div className="flex h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden>
                  <div className="w-2/3 bg-brand-navy" />
                  <div className="w-1/3 bg-brand-yellow" />
                </div>
                <Link href={`/shipments/${active.trackingNumber}` as never}>
                  <Button variant="secondary" className="w-full">
                    Open shipment detail
                  </Button>
                </Link>
              </>
            ) : (
              <p className="ns-body">No in-progress demonstration shipments right now.</p>
            )}
          </Card>

          <Card className="space-y-2">
            <h2 className="ns-card-title">Shortcuts</h2>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { href: "/create-shipment", label: "Create Shipment", icon: PackagePlus },
                { href: "/quote", label: "Get a Quote", icon: FileText },
                { href: "/tracking", label: "Track Shipment", icon: Search },
                { href: "/pickups", label: "Schedule Pickup", icon: CalendarClock },
                { href: "/support-tickets", label: "Contact Support", icon: LifeBuoy }
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href as never}
                  className="focus-ring flex min-h-touch items-center gap-2 rounded-input border border-ns-border px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-surface-muted"
                >
                  <Icon size={16} aria-hidden />
                  {label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-brand-navy" aria-hidden />
              <h2 className="ns-card-title">Notifications</h2>
            </div>
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n.id} className="rounded-input border border-ns-border px-3 py-2">
                  <p className="text-sm font-semibold text-brand-navy">{n.title}</p>
                  <p className="ns-meta">{n.message}</p>
                </li>
              ))}
            </ul>
            <Link href={"/notifications" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Open notifications
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
