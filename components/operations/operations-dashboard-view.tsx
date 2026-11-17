"use client";

import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import {
  demoExceptions,
  demoManifests,
  demoOpsEvents,
  demoOpsShipments,
  demoWarehouses,
  getOpsOverviewStats
} from "@/lib/demo/operations-fixtures";
import { OPS_SHIPMENT_PHASE_CONFIG } from "@/lib/demo/operations-status";
import { EXCEPTION_STATUS_CONFIG } from "@/lib/demo/operations-status";

export function OperationsDashboardView() {
  const stats = getOpsOverviewStats();
  const recent = demoOpsShipments.slice(0, 6);
  const openExceptions = demoExceptions.filter((e) => !["RESOLVED", "CLOSED"].includes(e.status));

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <DashboardPageHeader
        title="Operations command"
        description="Logistics network overview for demonstration. International linehaul may use partner carriers — NECO does not claim ownership of all aircraft or vessels."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total shipments", value: stats.total },
          { label: "Awaiting collection", value: stats.awaitingCollection },
          { label: "Collected", value: stats.collected },
          { label: "At origin facility", value: stats.atOrigin },
          { label: "Processing", value: stats.processing },
          { label: "Ready for dispatch", value: stats.readyDispatch },
          { label: "In transit", value: stats.inTransit },
          { label: "At destination facility", value: stats.atDestination },
          { label: "Out for delivery", value: stats.outForDelivery },
          { label: "Delivered", value: stats.delivered },
          { label: "Delayed", value: stats.delayed },
          { label: "Active exceptions", value: stats.exceptions }
        ].map((item) => (
          <Card key={item.label} className="space-y-1 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{item.value}</p>
            <p className="text-[11px] text-amber-800">Demonstration figure</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-navy">Recent operational activity</h2>
            <Link href={"/operations/activities" as never} className="text-sm font-medium text-brand-navy hover:underline">
              Timeline
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 text-sm">
            {demoOpsEvents.map((e) => (
              <li key={e.id} className="py-2">
                <p className="font-medium text-brand-navy">{e.category}</p>
                <p className="text-xs text-slate-500">
                  {e.trackingNumber} · {e.location} · {new Date(e.at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-navy">Exception alerts</h2>
            <Link href={"/operations/exceptions" as never} className="text-sm font-medium text-brand-navy hover:underline">
              Manage
            </Link>
          </div>
          {openExceptions.length === 0 ? (
            <p className="text-sm text-slate-500">No open demonstration exceptions.</p>
          ) : (
            <ul className="space-y-2">
              {openExceptions.map((ex) => (
                <li key={ex.id} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/operations/exceptions/${ex.id}` as never}
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
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2">
          <h2 className="font-semibold text-brand-navy">Dispatch summary</h2>
          <p className="text-sm text-slate-600">
            Ready manifests: {demoManifests.filter((m) => m.status === "READY").length} (demo)
          </p>
          <p className="text-sm text-slate-600">
            Departed: {demoManifests.filter((m) => m.status === "DEPARTED").length} (demo)
          </p>
          <Link href={"/dispatch/queue" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Open dispatch queue
          </Link>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-semibold text-brand-navy">Delivery summary</h2>
          <p className="text-sm text-slate-600">Out for delivery: {stats.outForDelivery} (demo)</p>
          <p className="text-sm text-slate-600">Delivered sample: {stats.delivered} (demo)</p>
          <Link href={"/deliveries" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Open deliveries
          </Link>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-semibold text-brand-navy">Warehouse activity</h2>
          {demoWarehouses.slice(0, 2).map((w) => (
            <p key={w.code} className="text-sm text-slate-600">
              {w.code}: {w.awaitingProcessing} processing / {w.awaitingDispatch} dispatch (demo)
            </p>
          ))}
          <Link href={"/warehouses/locations" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Open warehouses
          </Link>
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-brand-navy">Pending network snapshot</h2>
          <Link href={"/operations/shipments" as never} className="text-sm font-medium text-brand-navy hover:underline">
            All shipments
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {recent.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <div>
                <Link
                  href={`/operations/shipments/${s.trackingNumber}` as never}
                  className="font-mono font-semibold text-brand-navy hover:underline"
                >
                  {s.trackingNumber}
                </Link>
                <p className="text-xs text-slate-500">
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
      </Card>
    </section>
  );
}
