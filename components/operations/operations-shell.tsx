"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DemoDataBanner } from "@/components/dashboard/demo-banner";
import { OPS_DEMO_NOTICE } from "@/lib/demo/operations-fixtures";
import { Truck } from "lucide-react";
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
    title: "Command centre",
    items: [
      { label: "Overview", href: "/operations/dashboard", exact: true },
      { label: "Shipments", href: "/operations/shipments" },
      { label: "Exceptions", href: "/operations/exceptions" },
      { label: "Activities", href: "/operations/activities" },
      { label: "Reports", href: "/operations/reports" }
    ]
  },
  {
    title: "Fleet",
    items: [
      { label: "Vehicles", href: "/fleet/vehicles" },
      { label: "Drivers", href: "/fleet/drivers" },
      { label: "Assignments", href: "/fleet/assignments" },
      { label: "Maintenance", href: "/fleet/maintenance" },
      { label: "Routes", href: "/fleet/routes" }
    ]
  },
  {
    title: "Warehouses",
    items: [
      { label: "Facilities", href: "/warehouses/locations" },
      { label: "Incoming", href: "/warehouses/incoming" },
      { label: "Receiving", href: "/warehouses/receiving" },
      { label: "Inventory / custody", href: "/warehouses/inventory" },
      { label: "Transfers", href: "/warehouses/transfers" },
      { label: "Dispatch prep", href: "/warehouses/dispatch" }
    ]
  },
  {
    title: "Dispatch",
    items: [
      { label: "Queue", href: "/dispatch/queue" },
      { label: "Manifests", href: "/dispatch/manifests" },
      { label: "Routes", href: "/dispatch/routes" },
      { label: "History", href: "/dispatch/history" }
    ]
  },
  {
    title: "Deliveries",
    items: [
      { label: "Overview", href: "/deliveries", exact: true },
      { label: "Assigned", href: "/deliveries/assigned" },
      { label: "Out for delivery", href: "/deliveries/out-for-delivery" },
      { label: "Completed", href: "/deliveries/completed" },
      { label: "Failed / attempts", href: "/deliveries/attempts" }
    ]
  }
];

const bottomItems = [
  { label: "Ops", href: "/operations/dashboard", exact: true },
  { label: "Fleet", href: "/fleet/vehicles" },
  { label: "WH", href: "/warehouses/locations" },
  { label: "Dispatch", href: "/dispatch/queue" },
  { label: "Deliver", href: "/deliveries" }
];

export function OperationsShell({
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
        href="/operations/dashboard"
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <Truck size={14} aria-hidden />
            Logistics operations
          </span>
        }
        meta="Fleet · warehouse · dispatch"
      >
        <BrandLogo variant="horizontal" size="sm" />
      </ShellSidebarBrand>
      <ShellNavGroups groups={navGroups} label="Operations dashboard" />
    </>
  );

  return (
    <ShellFrame
      sidebar={sidebar}
      bottomNav={<ShellBottomNav items={bottomItems} label="Mobile operations navigation" />}
    >
      <div className="min-w-0">
        <ShellHeader
          title="Logistics command centre"
          subtitle={
            previewMode ? "Development preview — not Production" : "Fleet · warehouse · dispatch · deliveries (demo)"
          }
          onOpenNav={() => setMobileOpen(true)}
          actions={
            <AccountMenu
              label="Operations"
              description="Control panel"
              items={[
                { href: "/operations/dashboard", label: "Command centre" },
                { href: "/dispatch/queue", label: "Dispatch queue" },
                { href: "/operations/reports", label: "Reports" }
              ]}
            />
          }
        />

        <ShellMobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <ShellDrawerHeader onClose={() => setMobileOpen(false)}>
            <BrandLogo variant="horizontal" size="sm" />
          </ShellDrawerHeader>
          <ShellNavGroups
            groups={navGroups}
            label="Operations mobile navigation"
            onNavigate={() => setMobileOpen(false)}
          />
        </ShellMobileDrawer>

        <ShellContent className="lg:px-5">
          <DemoDataBanner notice={OPS_DEMO_NOTICE} />
          {children}
        </ShellContent>
      </div>
    </ShellFrame>
  );
}

export { MapWorkspace } from "@/components/shell/app-chrome";
