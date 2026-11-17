"use client";

import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import {
  demoCustomer,
  demoNotifications,
  demoShipments,
  getDemoOverviewStats
} from "@/lib/demo/customer-fixtures";
import { Bell, PackagePlus, Search, Truck, FileText, CalendarClock, LifeBuoy } from "lucide-react";

export default function UserDashboardHomePage() {
  const stats = getDemoOverviewStats();
  const recent = demoShipments.slice(0, 4);
  const notes = demoNotifications.slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <DashboardPageHeader
        title={`${greeting()}, ${demoCustomer.name.split(" ")[0]}`}
        description="Individual customer overview using demonstration shipments, quotations and notifications."
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

      <Card className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile summary</p>
          <p className="mt-1 font-semibold text-brand-navy">{demoCustomer.name}</p>
          <p className="text-sm text-slate-600">{demoCustomer.email}</p>
          <p className="text-sm text-slate-600">
            {demoCustomer.city}, {demoCustomer.country} · {demoCustomer.accountType}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          Sample profile for UI development. Not a live Production customer record.
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total shipments", value: stats.total },
          { label: "Pending", value: stats.pending },
          { label: "In transit", value: stats.inTransit },
          { label: "Delivered", value: stats.delivered },
          { label: "Pending quotations", value: stats.pendingQuotes }
        ].map((item) => (
          <Card key={item.label} className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="font-display text-3xl font-bold text-brand-navy">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { href: "/create-shipment", label: "Create Shipment", icon: PackagePlus },
          { href: "/quote", label: "Get a Quote", icon: FileText },
          { href: "/tracking", label: "Track Shipment", icon: Search },
          { href: "/pickups", label: "Schedule Pickup", icon: CalendarClock },
          { href: "/support-tickets", label: "Contact Support", icon: LifeBuoy }
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href as never}>
            <Card className="flex h-full items-center gap-2 transition hover:-translate-y-0.5 hover:shadow-md">
              <Icon size={16} className="text-brand-navy" aria-hidden />
              <span className="text-sm font-semibold text-brand-navy">{label}</span>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold text-brand-navy">Recent shipment activity</h2>
            <Link href={"/shipments" as never} className="text-xs font-semibold text-brand-navy hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {recent.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <div>
                  <Link href={`/shipments/${s.trackingNumber}` as never} className="font-mono text-sm font-semibold text-brand-navy hover:underline">
                    {s.trackingNumber}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {s.origin} → {s.destination}
                  </p>
                </div>
                <ShipmentStatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-brand-navy" aria-hidden />
            <h2 className="font-semibold text-brand-navy">Recent notifications</h2>
          </div>
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-xl border border-slate-200 px-3 py-2">
                <p className="text-sm font-semibold text-brand-navy">{n.title}</p>
                <p className="text-xs text-slate-600">{n.message}</p>
              </li>
            ))}
          </ul>
          <Link href={"/notifications" as never} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:underline">
            <Truck size={14} aria-hidden /> Open notifications
          </Link>
        </Card>
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
