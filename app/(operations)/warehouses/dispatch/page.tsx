"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card, FilterBar, FormField, Select } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import {
  demoDrivers,
  demoManifests,
  demoParcelCustody,
  demoVehicles,
  demoWarehouses
} from "@/lib/demo/operations-fixtures";
import { PACKAGE_CUSTODY_CONFIG } from "@/lib/demo/operations-status";

export default function WarehouseDispatchPrepPage() {
  const [warehouse, setWarehouse] = useState("ALL");

  const parcels = useMemo(() => {
    let rows = demoParcelCustody.filter((p) =>
      ["READY_FOR_DISPATCH", "LOADED", "RECEIVED", "PROCESSING", "SORTED", "STORED"].includes(p.custody)
    );
    if (warehouse !== "ALL") rows = rows.filter((p) => p.warehouseCode === warehouse);
    return rows;
  }, [warehouse]);

  const staging = parcels.filter((p) => p.custody !== "LOADED");
  const loaded = parcels.filter((p) => p.custody === "LOADED");
  const progress = parcels.length ? Math.round((loaded.length / parcels.length) * 100) : 0;

  const groups = demoManifests
    .filter((m) => ["DRAFT", "READY"].includes(m.status))
    .map((m) => {
      const vehicle = demoVehicles.find((v) => v.id === m.vehicleId);
      const driver = demoDrivers.find((d) => d.id === m.driverId);
      const linked = parcels.filter((p) => m.shipmentRefs.includes(p.trackingNumber));
      return { manifest: m, vehicle, driver, linked };
    });

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Cargo loading plan"
        description="UI-17 warehouse staging and load presentation. Custody fixtures only — vehicle capacity and inventory are not invented beyond labelled demo fields."
        actions={
          <Link href={"/dispatch/manifests" as never}>
            <Button variant="secondary">Manifests</Button>
          </Link>
        }
      />

      <OpsDemoNote title="No fabricated capacity or inventory">
        <p>
          Package grouping uses demonstration custody records and manifest references. Loading progress is a fixture
          ratio, not a live warehouse system.
        </p>
      </OpsDemoNote>

      <FilterBar>
        <FormField label="Warehouse" htmlFor="wh-load-filter" className="min-w-[14rem]">
          <Select id="wh-load-filter" value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
            <option value="ALL">All facilities</option>
            {demoWarehouses.map((w) => (
              <option key={w.code} value={w.code}>
                {w.code} — {w.name}
              </option>
            ))}
          </Select>
        </FormField>
      </FilterBar>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-l-4 border-l-brand-warning">
          <p className="ns-meta font-semibold uppercase tracking-wide">Staging</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{staging.length}</p>
          <p className="ns-meta">Packages awaiting load (demo)</p>
        </Card>
        <Card className="border-l-4 border-l-brand-info">
          <p className="ns-meta font-semibold uppercase tracking-wide">Loaded</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{loaded.length}</p>
          <p className="ns-meta">Marked LOADED in custody fixtures</p>
        </Card>
        <Card className="border-l-4 border-l-brand-yellow">
          <p className="ns-meta font-semibold uppercase tracking-wide">Loading progress</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{progress}%</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden>
            <div className="h-full rounded-full bg-brand-navy" style={{ width: `${progress}%` }} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map(({ manifest, vehicle, driver, linked }) => (
          <Card key={manifest.id} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs font-semibold text-brand-navy">{manifest.reference}</p>
                <h2 className="ns-card-title mt-1">Truck / container assignment</h2>
              </div>
              <Badge tone={manifest.status === "READY" ? "warning" : "default"}>{manifest.status}</Badge>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2 text-sm">
              <Field label="Vehicle" value={vehicle?.reference ?? "Unassigned"} />
              <Field label="Driver" value={driver?.name ?? "Unassigned"} />
              <Field label="Capacity label" value={vehicle?.capacityLabel ?? "Not configured"} />
              <Field label="Destination" value={manifest.destination} />
            </dl>
            <div>
              <p className="ns-meta mb-2 font-semibold uppercase tracking-wide">Package grouping</p>
              {linked.length === 0 ? (
                <p className="text-sm text-slate-600">
                  Manifest refs: {manifest.shipmentRefs.join(", ")} — no matching custody rows in current filter.
                </p>
              ) : (
                <ul className="space-y-2">
                  {linked.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-input border border-ns-border px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-mono font-semibold text-brand-navy">{p.trackingNumber}</p>
                        <p className="ns-meta">
                          {p.packageId} · bin {p.binCode ?? "Staging"}
                        </p>
                      </div>
                      <OpsStatusBadge
                        label={PACKAGE_CUSTODY_CONFIG[p.custody].label}
                        tone={PACKAGE_CUSTODY_CONFIG[p.custody].tone}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button type="button" disabled>
              Confirm load (unavailable)
            </Button>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <h2 className="ns-card-title">Warehouse staging board</h2>
        <div className="grid gap-2">
          {parcels.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-input border border-ns-border px-3 py-2 text-sm"
            >
              <div>
                <p className="font-mono font-semibold text-brand-navy">{p.trackingNumber}</p>
                <p className="ns-meta">
                  {p.warehouseCode} · {p.binCode ?? "Staging"} · {p.notes}
                </p>
              </div>
              <OpsStatusBadge
                label={PACKAGE_CUSTODY_CONFIG[p.custody].label}
                tone={PACKAGE_CUSTODY_CONFIG[p.custody].tone}
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600">
          Continue in{" "}
          <Link href={"/dispatch/manifests" as never} className="font-semibold text-brand-navy hover:underline">
            Dispatch manifests
          </Link>{" "}
          for allocation presentation (demonstration only).
        </p>
      </Card>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-ns-border bg-brand-surface-muted px-3 py-2">
      <dt className="ns-meta font-semibold uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-brand-navy">{value}</dd>
    </div>
  );
}
