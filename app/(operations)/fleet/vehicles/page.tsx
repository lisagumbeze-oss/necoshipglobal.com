"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Badge,
  Card,
  DataTable,
  FilterBar,
  FormField,
  KpiCard,
  SearchField,
  Select
} from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import { demoDrivers, demoVehicles, getOpsOverviewStats, type DemoVehicle } from "@/lib/demo/operations-fixtures";
import { VEHICLE_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function FleetVehiclesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const stats = getOpsOverviewStats();

  const rows = useMemo(() => {
    let list = [...demoVehicles];
    if (q.trim()) {
      const key = q.toLowerCase();
      list = list.filter(
        (v) =>
          v.reference.toLowerCase().includes(key) ||
          v.registration.toLowerCase().includes(key) ||
          v.model.toLowerCase().includes(key) ||
          v.category.toLowerCase().includes(key)
      );
    }
    if (status !== "ALL") list = list.filter((v) => v.status === status);
    return list;
  }, [q, status]);

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Fleet management"
        description="UI-38 vehicle overview. Demonstration NECO-operated assets only — aircraft/vessels are not assumed owned. No Prisma Vehicle model yet."
        actions={
          <Link href={"/fleet/maintenance" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Maintenance schedule
          </Link>
        }
      />

      <OpsDemoNote title="Synthetic fleet fixtures">
        <p>
          Capacity labels and maintenance notes are demonstration fields. Properties shown are limited to fixture-supported
          attributes.
        </p>
      </OpsDemoNote>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total vehicles" value={stats.vehiclesTotal} hint="Demo directory" tone="info" />
        <KpiCard label="Available" value={stats.vehiclesAvailable} hint="Ready for assignment" tone="success" />
        <KpiCard label="Assigned / on route" value={stats.vehiclesAssigned} hint="Active presentation" tone="warning" />
        <KpiCard label="Maintenance due" value={stats.maintenanceDue} hint="See UI-36 schedule" tone="default" />
      </div>

      <FilterBar>
        <FormField label="Search" htmlFor="fleet-q" className="min-w-[14rem] flex-1">
          <SearchField
            id="fleet-q"
            placeholder="Reference, registration, model…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </FormField>
        <FormField label="Availability" htmlFor="fleet-status" className="min-w-[12rem]">
          <Select id="fleet-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All statuses</option>
            {Object.entries(VEHICLE_STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </FormField>
      </FilterBar>

      <DataTable<DemoVehicle>
        rows={rows}
        rowKey={(row) => row.id}
        empty="No vehicles match the current filters."
        columns={[
          {
            id: "reference",
            header: "Reference",
            cell: (v) => (
              <Link
                href={`/fleet/vehicles/${v.id}` as never}
                className="font-mono text-xs font-semibold text-brand-navy hover:underline"
              >
                {v.reference}
              </Link>
            )
          },
          { id: "registration", header: "Registration", cell: (v) => v.registration },
          { id: "category", header: "Category", cell: (v) => v.category },
          {
            id: "model",
            header: "Make / model",
            cell: (v) => `${v.make} ${v.model}`
          },
          { id: "year", header: "Year", cell: (v) => v.year },
          {
            id: "capacity",
            header: "Capacity",
            cell: (v) => <span className="text-amber-900">{v.capacityLabel}</span>
          },
          {
            id: "driver",
            header: "Driver",
            cell: (v) => demoDrivers.find((d) => d.id === v.assignedDriverId)?.name ?? "—"
          },
          {
            id: "status",
            header: "Availability",
            cell: (v) => (
              <OpsStatusBadge label={VEHICLE_STATUS_CONFIG[v.status].label} tone={VEHICLE_STATUS_CONFIG[v.status].tone} />
            )
          },
          {
            id: "maintenance",
            header: "Maintenance",
            cell: (v) => <Badge tone="default">{v.maintenanceStatus}</Badge>
          },
          {
            id: "assignment",
            header: "Assignment",
            cell: (v) => v.currentAssignment ?? "—"
          }
        ]}
      />

      <Card className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        {rows.slice(0, 3).map((v) => (
          <div key={v.id} className="rounded-input border border-ns-border p-3">
            <p className="font-mono font-semibold text-brand-navy">{v.reference}</p>
            <p className="ns-meta mt-1">Next inspection {v.nextInspection}</p>
            <p className="ns-meta">{v.ownership}</p>
            <Link
              href={`/fleet/vehicles/${v.id}` as never}
              className="mt-2 inline-flex text-sm font-semibold text-brand-navy hover:underline"
            >
              Open vehicle profile
            </Link>
          </div>
        ))}
      </Card>
    </section>
  );
}
