"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoOpsShipments } from "@/lib/demo/operations-fixtures";
import { OPS_SHIPMENT_PHASE_CONFIG, type OpsShipmentPhase } from "@/lib/demo/operations-status";

const PAGE_SIZE = 6;

export default function OperationsShipmentsPage() {
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState<string>("ALL");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = [...demoOpsShipments];
    if (q.trim()) {
      const key = q.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.trackingNumber.toLowerCase().includes(key) ||
          r.reference.toLowerCase().includes(key) ||
          r.destination.toLowerCase().includes(key)
      );
    }
    if (phase !== "ALL") rows = rows.filter((r) => r.phase === phase);
    return rows;
  }, [q, phase]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title="Operational shipments"
        description="Demonstration shipment processing board. Partner linehaul may apply for international legs."
      />
      <Card className="grid gap-3 md:grid-cols-3">
        <Input
          aria-label="Search shipments"
          placeholder="Search tracking or reference…"
          value={q}
          onChange={(e) => {
            setPage(0);
            setQ(e.target.value);
          }}
          className="md:col-span-2"
        />
        <select
          className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
          aria-label="Phase filter"
          value={phase}
          onChange={(e) => {
            setPage(0);
            setPhase(e.target.value);
          }}
        >
          <option value="ALL">All phases</option>
          {(Object.keys(OPS_SHIPMENT_PHASE_CONFIG) as OpsShipmentPhase[]).map((p) => (
            <option key={p} value={p}>
              {OPS_SHIPMENT_PHASE_CONFIG[p].label}
            </option>
          ))}
        </select>
      </Card>

      {rows.length === 0 ? (
        <EmptyState title="No shipments" description="No demonstration shipments match these filters." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Lane</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Packages</th>
                <th className="px-4 py-3">Warehouse</th>
                <th className="px-4 py-3">Phase</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/operations/shipments/${s.trackingNumber}` as never}
                      className="font-mono font-semibold text-brand-navy hover:underline"
                    >
                      {s.trackingNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{s.reference}</td>
                  <td className="px-4 py-3">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="px-4 py-3">{s.method}</td>
                  <td className="px-4 py-3">{s.packageCount}</td>
                  <td className="px-4 py-3">{s.warehouseCode ?? "—"}</td>
                  <td className="px-4 py-3">
                    <OpsStatusBadge
                      label={OPS_SHIPMENT_PHASE_CONFIG[s.phase].label}
                      tone={OPS_SHIPMENT_PHASE_CONFIG[s.phase].tone}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-600">
          Showing {rows.length} of {filtered.length} demonstration records
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
