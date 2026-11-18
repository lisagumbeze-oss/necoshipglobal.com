"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DemoDataBanner } from "@/components/dashboard/demo-banner";
import { Bell, Package } from "lucide-react";
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

const navGroups: ShellNavGroup[] = [
  {
    title: "Shipping",
    items: [
      { label: "Overview", href: "/dashboard", exact: true },
      { label: "My Shipments", href: "/shipments" },
      { label: "New Shipment", href: "/create-shipment" },
      { label: "Request a Quote", href: "/saved-quotes" },
      { label: "Track Shipment", href: "/tracking" },
      { label: "Pickup Requests", href: "/pickups" },
      { label: "Address Book", href: "/address-book" }
    ]
  },
  {
    title: "Account",
    items: [
      { label: "Invoices", href: "/billing" },
      { label: "Payment History", href: "/payments" },
      { label: "Claims", href: "/claims" },
      { label: "Support", href: "/support-tickets" },
      { label: "Notifications", href: "/notifications" },
      { label: "Account Settings", href: "/settings" }
    ]
  }
];

const bottomItems = [
  { label: "Home", href: "/dashboard", exact: true },
  { label: "Shipments", href: "/shipments" },
  { label: "Quote", href: "/saved-quotes" },
  { label: "Support", href: "/support-tickets" },
  { label: "Account", href: "/settings" }
];

export function CustomerShell({
  children,
  previewMode = false
}: {
  children: React.ReactNode;
  previewMode?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <>
      <ShellSidebarBrand
        href="/dashboard"
        eyebrow="Individual customer portal"
        meta="Ship, track and manage your parcels"
      >
        <BrandLogo variant="horizontal" size="sm" />
      </ShellSidebarBrand>
      <ShellNavGroups groups={navGroups} label="Customer dashboard" />
      <div className="border-t border-ns-border p-4">
        <Link
          href={"/create-shipment" as never}
          className="focus-ring flex min-h-touch items-center justify-center gap-2 rounded-button bg-brand-yellow px-3 text-sm font-semibold text-brand-navy hover:brightness-95"
        >
          <Package size={16} aria-hidden />
          New shipment
        </Link>
      </div>
    </>
  );

  return (
    <ShellFrame
      sidebar={sidebar}
      sidebarWidthClass="lg:grid-cols-[260px_1fr]"
      bottomNav={<ShellBottomNav items={bottomItems} label="Mobile customer navigation" />}
    >
      <div className="min-w-0">
        <ShellHeader
          title="Customer dashboard"
          subtitle={previewMode ? "Development preview — not Production" : "Demonstration workspace"}
          onOpenNav={() => setMobileOpen(true)}
          actions={
            <>
              <Link
                href={"/notifications" as never}
                className="focus-ring inline-flex h-touch w-touch items-center justify-center rounded-input border border-ns-border text-slate-600 hover:bg-brand-surface-muted"
                aria-label="Notifications"
              >
                <Bell size={16} aria-hidden />
              </Link>
              <AccountMenu
                label="Account"
                description="Customer"
                items={[
                  { href: "/settings", label: "Account settings" },
                  { href: "/billing", label: "Billing" },
                  { href: "/support-tickets", label: "Support" },
                  { href: "/notifications", label: "Notifications" }
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
            label="Customer mobile navigation"
            onNavigate={() => setMobileOpen(false)}
          />
        </ShellMobileDrawer>

        <ShellContent>
          <DemoDataBanner />
          {children}
        </ShellContent>
      </div>
    </ShellFrame>
  );
}
