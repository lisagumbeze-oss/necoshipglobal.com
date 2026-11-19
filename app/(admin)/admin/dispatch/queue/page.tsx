"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  DataTable,
  FilterBar,
  FormField,
  SearchField,
  Select
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import { MapWorkspace } from "@/components/shell/app-chrome";
import {
  demoAssignments,
  demoDrivers,
  demoManifests,
  demoVehicles,
  type DemoManifest
} from "@/lib/demo/operations-fixtures";
import { MANIFEST_STATUS_CONFIG } from "@/lib/demo/operations-status";
import { Map as MapIcon } from "lucide-react";

export default function DispatchQueuePage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("QUEUE");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = [...demoManifests];
    if (status === "QUEUE") rows = rows.filter((m) => ["DRAFT", "READY"].includes(m.status));
    else if (status !== "ALL") rows = rows.filter((m) => m.status === status);
    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter(
        (m) =>
          m.reference.toLowerCase().includes(query) ||
          m.departureLocation.toLowerCase().includes(query) ||
          m.destination.toLowerCase().includes(query) ||
          m.shipmentRefs.some((s) => s.toLowerCase().includes(query))
      );
    }
    return rows;
  }, [q, status]);

  const selected = demoManifests.find((m) => m.id === selectedId) ?? filtered[0] ?? null;
  const selectedVehicle = selected ? demoVehicles.find((v) => v.id === selected.vehicleId) : null;
  const selectedDriver = selected ? demoDrivers.find((d) => d.id === selected.driverId) : null;
  const relatedAssignments = selected
    ? demoAssignments.filter((a) => a.shipmentIds.some((id) => selected.shipmentRefs.includes(id)) || a.vehicleId === selected.vehicleId)
    : [];

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Dispatch board"
        description="UI-26 / UI-32 dispatch queue with map/detail split. Demonstration manifests only — no live dispatch mutations or GPS."
        actions={
          <Link href={"/admin/dispatch/routes" as never}>
            <Button variant="secondary">Route plans</Button>
          </Link>
        }
      />

      <OpsDemoNote title="Assignments are presentation-only">
        <p>
          Selecting a manifest updates the detail panel. Confirm / release actions are disabled — no fake dispatch
          assignments are created.
        </p>
      </OpsDemoNote>

      <FilterBar>
        <FormField label="Search" htmlFor="dq-q" className="min-w-[14rem] flex-1">
          <SearchField
            id="dq-q"
            placeholder="Manifest, lane, shipment…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </FormField>
        <FormField label="Status" htmlFor="dq-status" className="min-w-[12rem]">
          <Select id="dq-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="QUEUE">Queue (draft + ready)</option>
            <option value="ALL">All manifests</option>
            <option value="DRAFT">Draft</option>
            <option value="READY">Ready</option>
            <option value="DEPARTED">Departed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </FormField>
      </FilterBar>

      <MapWorkspace
        list={
          <div className="space-y-3 p-4">
            <h2 className="ns-card-title">Dispatch queue</h2>
            <p className="ns-meta">{filtered.length} demonstration records</p>
            <ul className="space-y-2">
              {filtered.map((m) => {
                const active = selected?.id === m.id;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(m.id)}
                      className={`focus-ring w-full rounded-input border px-3 py-2 text-left text-sm ${
                        active ? "border-brand-navy bg-brand-yellow/20" : "border-ns-border hover:bg-brand-surface-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-semibold text-brand-navy">{m.reference}</span>
                        <OpsStatusBadge
                          label={MANIFEST_STATUS_CONFIG[m.status].label}
                          tone={MANIFEST_STATUS_CONFIG[m.status].tone}
                        />
                      </div>
                      <p className="ns-meta mt-1">
                        {m.departureLocation} → {m.destination}
                      </p>
                      {m.status === "READY" && !m.vehicleId ? (
                        <Badge tone="danger" className="mt-1">
                          Exception: unassigned vehicle
                        </Badge>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        }
        map={
          <div className="flex h-full min-h-[18rem] flex-col justify-between gap-4 p-5">
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-card border border-dashed border-ns-border bg-brand-surface-muted p-6 text-center">
              <MapIcon className="text-brand-navy/35" size={32} aria-hidden />
              <p className="ns-card-title">Non-live location display</p>
              <p className="ns-body max-w-md">
                Mapbox panel reserved for verified operational maps. No simulated live GPS tracking is rendered.
              </p>
              {selected ? (
                <p className="ns-meta mt-2">
                  Selected lane: {selected.departureLocation} → {selected.destination}
                </p>
              ) : null}
            </div>
            {selected ? (
              <div className="space-y-3 rounded-card border border-ns-border bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-semibold text-brand-navy">{selected.reference}</p>
                    <h3 className="ns-card-title mt-1">Assignment presentation</h3>
                  </div>
                  <OpsStatusBadge
                    label={MANIFEST_STATUS_CONFIG[selected.status].label}
                    tone={MANIFEST_STATUS_CONFIG[selected.status].tone}
                  />
                </div>
                <dl className="grid gap-2 sm:grid-cols-2 text-sm">
                  <Detail label="Shipments" value={selected.shipmentRefs.join(", ")} />
                  <Detail label="Packages" value={String(selected.packageCount)} />
                  <Detail label="Vehicle" value={selectedVehicle?.reference ?? "Unassigned (demo)"} />
                  <Detail label="Driver" value={selectedDriver?.name ?? "Unassigned (demo)"} />
                  <Detail label="Planned departure" value={new Date(selected.plannedDeparture).toLocaleString()} />
                  <Detail label="Delivery status" value={selected.status} />
                </dl>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" disabled title="No dispatch mutation API">
                    Confirm dispatch
                  </Button>
                  <Button type="button" variant="secondary" disabled>
                    Release assignment
                  </Button>
                  <Link href={"/admin/dispatch/history" as never}>
                    <Button type="button" variant="ghost">
                      Assignment history
                    </Button>
                  </Link>
                </div>
                {relatedAssignments.length ? (
                  <div>
                    <p className="ns-meta mb-1 font-semibold uppercase tracking-wide">Related assignment history</p>
                    <ul className="space-y-1 text-sm">
                      {relatedAssignments.map((a) => (
                        <li key={a.id} className="rounded-input border border-ns-border px-2 py-1.5">
                          {a.id} · {a.status}
                          {a.conflictNote ? <span className="block text-xs text-brand-danger">{a.conflictNote}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        }
      />

      <DataTable<DemoManifest>
        rows={filtered}
        rowKey={(row) => row.id}
        empty="No manifests match the current filters."
        columns={[
          {
            id: "reference",
            header: "Manifest",
            cell: (m) => (
              <button
                type="button"
                className="font-mono text-xs font-semibold text-brand-navy hover:underline"
                onClick={() => setSelectedId(m.id)}
              >
                {m.reference}
              </button>
            )
          },
          { id: "shipments", header: "Shipments", cell: (m) => m.shipmentRefs.join(", ") },
          { id: "packages", header: "Packages", cell: (m) => m.packageCount },
          { id: "origin", header: "Origin", cell: (m) => m.departureLocation },
          { id: "destination", header: "Destination", cell: (m) => m.destination },
          {
            id: "vehicle",
            header: "Vehicle",
            cell: (m) => demoVehicles.find((v) => v.id === m.vehicleId)?.reference ?? "—"
          },
          {
            id: "driver",
            header: "Driver",
            cell: (m) => demoDrivers.find((d) => d.id === m.driverId)?.name ?? "—"
          },
          {
            id: "departure",
            header: "Departure",
            cell: (m) => new Date(m.plannedDeparture).toLocaleString()
          },
          {
            id: "status",
            header: "Status",
            cell: (m) => (
              <OpsStatusBadge label={MANIFEST_STATUS_CONFIG[m.status].label} tone={MANIFEST_STATUS_CONFIG[m.status].tone} />
            )
          }
        ]}
      />
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-ns-border bg-brand-surface-muted px-3 py-2">
      <dt className="ns-meta font-semibold uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-brand-navy">{value}</dd>
    </div>
  );
}
