"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoExceptions } from "@/lib/demo/operations-fixtures";
import { EXCEPTION_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function OperationsExceptionsPage() {
  const [status, setStatus] = useState("ALL");
  const rows = useMemo(
    () => (status === "ALL" ? demoExceptions : demoExceptions.filter((e) => e.status === status)),
    [status]
  );

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Exception management"
        description="Demonstration operational exceptions. Not real incidents."
      />
      <select
        className="focus-ring h-11 max-w-xs rounded-input border border-slate-300 bg-white px-3 text-sm"
        aria-label="Exception status filter"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="ALL">All statuses</option>
        {Object.entries(EXCEPTION_STATUS_CONFIG).map(([k, v]) => (
          <option key={k} value={k}>
            {v.label}
          </option>
        ))}
      </select>
      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Shipment</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/operations/exceptions/${e.id}` as never}
                    className="font-mono font-semibold text-brand-navy hover:underline"
                  >
                    {e.reference}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{e.trackingNumber}</td>
                <td className="px-4 py-3">{e.category.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">{e.priority}</td>
                <td className="px-4 py-3">{e.department}</td>
                <td className="px-4 py-3">
                  <OpsStatusBadge
                    label={EXCEPTION_STATUS_CONFIG[e.status].label}
                    tone={EXCEPTION_STATUS_CONFIG[e.status].tone}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
