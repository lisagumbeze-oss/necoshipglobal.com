"use client";

import Link from "next/link";
import { Badge, Button, Card, ChartContainer, KpiCard } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import { MapWorkspace } from "@/components/shell/app-chrome";
import {
  demoDeliveries,
  demoExceptions,
  demoManifests,
  demoOpsEvents,
  demoOpsShipments,
  demoVehicles,
  demoWarehouses,
  getOpsOverviewStats
} from "@/lib/demo/operations-fixtures";
import { EXCEPTION_STATUS_CONFIG, OPS_SHIPMENT_PHASE_CONFIG } from "@/lib/demo/operations-status";
import {
  AlertTriangle,
  Map as MapIcon,
  Package,
  Truck,
  Warehouse
} from "lucide-react";

export function OperationsDashboardView() {
  const stats = getOpsOverviewStats();
  const recent = demoOpsShipments.slice(0, 6);
  const openExceptions = demoExceptions.filter((e) => !["RESOLVED", "CLOSED"].includes(e.status));
  const alerts = demoOpsEvents
    .filter((e) =>
      ["Exception Recorded", "Delivery Attempted", "Ready for Dispatch", "Out for Delivery"].includes(e.category)
    )
    .slice(0, 5);
  const chartMax = Math.max(stats.total, 1);

  const phaseRows = [
    { label: "Awaiting collection", value: stats.awaitingCollection, tone: "bg-slate-400" },
    { label: "Processing", value: stats.processing, tone: "bg-brand-warning" },
    { label: "Ready for dispatch", value: stats.readyDispatch, tone: "bg-brand-yellow" },
    { label: "In transit", value: stats.inTransit, tone: "bg-brand-info" },
    { label: "Out for delivery", value: stats.outForDelivery, tone: "bg-brand-warning" },
    { label: "Delivered", value: stats.delivered, tone: "bg-brand-success" },
    { label: "Delayed / exception", value: stats.delayed + stats.exceptions, tone: "bg-brand-danger" }
  ];

  return (
    <section className="mx-auto max-w-ns-xl space-y-6">
      <DashboardPageHeader
        title="Operations control tower"
        description="UI-44 logistics command overview. Demonstration fixtures only — partner carriers are not claimed as NECO-owned assets."
        actions={
          <>
            <Link href={"/admin/dispatch/queue" as never}>
              <Button>Dispatch queue</Button>
            </Link>
            <Link href={"/admin/operations/exceptions" as never}>
              <Button variant="secondary">Exceptions</Button>
            </Link>
          </>
        }
      />

      <OpsDemoNote title="No live GPS or telemetry">
        <p>
          Map panels remain placeholders until operational feeds are connected. Figures below are labelled
          demonstration counts — not live network volume. This control tower is part of the unified Admin console.
        </p>
      </OpsDemoNote>

      {/* Operational status cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active shipments" value={stats.total} hint="Demonstration count" tone="info" icon={<Package size={18} aria-hidden />} />
        <KpiCard label="Ready for dispatch" value={stats.readyDispatch} hint="Facility staging" tone="warning" />
        <KpiCard label="Open exceptions" value={stats.openExceptionCases} hint="Requires attention" tone="danger" icon={<AlertTriangle size={18} aria-hidden />} />
        <KpiCard
          label="Fleet available"
          value={`${stats.vehiclesAvailable}/${stats.vehiclesTotal}`}
          hint={`${stats.vehiclesAssigned} assigned (demo)`}
          tone="success"
          icon={<Truck size={18} aria-hidden />}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Manifests ready" value={stats.manifestsReady} hint={`${stats.manifestsDeparted} departed (demo)`} tone="info" />
        <KpiCard label="Warehouse backlog" value={stats.warehouseAwaiting} hint="Processing + dispatch prep" tone="warning" icon={<Warehouse size={18} aria-hidden />} />
        <KpiCard label="Out for delivery" value={stats.outForDelivery} hint="Last-mile sample" tone="warning" />
        <KpiCard label="Maintenance due" value={stats.maintenanceDue} hint="Schedule fixtures" tone="default" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr]">
        <ChartContainer
          title="Shipment activity"
          description="Phase mix for demonstration shipments — not live operational volume."
        >
          <div className="space-y-3" role="img" aria-label="Demonstration shipment phase distribution">
            {phaseRows.map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-brand-navy">{row.label}</span>
                  <span className="ns-meta">{row.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${row.tone}`}
                    style={{ width: `${Math.max(row.value ? 8 : 0, (row.value / chartMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <Card className="space-y-3 border-l-4 border-l-brand-danger">
          <div className="flex items-center justify-between gap-2">
            <h2 className="ns-card-title">Exception queue</h2>
            <Link href={"/admin/operations/exceptions" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Manage
            </Link>
          </div>
          {openExceptions.length === 0 ? (
            <p className="ns-body">No open demonstration exceptions.</p>
          ) : (
            <ul className="space-y-2">
              {openExceptions.slice(0, 5).map((ex) => (
                <li key={ex.id} className="rounded-input border border-ns-border px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/admin/operations/exceptions/${ex.id}` as never}
                      className="font-mono font-semibold text-brand-navy hover:underline"
                    >
                      {ex.reference}
                    </Link>
                    <OpsStatusBadge
                      label={EXCEPTION_STATUS_CONFIG[ex.status].label}
                      tone={EXCEPTION_STATUS_CONFIG[ex.status].tone}
                    />
                  </div>
                  <p className="mt-1 text-slate-600">{ex.summary}</p>
                  <p className="ns-meta mt-1">
                    {ex.priority} · {ex.department}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* UI-32 style map/detail split — non-live placeholder */}
      <MapWorkspace
        list={
          <div className="space-y-3 p-4">
            <h2 className="ns-card-title">Dispatch summary</h2>
            <p className="ns-meta">UI-26 board preview — not live assignment mutations.</p>
            <ul className="space-y-2 text-sm">
              {demoManifests.slice(0, 5).map((m) => (
                <li key={m.id} className="rounded-input border border-ns-border px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-brand-navy">{m.reference}</p>
                    <Badge tone={m.status === "READY" ? "warning" : m.status === "DEPARTED" ? "success" : "default"}>
                      {m.status}
                    </Badge>
                  </div>
                  <p className="ns-meta mt-1">
                    {m.departureLocation} → {m.destination} · {m.packageCount} pkgs
                  </p>
                </li>
              ))}
            </ul>
            <Link href={"/admin/dispatch/queue" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Open dispatch board
            </Link>
          </div>
        }
        map={
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-3 p-6 text-center">
            <MapIcon className="text-brand-navy/40" size={36} aria-hidden />
            <p className="ns-card-title">Map workspace (non-live)</p>
            <p className="ns-body max-w-sm">
              Honest placeholder for Mapbox when configured. No simulated GPS movement or live vehicle pins are shown.
            </p>
            <Link href={"/admin/dispatch/routes" as never}>
              <Button variant="secondary" size="sm">
                Route plans
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="ns-card-title">Fleet availability</h2>
            <Link href={"/admin/fleet/vehicles" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Fleet
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {demoVehicles.slice(0, 4).map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 rounded-input border border-ns-border px-3 py-2">
                <div>
                  <p className="font-mono font-semibold text-brand-navy">{v.reference}</p>
                  <p className="ns-meta">{v.category}</p>
                </div>
                <Badge tone={v.status === "AVAILABLE" ? "success" : "warning"}>{v.status.replaceAll("_", " ")}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="ns-card-title">Warehouse activity</h2>
            <Link href={"/admin/warehouses/dispatch" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Loading
            </Link>
          </div>
          {demoWarehouses.map((w) => (
            <div key={w.code} className="rounded-input border border-ns-border px-3 py-2 text-sm">
              <p className="font-semibold text-brand-navy">
                {w.code} · {w.name}
              </p>
              <p className="ns-meta">
                Processing {w.awaitingProcessing} · Dispatch {w.awaitingDispatch} (demo)
              </p>
            </div>
          ))}
          <p className="ns-meta">
            Staging {stats.stagingPackages} · Loaded {stats.loadedPackages} (custody fixtures)
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="ns-card-title">Operational alerts</h2>
            <Link href={"/admin/operations/activities" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              Timeline
            </Link>
          </div>
          <ul className="space-y-2">
            {alerts.map((e) => (
              <li key={e.id} className="rounded-input border border-ns-border px-3 py-2 text-sm">
                <p className="font-medium text-brand-navy">{e.category}</p>
                <p className="ns-meta">
                  {e.trackingNumber} · {e.location}
                </p>
                <p className="ns-meta">{new Date(e.at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="ns-card-title">Recent operational events</h2>
            <Link href={"/admin/operations/activities" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              All activity
            </Link>
          </div>
          <ul className="divide-y divide-ns-border text-sm">
            {demoOpsEvents.slice(0, 6).map((e) => (
              <li key={e.id} className="py-2.5">
                <p className="font-medium text-brand-navy">{e.category}</p>
                <p className="ns-meta">
                  {e.trackingNumber} · {e.location} · {new Date(e.at).toLocaleString()}
                </p>
                <p className="mt-1 text-slate-600">{e.notes}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="ns-card-title">Shipment activity board</h2>
            <Link href={"/admin/operations/shipments" as never} className="text-sm font-semibold text-brand-navy hover:underline">
              All shipments
            </Link>
          </div>
          <ul className="divide-y divide-ns-border">
            {recent.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <div>
                  <Link
                    href={`/admin/operations/shipments/${s.trackingNumber}` as never}
                    className="font-mono font-semibold text-brand-navy hover:underline"
                  >
                    {s.trackingNumber}
                  </Link>
                  <p className="ns-meta">
                    {s.origin} → {s.destination}
                  </p>
                </div>
                <OpsStatusBadge
                  label={OPS_SHIPMENT_PHASE_CONFIG[s.phase].label}
                  tone={OPS_SHIPMENT_PHASE_CONFIG[s.phase].tone}
                />
              </li>
            ))}
          </ul>
          <p className="ns-meta">
            Deliveries sample: {demoDeliveries.filter((d) => d.status === "OUT_FOR_DELIVERY").length} out for delivery ·{" "}
            {demoDeliveries.filter((d) => d.status === "DELIVERED").length} delivered (demo)
          </p>
        </Card>
      </div>
    </section>
  );
}
