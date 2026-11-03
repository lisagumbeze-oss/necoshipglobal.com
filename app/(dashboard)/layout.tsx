import Link from "next/link";
import { RoleSwitcher } from "@/components/auth/role-switcher";
import { BRAND } from "@/lib/brand";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";
import { Bell, Package, Search } from "lucide-react";

const shippingNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Shipments", href: "/shipments" },
  { label: "Create Shipment", href: "/create-shipment" },
  { label: "Batch Shipments", href: "/batch-shipments" },
  { label: "Templates", href: "/templates" },
  { label: "Recurring", href: "/recurring" },
  { label: "Saved Quotes", href: "/saved-quotes" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Track Package", href: "/tracking" },
  { label: "Address Book", href: "/address-book" }
] as const;

const accountNav = [
  { label: "Billing & Invoices", href: "/billing" },
  { label: "Documents", href: "/documents" },
  { label: "Claims", href: "/claims" },
  { label: "Returns", href: "/returns" },
  { label: "Support", href: "/support-tickets" },
  { label: "Notifications", href: "/notifications" },
  { label: "Organization", href: "/organization" },
  { label: "API Access", href: "/api-access" },
  { label: "Compliance", href: "/compliance" },
  { label: "Settings", href: "/settings" }
] as const;

function NavGroup({
  title,
  items
}: {
  title: string;
  items: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</p>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href as never}
          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-brand-navy"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-20 lg:grid lg:grid-cols-[260px_1fr] lg:pb-0">
      <aside className="hidden border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 px-5 py-5">
          <p className="font-display text-lg font-bold text-brand-navy">{BRAND.name}</p>
          <p className="mt-1 text-xs font-medium text-brand-blue">Shipper workspace</p>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Shipper dashboard">
          <NavGroup title="Shipping" items={shippingNav} />
          <NavGroup title="Account" items={accountNav} />
        </nav>
        <div className="border-t border-slate-100 p-4">
          <Link
            href={"/create-shipment" as never}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-3 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-600"
          >
            <Package size={16} aria-hidden />
            New shipment
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                aria-label="Search shipments"
                placeholder="Search tracking #, recipient, invoice…"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none ring-brand-blue focus:bg-white focus:ring-2"
              />
            </div>
            <Link
              href={"/notifications" as never}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell size={16} />
            </Link>
            <RoleSwitcher />
          </div>
        </header>
        <WelcomeTour />
        <div className="px-4 py-5 md:px-6 md:py-6">{children}</div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile shipper navigation"
      >
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: "Home", href: "/dashboard" },
            { label: "Shipments", href: "/shipments" },
            { label: "Create", href: "/create-shipment" },
            { label: "More", href: "/settings" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              className="rounded-xl px-2 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
