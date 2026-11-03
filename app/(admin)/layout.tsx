import Link from "next/link";
import { RoleSwitcher } from "@/components/auth/role-switcher";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Radio, Search } from "lucide-react";

const overview = [
  { label: "Command Center", href: "/admin" },
  { label: "Live Operations", href: "/admin/live-operations" }
] as const;

const shipments = [
  { label: "All Shipments", href: "/admin/shipments" },
  { label: "Create on Behalf", href: "/admin/shipments/create" },
  { label: "Exceptions", href: "/admin/exceptions" },
  { label: "Customs Queue", href: "/admin/customs" },
  { label: "Pickups", href: "/admin/pickups" }
] as const;

const operations = [
  { label: "Warehouse / WMS", href: "/admin/warehouse" },
  { label: "Manifests / EOD", href: "/admin/manifests" },
  { label: "Carriers", href: "/admin/carriers" },
  { label: "Drivers & Agents", href: "/admin/drivers" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Support", href: "/admin/support" },
  { label: "SLA", href: "/admin/sla" },
  { label: "Sanctions", href: "/admin/screening" }
] as const;

const commercial = [
  { label: "Finance", href: "/admin/finance" },
  { label: "Refunds", href: "/admin/refunds" },
  { label: "Rate Cards", href: "/admin/rate-cards" },
  { label: "Rate Rules", href: "/admin/rate-rules" },
  { label: "Label Profiles", href: "/admin/label-profiles" },
  { label: "Promotions", href: "/admin/promotions" },
  { label: "CMS", href: "/admin/cms" }
] as const;

const system = [
  { label: "Staff & Roles", href: "/admin/staff-roles" },
  { label: "System Logs", href: "/admin/system-logs" }
] as const;

function AdminNavGroup({
  title,
  items
}: {
  title: string;
  items: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{title}</p>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href as never}
          className="block rounded-md px-3 py-1.5 text-[13px] text-slate-200 transition hover:bg-white/10 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F3F6FA] text-brand-navy xl:grid xl:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-slate-800 bg-brand-navy xl:flex xl:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href={"/admin" as never} aria-label="Neco Ship Global admin">
            <BrandLogo variant="lockup-on-dark" size="sm" />
          </Link>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-yellow">Operations console</p>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Admin dashboard">
          <AdminNavGroup title="Overview" items={overview} />
          <AdminNavGroup title="Shipments" items={shipments} />
          <AdminNavGroup title="Operations" items={operations} />
          <AdminNavGroup title="Commercial" items={commercial} />
          <AdminNavGroup title="System" items={system} />
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-slate-400">
          Staff access only · Audit logging on
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              <Radio size={12} aria-hidden />
              Live
            </span>
            <div className="relative min-w-[220px] flex-1">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                aria-label="Admin global search"
                placeholder="Tracking, customer, ticket, staff…"
                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-brand-navy outline-none placeholder:text-slate-400 focus:border-brand-yellow focus:bg-white"
              />
            </div>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Impersonate
            </button>
            <RoleSwitcher />
          </div>
        </header>
        <div className="px-4 py-4 md:px-5 md:py-5">{children}</div>
      </div>
    </div>
  );
}
