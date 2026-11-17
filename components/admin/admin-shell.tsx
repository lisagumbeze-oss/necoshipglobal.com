"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DemoDataBanner } from "@/components/dashboard/demo-banner";
import { ADMIN_DEMO_NOTICE } from "@/lib/demo/admin-fixtures";
import { Menu, Search, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const overview = [
  { label: "Executive dashboard", href: "/admin/dashboard" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Live operations", href: "/admin/live-operations" }
] as const;

const people = [
  { label: "Customers", href: "/admin/customers" },
  { label: "Organizations", href: "/admin/organizations" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Roles", href: "/admin/roles" },
  { label: "Permissions", href: "/admin/permissions" }
] as const;

const network = [
  { label: "Shipments", href: "/admin/shipments" },
  { label: "Services", href: "/admin/services" },
  { label: "Locations", href: "/admin/locations" },
  { label: "Exceptions", href: "/admin/exceptions" },
  { label: "Warehouse", href: "/admin/warehouse" }
] as const;

const commercial = [
  { label: "Shipping rates", href: "/admin/shipping-rates" },
  { label: "Rate approvals", href: "/admin/rate-approvals" },
  { label: "Contracts", href: "/admin/contracts" },
  { label: "Finance overview", href: "/admin/finance" },
  { label: "Invoices", href: "/admin/invoices" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Credit accounts", href: "/admin/credit-accounts" },
  { label: "Refunds", href: "/admin/refunds" },
  { label: "Reconciliation", href: "/admin/reconciliation" }
] as const;

const support = [
  { label: "Claims", href: "/admin/claims" },
  { label: "Support", href: "/admin/support-desk" },
  { label: "Notifications", href: "/admin/notifications" },
  { label: "Content", href: "/admin/content" }
] as const;

const system = [
  { label: "Audit logs", href: "/admin/audit-logs" },
  { label: "Settings", href: "/admin/settings" },
  { label: "System logs", href: "/admin/system-logs" },
  { label: "Staff & roles (legacy)", href: "/admin/staff-roles" }
] as const;

function NavLink({ href, label, onNavigate }: { href: string; label: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href as never}
      onClick={onNavigate}
      className={cn(
        "block rounded-md px-3 py-1.5 text-[13px] transition",
        active ? "bg-white/15 text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"
      )}
    >
      {label}
    </Link>
  );
}

function NavGroups({ onNavigate }: { onNavigate?: () => void }) {
  const groups = [
    { title: "Overview", items: overview },
    { title: "People", items: people },
    { title: "Network", items: network },
    { title: "Commercial", items: commercial },
    { title: "Support & content", items: support },
    { title: "System", items: system }
  ];
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Super administrator">
      {groups.map((g) => (
        <div key={g.title} className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{g.title}</p>
          {g.items.map((item) => (
            <NavLink key={item.href} {...item} onNavigate={onNavigate} />
          ))}
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({
  children,
  previewMode = false
}: {
  children: React.ReactNode;
  previewMode?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F6FA] pb-20 text-brand-navy xl:grid xl:grid-cols-[280px_1fr] xl:pb-0">
      <aside className="hidden border-r border-slate-800 bg-brand-navy xl:flex xl:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href={"/admin/dashboard" as never} aria-label="Neco Ship Global admin">
            <BrandLogo variant="lockup-on-dark" size="sm" />
          </Link>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-yellow">
            <Shield size={12} aria-hidden />
            Super Administrator
          </p>
        </div>
        <NavGroups />
        <div className="border-t border-white/10 p-4 text-xs text-slate-400">Staff access only · No impersonation</div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 xl:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-navy">Platform management</p>
              <p className="truncate text-xs text-slate-500">
                {previewMode ? "Development preview — not Production" : "Demonstration administrator workspace"}
              </p>
            </div>
            <div className="relative hidden min-w-[220px] flex-1 md:block">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                aria-label="Admin global search"
                placeholder="Tracking, customer, ticket, staff…"
                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-brand-navy outline-none placeholder:text-slate-400 focus:border-brand-yellow focus:bg-white"
              />
            </div>
          </div>
        </header>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 xl:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40"
              aria-label="Close navigation overlay"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[300px] flex-col bg-brand-navy text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <BrandLogo variant="lockup-on-dark" size="sm" />
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
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

        <div className="space-y-4 px-4 py-4 md:px-5 md:py-5">
          <DemoDataBanner notice={ADMIN_DEMO_NOTICE} />
          {children}
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur xl:hidden"
        aria-label="Mobile admin navigation"
      >
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: "Home", href: "/admin/dashboard" },
            { label: "Customers", href: "/admin/customers" },
            { label: "Shipments", href: "/admin/shipments" },
            { label: "Finance", href: "/admin/finance" },
            { label: "Reports", href: "/admin/reports" }
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
