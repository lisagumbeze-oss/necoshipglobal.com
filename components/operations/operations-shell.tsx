"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DemoDataBanner } from "@/components/dashboard/demo-banner";
import { OPS_DEMO_NOTICE } from "@/lib/demo/operations-fixtures";
import { Menu, X, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const operationsNav = [
  { label: "Overview", href: "/operations/dashboard" },
  { label: "Shipments", href: "/operations/shipments" },
  { label: "Exceptions", href: "/operations/exceptions" },
  { label: "Activities", href: "/operations/activities" },
  { label: "Reports", href: "/operations/reports" }
] as const;

const fleetNav = [
  { label: "Vehicles", href: "/fleet/vehicles" },
  { label: "Drivers", href: "/fleet/drivers" },
  { label: "Assignments", href: "/fleet/assignments" },
  { label: "Maintenance", href: "/fleet/maintenance" },
  { label: "Routes", href: "/fleet/routes" }
] as const;

const warehouseNav = [
  { label: "Facilities", href: "/warehouses/locations" },
  { label: "Incoming", href: "/warehouses/incoming" },
  { label: "Receiving", href: "/warehouses/receiving" },
  { label: "Inventory / custody", href: "/warehouses/inventory" },
  { label: "Transfers", href: "/warehouses/transfers" },
  { label: "Dispatch prep", href: "/warehouses/dispatch" }
] as const;

const dispatchNav = [
  { label: "Queue", href: "/dispatch/queue" },
  { label: "Manifests", href: "/dispatch/manifests" },
  { label: "Routes", href: "/dispatch/routes" },
  { label: "History", href: "/dispatch/history" }
] as const;

const deliveryNav = [
  { label: "Overview", href: "/deliveries" },
  { label: "Assigned", href: "/deliveries/assigned" },
  { label: "Out for delivery", href: "/deliveries/out-for-delivery" },
  { label: "Completed", href: "/deliveries/completed" },
  { label: "Failed / attempts", href: "/deliveries/attempts" }
] as const;

function NavLink({ href, label, onNavigate }: { href: string; label: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href as never}
      onClick={onNavigate}
      className={cn(
        "block rounded-lg px-3 py-2 text-sm font-medium transition",
        active ? "bg-yellow-50 text-brand-navy" : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
      )}
    >
      {label}
    </Link>
  );
}

function NavGroups({ onNavigate }: { onNavigate?: () => void }) {
  const groups = [
    { title: "Operations", items: operationsNav },
    { title: "Fleet", items: fleetNav },
    { title: "Warehouses", items: warehouseNav },
    { title: "Dispatch", items: dispatchNav },
    { title: "Deliveries", items: deliveryNav }
  ];
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Operations dashboard">
      {groups.map((g) => (
        <div key={g.title} className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{g.title}</p>
          {g.items.map((item) => (
            <NavLink key={item.href} {...item} onNavigate={onNavigate} />
          ))}
        </div>
      ))}
    </nav>
  );
}

export function OperationsShell({
  children,
  previewMode = false
}: {
  children: React.ReactNode;
  previewMode?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-surface pb-20 lg:grid lg:grid-cols-[280px_1fr] lg:pb-0">
      <aside className="hidden border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 px-5 py-5">
          <Link href={"/operations/dashboard" as never} aria-label="Neco Ship Global operations">
            <BrandLogo variant="horizontal" size="sm" />
          </Link>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-navy/70">
            <Truck size={14} aria-hidden />
            Logistics operations
          </p>
        </div>
        <NavGroups />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-navy">Fleet & warehouse operations</p>
              <p className="truncate text-xs text-slate-500">
                {previewMode ? "Development preview — not Production" : "Internal demonstration workspace"}
              </p>
            </div>
          </div>
        </header>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40"
              aria-label="Close navigation overlay"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[300px] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <BrandLogo variant="horizontal" size="sm" />
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-50"
                  aria-label="Close navigation"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <NavGroups onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="space-y-4 px-4 py-5 md:px-6 md:py-6">
          <DemoDataBanner notice={OPS_DEMO_NOTICE} />
          {children}
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile operations navigation"
      >
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: "Ops", href: "/operations/dashboard" },
            { label: "Fleet", href: "/fleet/vehicles" },
            { label: "WH", href: "/warehouses/locations" },
            { label: "Dispatch", href: "/dispatch/queue" },
            { label: "Deliver", href: "/deliveries" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              className="flex min-h-11 flex-col items-center justify-center rounded-xl px-1 py-2 text-center text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
