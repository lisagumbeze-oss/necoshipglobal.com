"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import {
  demoCorporateShipments,
  demoCostCentres,
  demoOrganization,
  scopeByOrganization
} from "@/lib/demo/corporate-fixtures";
import { SHIPMENT_STATUSES, type ShipmentStatusCode } from "@/lib/demo/shipment-status";

const PAGE_SIZE = 5;

export default function CorporateShipmentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("ALL");
  const [costCentre, setCostCentre] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"bookingDesc" | "bookingAsc" | "tracking">("bookingDesc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = scopeByOrganization(demoCorporateShipments, demoOrganization.id);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.trackingNumber.toLowerCase().includes(q) ||
          r.reference.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }
    if (status !== "ALL") rows = rows.filter((r) => r.status === status);
    if (costCentre !== "ALL") rows = rows.filter((r) => r.costCentreCode === costCentre);
    if (from) rows = rows.filter((r) => r.bookingDate >= from);
    if (to) rows = rows.filter((r) => r.bookingDate <= to);
    rows = [...rows].sort((a, b) => {
      if (sort === "tracking") return a.trackingNumber.localeCompare(b.trackingNumber);
      if (sort === "bookingAsc") return a.bookingDate.localeCompare(b.bookingDate);
      return b.bookingDate.localeCompare(a.bookingDate);
    });
    return rows;
  }, [query, status, costCentre, from, to, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Company shipments"
        description={`Demonstration shipments for ${demoOrganization.tradingName} only. Scoped by organization membership.`}
        actions={
          <Link href={"/corporate/create-shipment" as never}>
            <Button>New shipment</Button>
          </Link>
        }
      />

      <Card className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Input
          aria-label="Search shipments"
          placeholder="Search tracking, reference, destination…"
          value={query}
          onChange={(e) => {
            setPage(0);
            setQuery(e.target.value);
          }}
          className="xl:col-span-2"
        />
        <select
          className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
          aria-label="Status filter"
          value={status}
          onChange={(e) => {
            setPage(0);
            setStatus(e.target.value);
          }}
        >
          <option value="ALL">All statuses</option>
          {SHIPMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
          aria-label="Cost centre filter"
          value={costCentre}
          onChange={(e) => {
            setPage(0);
            setCostCentre(e.target.value);
          }}
        >
          <option value="ALL">All cost centres</option>
          {demoCostCentres.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
        <Input type="date" aria-label="From date" value={from} onChange={(e) => { setPage(0); setFrom(e.target.value); }} />
        <Input type="date" aria-label="To date" value={to} onChange={(e) => { setPage(0); setTo(e.target.value); }} />
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="corp-ship-sort">
          Sort
        </label>
        <select
          id="corp-ship-sort"
          className="focus-ring h-10 rounded-input border border-slate-300 bg-white px-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="bookingDesc">Booking date (newest)</option>
          <option value="bookingAsc">Booking date (oldest)</option>
          <option value="tracking">Tracking number</option>
        </select>
      </div>

      {pageRows.length === 0 ? (
        <EmptyState
          title="No shipments match"
          description="Adjust filters or create a new demonstration shipment request."
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Cost centre</th>
                <th className="px-4 py-3">Lane</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Booked</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/corporate/shipments/${s.trackingNumber}` as never}
                      className="font-mono font-semibold text-brand-navy hover:underline"
                    >
                      {s.trackingNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{s.reference}</td>
                  <td className="px-4 py-3">{s.department}</td>
                  <td className="px-4 py-3">
                    {s.costCentreCode}
                    <span className="block text-xs text-slate-500">{s.costCentreName}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="px-4 py-3">{s.method}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{s.bookingDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{s.deliveryDate ?? "—"}</td>
                  <td className="px-4 py-3">
                    <ShipmentStatusBadge status={s.status as ShipmentStatusCode} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-slate-600">
          Showing {pageRows.length} of {filtered.length} demonstration records
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
