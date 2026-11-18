"use client";

import { useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DemoDataBanner } from "@/components/dashboard/demo-banner";
import {
  CORPORATE_DEMO_NOTICE,
  CORPORATE_ROLE_LABELS,
  CORPORATE_ROLE_NAV,
  demoOrganization,
  getDemoCorporateSession
} from "@/lib/demo/corporate-fixtures";
import { Building2 } from "lucide-react";
import {
  AccountMenu,
  ShellBottomNav,
  ShellContent,
  ShellDrawerHeader,
  ShellFrame,
  ShellHeader,
  ShellMobileDrawer,
  ShellNavGroups,
  ShellSidebarBrand,
  type ShellNavGroup
} from "@/components/shell/app-chrome";

type NavKey =
  | "overview"
  | "shipments"
  | "create"
  | "bulk"
  | "quotations"
  | "rates"
  | "contracts"
  | "credit"
  | "invoices"
  | "statements"
  | "cost-centres"
  | "employees"
  | "reports"
  | "organization"
  | "settings";

const ALL_NAV: ShellNavGroup[] = [
  {
    title: "Operations",
    items: [
      { label: "Overview", href: "/corporate/dashboard", exact: true },
      { label: "Shipments", href: "/corporate/shipments" },
      { label: "Create shipment", href: "/corporate/create-shipment" },
      { label: "Bulk shipments", href: "/corporate/bulk-shipments" },
      { label: "Quotations", href: "/corporate/quotations" }
    ]
  },
  {
    title: "Commercial",
    items: [
      { label: "Negotiated rates", href: "/corporate/rates" },
      { label: "Contracts", href: "/corporate/contracts" },
      { label: "Credit", href: "/corporate/credit" },
      { label: "Invoices", href: "/corporate/invoices" },
      { label: "Statements", href: "/corporate/statements" }
    ]
  },
  {
    title: "Organization",
    items: [
      { label: "Cost centres", href: "/corporate/cost-centres" },
      { label: "Employees", href: "/corporate/employees" },
      { label: "Reports", href: "/corporate/reports" },
      { label: "Organization", href: "/corporate/organization" },
      { label: "Settings", href: "/corporate/settings" }
    ]
  }
];

const HREF_TO_KEY: Record<string, NavKey> = {
  "/corporate/dashboard": "overview",
  "/corporate/shipments": "shipments",
  "/corporate/create-shipment": "create",
  "/corporate/bulk-shipments": "bulk",
  "/corporate/quotations": "quotations",
  "/corporate/rates": "rates",
  "/corporate/contracts": "contracts",
  "/corporate/credit": "credit",
  "/corporate/invoices": "invoices",
  "/corporate/statements": "statements",
  "/corporate/cost-centres": "cost-centres",
  "/corporate/employees": "employees",
  "/corporate/reports": "reports",
  "/corporate/organization": "organization",
  "/corporate/settings": "settings"
};

const bottomItems = [
  { label: "Home", href: "/corporate/dashboard", exact: true },
  { label: "Shipments", href: "/corporate/shipments" },
  { label: "Rates", href: "/corporate/rates" },
  { label: "Invoices", href: "/corporate/invoices" },
  { label: "Reports", href: "/corporate/reports" }
];

export function CorporateShell({
  children,
  previewMode = false
}: {
  children: React.ReactNode;
  previewMode?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const session = getDemoCorporateSession();
  const roleMeta = CORPORATE_ROLE_NAV[session.role];

  /**
   * Presentation filter: emphasize role-primary destinations.
   * Full route list remains reachable — UI hiding is not security.
   */
  const navGroups = useMemo(() => {
    const primary = new Set(roleMeta.primary);
    return ALL_NAV.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        const key = HREF_TO_KEY[item.href];
        const isPrimary = key ? primary.has(key) : true;
        return {
          ...item,
          label: isPrimary ? item.label : `${item.label}`
        };
      })
    }));
  }, [roleMeta.primary]);

  const sidebar = (
    <>
      <ShellSidebarBrand
        href="/corporate/dashboard"
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <Building2 size={14} aria-hidden />
            Corporate portal
          </span>
        }
        meta={
          <span className="block truncate" title={demoOrganization.tradingName}>
            {demoOrganization.tradingName}
            <span className="mt-0.5 block text-[11px] text-slate-400">
              {CORPORATE_ROLE_LABELS[session.role]} · org-scoped demo
            </span>
            <span className="mt-0.5 block text-[11px] text-slate-400">
              Context is server-validated · no client org switcher
            </span>
          </span>
        }
      >
        <BrandLogo variant="horizontal" size="sm" />
      </ShellSidebarBrand>
      <div className="mx-3 rounded-input border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-950">
        Nav reflects {session.role} presentation only. Routes stay available; APIs enforce access.
      </div>
      <ShellNavGroups groups={navGroups} label="Corporate dashboard" />
    </>
  );

  return (
    <ShellFrame
      sidebar={sidebar}
      bottomNav={<ShellBottomNav items={bottomItems} label="Mobile corporate navigation" />}
    >
      <div className="min-w-0">
        <ShellHeader
          title="Enterprise shipping portal"
          subtitle={
            previewMode
              ? "Development preview — not Production"
              : `${demoOrganization.tradingName} · demonstration workspace`
          }
          onOpenNav={() => setMobileOpen(true)}
          actions={
            <>
              <span className="hidden rounded-badge bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:inline-flex">
                {demoOrganization.accountNumberDemo}
              </span>
              <span className="hidden rounded-badge bg-brand-yellow/30 px-2.5 py-1 text-[11px] font-semibold text-brand-navy md:inline-flex">
                {session.role}
              </span>
              <AccountMenu
                label={demoOrganization.tradingName}
                description={`${CORPORATE_ROLE_LABELS[session.role]} (demo)`}
                items={[
                  { href: "/corporate/organization", label: "Organization profile" },
                  { href: "/corporate/employees", label: "Employees" },
                  { href: "/corporate/invoices", label: "Billing" },
                  { href: "/corporate/settings", label: "Settings" }
                ]}
              />
            </>
          }
        />

        <ShellMobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <ShellDrawerHeader onClose={() => setMobileOpen(false)}>
            <BrandLogo variant="horizontal" size="sm" />
          </ShellDrawerHeader>
          <ShellNavGroups
            groups={navGroups}
            label="Corporate mobile navigation"
            onNavigate={() => setMobileOpen(false)}
          />
        </ShellMobileDrawer>

        <ShellContent>
          <DemoDataBanner notice={CORPORATE_DEMO_NOTICE} />
          {children}
        </ShellContent>
      </div>
    </ShellFrame>
  );
}
