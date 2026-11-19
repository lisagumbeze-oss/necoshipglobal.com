"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DemoDataBanner } from "@/components/dashboard/demo-banner";
import { ADMIN_DEMO_NOTICE } from "@/lib/demo/admin-fixtures";
import { SearchField } from "@/components/design-system/ui";
import { hasPermission, type Permission } from "@/lib/rbac";
import { Bell, Shield } from "lucide-react";
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
  type ShellNavGroup,
  type ShellNavItem
} from "@/components/shell/app-chrome";

type AdminNavItem = ShellNavItem & { permission?: Permission };

type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

const adminNavCatalog: AdminNavGroup[] = [
  {
    title: "Command centre",
    items: [
      { label: "Admin overview", href: "/admin/dashboard", exact: true, permission: "reporting.view" },
      { label: "Live operations map", href: "/admin/live-operations", permission: "shipments.view" },
      { label: "Reports & analytics", href: "/admin/reports", permission: "reporting.view" }
    ]
  },
  {
    title: "Logistics operations",
    items: [
      { label: "Ops shipments", href: "/admin/operations/shipments", permission: "shipments.view" },
      { label: "Ops exceptions", href: "/admin/operations/exceptions", permission: "shipments.view" },
      { label: "Ops activities", href: "/admin/operations/activities", permission: "shipments.view" },
      { label: "Ops reports", href: "/admin/operations/reports", permission: "reporting.view" },
      { label: "Dispatch queue", href: "/admin/dispatch/queue", permission: "dispatch.view" },
      { label: "Dispatch routes", href: "/admin/dispatch/routes", permission: "dispatch.view" },
      { label: "Fleet vehicles", href: "/admin/fleet/vehicles", permission: "fleet.view" },
      { label: "Fleet drivers", href: "/admin/fleet/drivers", permission: "fleet.view" },
      { label: "Warehouses", href: "/admin/warehouses", permission: "warehouse.view" },
      { label: "Deliveries", href: "/admin/deliveries", permission: "dispatch.view" }
    ]
  },
  {
    title: "Operational administration",
    items: [
      { label: "Shipments", href: "/admin/shipments", permission: "shipments.view" },
      { label: "Services", href: "/admin/services", permission: "shipments.view" },
      { label: "Locations", href: "/admin/locations", permission: "shipments.view" },
      { label: "Exceptions", href: "/admin/exceptions", permission: "shipments.view" },
      { label: "Warehouse (legacy)", href: "/admin/warehouse", permission: "warehouse.view" },
      { label: "Claims", href: "/admin/claims", permission: "support.manage" },
      { label: "Support desk", href: "/admin/support-desk", permission: "support.manage" }
    ]
  },
  {
    title: "Corporate management",
    items: [
      { label: "Customers", href: "/admin/customers", permission: "customers.view" },
      { label: "Organizations", href: "/admin/organizations", permission: "customers.view" },
      { label: "Staff directory", href: "/admin/staff", permission: "staff.view" },
      { label: "Role catalogue", href: "/admin/roles", permission: "staff.view" },
      { label: "Permissions matrix", href: "/admin/permissions", permission: "staff.view" },
      { label: "Shipping rates", href: "/admin/shipping-rates", permission: "pricing.view" },
      { label: "Rate approvals", href: "/admin/rate-approvals", permission: "pricing.manage" },
      { label: "Contracts", href: "/admin/contracts", permission: "pricing.view" },
      { label: "Content", href: "/admin/content", permission: "content.view" },
      { label: "Notifications", href: "/admin/notifications", permission: "admin.access" }
    ]
  },
  {
    title: "Financial administration",
    items: [
      { label: "Finance dashboard", href: "/admin/finance", permission: "finance.view" },
      { label: "Accounts receivable", href: "/admin/invoices", permission: "finance.view" },
      { label: "Payments", href: "/admin/payments", permission: "finance.view" },
      { label: "Credit accounts", href: "/admin/credit-accounts", permission: "finance.view" },
      { label: "Refunds", href: "/admin/refunds", permission: "finance.view" },
      { label: "Reconciliation", href: "/admin/reconciliation", permission: "finance.manage" }
    ]
  },
  {
    title: "System configuration",
    items: [
      { label: "Audit logs", href: "/admin/audit-logs", permission: "audit.view" },
      { label: "Settings", href: "/admin/settings", permission: "system.configure" },
      { label: "System logs", href: "/admin/system-logs", permission: "audit.view" },
      { label: "Staff & roles (legacy)", href: "/admin/staff-roles", permission: "staff.view" }
    ]
  }
];

