"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import { demoShipments, type DemoShipment } from "@/lib/demo/customer-fixtures";
import { SHIPMENT_STATUSES } from "@/lib/demo/shipment-status";

const PAGE_SIZE = 5;

export default function MyShipmentsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"bookingDate" | "trackingNumber" | "status">("bookingDate");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = [...demoShipments];
    const query = q.trim().toLowerCase();
    if (query) {
      rows = rows.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(query) ||
          s.reference.toLowerCase().includes(query) ||
          s.origin.toLowerCase().includes(query) ||
          s.destination.toLowerCase().includes(query)
      );
    }
    if (status !== "ALL") rows = rows.filter((s) => s.status === status);
    if (from) rows = rows.filter((s) => s.bookingDate.slice(0, 10) >= from);
    if (to) rows = rows.filter((s) => s.bookingDate.slice(0, 10) <= to);
    rows.sort((a, b) => {
      if (sort === "trackingNumber") return a.trackingNumber.localeCompare(b.trackingNumber);
      if (sort === "status") return a.status.localeCompare(b.status);
      return b.bookingDate.localeCompare(a.bookingDate);
    });
    return rows;
  }, [q, status, from, to, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="My Shipments"
        description="Search, filter and open demonstration shipment records."
        actions={
          <Link href={"/create-shipment" as never}>
            <Button>New Shipment</Button>
          </Link>
        }
      />

      <Card className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input
          placeholder="Search tracking, reference, lane…"
          value={q}
          onChange={(e) => {
            setPage(0);
            setQ(e.target.value);
          }}
          aria-label="Search shipments"
        />
        <select
          className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
          value={status}
          onChange={(e) => {
            setPage(0);
            setStatus(e.target.value);
          }}
          aria-label="Status filter"
        >
          <option value="ALL">All statuses</option>
          {SHIPMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <Input type="date" value={from} onChange={(e) => { setPage(0); setFrom(e.target.value); }} aria-label="From date" />
        <Input type="date" value={to} onChange={(e) => { setPage(0); setTo(e.target.value); }} aria-label="To date" />
        <select
          className="focus-ring h-11 rounded-input border border-slate-300 bg-white px-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          aria-label="Sort shipments"
        >
          <option value="bookingDate">Sort: booking date</option>
          <option value="trackingNumber">Sort: tracking number</option>
          <option value="status">Sort: status</option>
        </select>
      </Card>

      {pageRows.length === 0 ? (
        <EmptyState
          title="No shipments match"
          description="Adjust filters or create a new demonstration shipment request."
          action={
            <Link href={"/create-shipment" as never}>
              <Button variant="secondary">New Shipment</Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Tracking Number</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Booking Date</th>
                <th className="px-4 py-3">Est. Delivery</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s) => (
                <ShipmentRow key={s.id} shipment={s} />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
        <p>
          Showing {pageRows.length} of {filtered.length} demonstration records
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="px-2 py-2">
            Page {page + 1} / {pageCount}
          </span>
          <Button
            variant="ghost"
            type="button"
            disabled={page + 1 >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

function ShipmentRow({ shipment: s }: { shipment: DemoShipment }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{s.trackingNumber}</td>
      <td className="px-4 py-3">{s.reference}</td>
      <td className="px-4 py-3">{s.origin}</td>
      <td className="px-4 py-3">{s.destination}</td>
      <td className="px-4 py-3">{s.method}</td>
      <td className="px-4 py-3">{new Date(s.bookingDate).toLocaleDateString()}</td>
      <td className="px-4 py-3">{s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : "—"}</td>
      <td className="px-4 py-3">
        <ShipmentStatusBadge status={s.status} />
      </td>
      <td className="px-4 py-3">
        <Link href={`/shipments/${s.trackingNumber}` as never} className="font-semibold text-brand-navy hover:underline">
          View
        </Link>
      </td>
    </tr>
  );
}
