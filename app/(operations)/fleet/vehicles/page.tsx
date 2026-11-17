"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDrivers, demoVehicles } from "@/lib/demo/operations-fixtures";
import { VEHICLE_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function FleetVehiclesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const rows = useMemo(() => {
    let list = [...demoVehicles];
    if (q.trim()) {
      const key = q.toLowerCase();
      list = list.filter(
        (v) =>
          v.reference.toLowerCase().includes(key) ||
          v.registration.toLowerCase().includes(key) ||
          v.model.toLowerCase().includes(key)
      );
    }
    if (status !== "ALL") list = list.filter((v) => v.status === status);
    return list;
  }, [q, status]);

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Vehicle directory"
        description="Demonstration NECO-operated fleet assets. International aircraft/vessels are not assumed owned. No Prisma Vehicle model yet — UI fixtures only."
      />
      <Card className="grid gap-3 md:grid-cols-2">
        <Input aria-label="Search vehicles" placeholder="Search reference or registration…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select
          className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
          aria-label="Vehicle status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">All statuses</option>
          {Object.entries(VEHICLE_STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </Card>
      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Registration</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Make / model</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assignment</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => {
              const driver = demoDrivers.find((d) => d.id === v.assignedDriverId);
              return (
                <tr key={v.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/fleet/vehicles/${v.id}` as never} className="font-mono font-semibold text-brand-navy hover:underline">
                      {v.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{v.registration}</td>
                  <td className="px-4 py-3">{v.category}</td>
                  <td className="px-4 py-3">
                    {v.make} {v.model}
                  </td>
                  <td className="px-4 py-3">{v.year}</td>
                  <td className="px-4 py-3 text-amber-900">{v.capacityLabel}</td>
                  <td className="px-4 py-3">{driver?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <OpsStatusBadge label={VEHICLE_STATUS_CONFIG[v.status].label} tone={VEHICLE_STATUS_CONFIG[v.status].tone} />
                  </td>
                  <td className="px-4 py-3">{v.currentAssignment ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