function filterAdminNav(staffRole: string | null | undefined): ShellNavGroup[] {
  // Fail open for console entry: middleware already requires admin AppRole.
  // Missing staffRole → show overview only (API still enforces permissions).
  const role = staffRole ?? null;
  return adminNavCatalog
    .map((group) => ({
      title: group.title,
      items: group.items.filter((item) => {
        if (!item.permission) return true;
        if (!role) return item.permission === "reporting.view" || item.href === "/admin/dashboard";
        return hasPermission(role, item.permission);
      })
    }))
    .filter((group) => group.items.length > 0);
}

const bottomItems = [
  { label: "Home", href: "/admin/dashboard", exact: true },
  { label: "Dispatch", href: "/admin/dispatch/queue" },
  { label: "Fleet", href: "/admin/fleet/vehicles" },
  { label: "Finance", href: "/admin/finance" },
  { label: "Reports", href: "/admin/reports" }
];

export function AdminShell({
  children,
  previewMode = false
}: {
  children: React.ReactNode;
  previewMode?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const staffRole = session?.user?.staffRole ?? null;

  const groups = useMemo(() => filterAdminNav(staffRole), [staffRole]);

  const sidebar = (
    <>
      <ShellSidebarBrand
        href="/admin/dashboard"
        dark
        eyebrow={
          <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.14em]">
            <Shield size={12} aria-hidden />
            Super Administrator
          </span>
        }
        meta="Staff access only · No impersonation"
      >
        <BrandLogo variant="lockup-on-dark" size="sm" />
      </ShellSidebarBrand>
      <ShellNavGroups groups={groups} label="Super administrator" tone="dark" />
      <div className="border-t border-white/10 p-4 text-xs text-slate-400">
        Nav visibility uses trusted session role. API authorization remains mandatory.
      </div>
    </>
  );

  return (
    <ShellFrame
      breakClass="xl"
      sidebarWidthClass="xl:grid-cols-[280px_1fr]"
      sidebarClassName="border-slate-800 bg-brand-navy"
      sidebar={sidebar}
      bottomNav={<ShellBottomNav items={bottomItems} breakClass="xl" label="Mobile admin navigation" />}
    >
      <div className="min-w-0">
        <ShellHeader
          breakClass="xl"
          title="Administrator console"
          subtitle={previewMode ? "Development preview — not Production" : "Operational · corporate · financial · system"}
          onOpenNav={() => setMobileOpen(true)}
          actions={
            <>
              <div className="relative hidden min-w-[14rem] flex-1 md:block lg:max-w-sm">
                <SearchField aria-label="Admin global search" placeholder="Tracking, customer, ticket, staff…" />
              </div>
              <Link
                href={"/admin/notifications" as never}
                className="focus-ring inline-flex h-touch w-touch items-center justify-center rounded-input border border-ns-border text-slate-600 hover:bg-brand-surface-muted"
                aria-label="System notifications"
              >
                <Bell size={16} aria-hidden />
              </Link>
              <AccountMenu
                label={session?.user?.name || session?.user?.email || "Staff"}
                description={staffRole ? String(staffRole) : "Administrator"}
                items={[
                  { href: "/admin/settings", label: "Settings" },
                  { href: "/admin/staff", label: "Staff directory" },
                  { href: "/admin/audit-logs", label: "Audit logs" },
                  { href: "/admin/notifications", label: "Notifications" }
                ]}
              />
            </>
          }
        />

        <ShellMobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} dark>
          <ShellDrawerHeader onClose={() => setMobileOpen(false)} dark>
            <BrandLogo variant="lockup-on-dark" size="sm" />
          </ShellDrawerHeader>
          <ShellNavGroups
            groups={groups}
            label="Administrator mobile navigation"
            tone="dark"
            onNavigate={() => setMobileOpen(false)}
          />
        </ShellMobileDrawer>

        <ShellContent className="md:px-5">
          <DemoDataBanner notice={ADMIN_DEMO_NOTICE} />
          {children}
        </ShellContent>
      </div>
    </ShellFrame>
  );
}
