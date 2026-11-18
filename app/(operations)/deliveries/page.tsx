"use client";

import Link from "next/link";
import { Card, DataTable, KpiCard } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import { demoDeliveries, demoDrivers, demoVehicles, type DemoDelivery } from "@/lib/demo/operations-fixtures";
import { DELIVERY_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function DeliveriesOverviewPage() {
  const counts = {
    pending: demoDeliveries.filter((d) => d.status === "PENDING").length,
    assigned: demoDeliveries.filter((d) => d.status === "ASSIGNED").length,
    out: demoDeliveries.filter((d) => d.status === "OUT_FOR_DELIVERY").length,
    delivered: demoDeliveries.filter((d) => d.status === "DELIVERED").length,
    failed: demoDeliveries.filter((d) => d.status === "FAILED_ATTEMPT").length,
    rescheduled: demoDeliveries.filter((d) => d.status === "RESCHEDULED").length,
    exception: demoDeliveries.filter((d) => d.status === "EXCEPTION").length
  };

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Delivery management"
        description="Last-mile demonstration board aligned with UI-37 hierarchy. Recipient details remain restricted labels."
      />

      <OpsDemoNote title="No fabricated delivery confirmations">
        <p>Status counts and rows are demonstration fixtures. Open a delivery for route timeline and POD state.</p>
      </OpsDemoNote>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Pending" value={counts.pending} hint="Demonstration" tone="default" />
        <KpiCard label="Assigned" value={counts.assigned} hint="Demonstration" tone="info" />
        <KpiCard label="Out for delivery" value={counts.out} hint="Demonstration" tone="warning" />
        <KpiCard label="Delivered" value={counts.delivered} hint="Fixture evidence only" tone="success" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Failed attempts" value={counts.failed} hint="Demonstration" tone="danger" />
        <KpiCard label="Rescheduled" value={counts.rescheduled} hint="Demonstration" tone="warning" />
        <KpiCard label="Exceptions" value={counts.exception} hint="Demonstration" tone="danger" />
      </div>

      <Card className="flex flex-wrap gap-2 text-sm">
        {[
          { href: "/deliveries/assigned", label: "Assigned" },
          { href: "/deliveries/out-for-delivery", label: "Out for delivery" },
          { href: "/deliveries/completed", label: "Completed" },
          { href: "/deliveries/attempts", label: "Attempts" },
          { href: "/deliveries/failed", label: "Failed" }
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href as never}
            className="focus-ring rounded-input border border-ns-border px-3 py-2 font-semibold text-brand-navy hover:bg-brand-surface-muted"
          >
            {item.label}
          </Link>
        ))}
      </Card>

      <DataTable<DemoDelivery>
        rows={demoDeliveries}
        rowKey={(row) => row.id}
        columns={[
          {
            id: "reference",
            header: "Reference",
            cell: (d) => (
              <Link
                href={`/deliveries/${d.id}` as never}
                className="font-mono text-xs font-semibold text-brand-navy hover:underline"
              >
                {d.reference}
              </Link>
            )
          },
          { id: "tracking", header: "Shipment", cell: (d) => <span className="font-mono text-xs">{d.trackingNumber}</span> },
          { id: "address", header: "Address", cell: (d) => d.address },
          {
            id: "driver",
            header: "Driver",
            cell: (d) => demoDrivers.find((x) => x.id === d.driverId)?.name ?? "—"
          },
          {
            id: "vehicle",
            header: "Vehicle",
            cell: (d) => demoVehicles.find((x) => x.id === d.vehicleId)?.reference ?? "—"
          },
          { id: "scheduled", header: "Scheduled", cell: (d) => d.scheduledDate },
          {
            id: "status",
            header: "Status",
            cell: (d) => (
              <OpsStatusBadge
                label={DELIVERY_STATUS_CONFIG[d.status].label}
                tone={DELIVERY_STATUS_CONFIG[d.status].tone}
              />
            )
          }
        ]}
      />
    </section>
  );
}
