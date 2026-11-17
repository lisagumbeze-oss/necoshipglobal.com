"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DemoDataBanner } from "@/components/dashboard/demo-banner";
import { Bell, Menu, Package, X } from "lucide-react";
import { cn } from "@/lib/utils";

const shippingNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Shipments", href: "/shipments" },
  { label: "New Shipment", href: "/create-shipment" },
  { label: "Request a Quote", href: "/saved-quotes" },
  { label: "Track Shipment", href: "/tracking" },
  { label: "Pickup Requests", href: "/pickups" },
  { label: "Address Book", href: "/address-book" }
] as const;

const accountNav = [
  { label: "Invoices", href: "/billing" },
  { label: "Payment History", href: "/payments" },
  { label: "Claims", href: "/claims" },
  { label: "Support", href: "/support-tickets" },
  { label: "Notifications", href: "/notifications" },
  { label: "Account Settings", href: "/settings" }
] as const;

function NavLink({ href, label, onNavigate }: { href: string; label: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
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
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Customer dashboard">
      <div className="space-y-1">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Shipping</p>
        {shippingNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </div>
      <div className="space-y-1">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Account</p>
        {accountNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-surface pb-20 lg:grid lg:grid-cols-[260px_1fr] lg:pb-0">
      <aside className="hidden border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 px-5 py-5">
          <Link href={"/dashboard" as never} aria-label="Neco Ship Global dashboard">
            <BrandLogo variant="horizontal" size="sm" />
          </Link>
          <p className="mt-2 text-xs font-medium text-brand-navy/70">Individual customer portal</p>
        </div>
        <NavGroups />
        <div className="border-t border-slate-100 p-4">
          <Link
            href={"/create-shipment" as never}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-yellow px-3 py-2.5 text-sm font-semibold text-brand-navy hover:brightness-95"
          >
            <Package size={16} aria-hidden />
            New shipment
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-navy">Customer dashboard</p>
              <p className="truncate text-xs text-slate-500">Demonstration workspace</p>
            </div>
            <Link
              href={"/notifications" as never}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell size={16} />
            </Link>
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
            <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-white shadow-xl">
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
          <DemoDataBanner />
          {children}
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile customer navigation"
      >
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: "Home", href: "/dashboard" },
            { label: "Shipments", href: "/shipments" },
            { label: "Quote", href: "/saved-quotes" },
            { label: "Support", href: "/support-tickets" },
            { label: "Account", href: "/settings" }
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
