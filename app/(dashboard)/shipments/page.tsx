"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef
} from "@tanstack/react-table";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { useDashboardFilters } from "@/lib/dashboard-store";
import { apiQuery, titleStatus } from "@/lib/query-api";

type ShipmentRecord = {
  id: string;
  origin: string;
  destination: string;
  service: string;
  status: string;
  eta: string;
  weightKg: number;
  costUsd: number;
  updatedAt: string;
  recipient: string;
};

type ApiShipment = {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  serviceType: string;
  status: string;
  eta: string | null;
  amountCents: number | null;
  weightKg?: number | null;
  recipientName?: string | null;
  updatedAt?: string;
};

async function loadShipments(status?: string, q?: string): Promise<ShipmentRecord[]> {
  const params = new URLSearchParams();
  if (status && status !== "All") params.set("status", status);
  if (q) params.set("q", q);
  const data = await apiQuery<ApiShipment[]>(`/api/shipments?${params.toString()}`);
  return data.map((s) => ({
    id: s.trackingNumber,
    origin: s.origin,
    destination: s.destination,
    service: titleStatus(s.serviceType),
    status: titleStatus(s.status),
    eta: s.eta ? new Date(s.eta).toLocaleDateString() : "—",
    weightKg: s.weightKg ?? 0,
    costUsd: (s.amountCents ?? 0) / 100,
    updatedAt: s.updatedAt ?? new Date().toISOString(),
    recipient: s.recipientName ?? ""
  }));
}

export default function MyShipmentsPage() {
  const { shipmentStatus, shipmentSearch, setFilter } = useDashboardFilters();
  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const pageSize = 8;
  const query = useQuery(["shipments", shipmentStatus, shipmentSearch], () =>
    loadShipments(shipmentStatus, shipmentSearch)
  );

  const rows = query.data ?? [];

  const columns = useMemo<ColumnDef<ShipmentRecord>[]>(
    () => [
      {
        id: "select",
        header: () => "Select",
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selected.includes(row.original.id)}
            onChange={(e) => {
              setSelected((prev) =>
                e.target.checked ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id)
              );
            }}
          />
        )
      },
      {
        header: "Tracking #",
        accessorKey: "id",
        cell: ({ row }) => <span className="font-mono">{row.original.id}</span>
      },
      { header: "Origin", accessorKey: "origin" },
      { header: "Destination", accessorKey: "destination" },
      { header: "Service", accessorKey: "service" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge
            tone={
              String(row.original.status).includes("Delivered")
                ? "success"
                : String(row.original.status).includes("Exception")
                  ? "danger"
                  : String(row.original.status).includes("Customs")
                    ? "warning"
                    : "default"
            }
          >
            {row.original.status}
          </Badge>
        )
      },
      { header: "ETA", accessorKey: "eta" },
      {
        header: "Cost",
        accessorKey: "costUsd",
        cell: ({ row }) => `$${row.original.costUsd.toFixed(2)}`
      },
      {
        header: "Action",
        id: "action",
        cell: ({ row }) => (
          <Link href={`/shipments/${row.original.id}` as never} className="text-brand-navy underline">
            View
          </Link>
        )
      }
    ],
    [selected]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const exportCsv = () => {
    const ids = selected.length ? selected : rows.map((r) => r.id);
    const subset = rows.filter((r) => ids.includes(r.id));
    const csv = ["tracking,origin,destination,status,cost", ...subset.map((r) => `${r.id},${r.origin},${r.destination},${r.status},${r.costUsd}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shipments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-4 p-2">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-navy">My Shipments</h1>
          <p className="text-sm text-slate-600">Filter, export, and manage bookings across your account.</p>
        </div>
        <Link href={"/create-shipment" as never}>
          <Button type="button">Create Shipment</Button>
        </Link>
      </header>

      <Card className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search tracking / recipient"
            value={shipmentSearch}
            onChange={(e) => setFilter("shipmentSearch", e.target.value)}
          />
          <select
            className="h-11 rounded-input border border-slate-300 px-3 text-sm"
            value={shipmentStatus}
            onChange={(e) => setFilter("shipmentStatus", e.target.value as never)}
          >
            {["All", "In Transit", "Delivered", "Exception", "Customs Hold", "Out for Delivery", "LABEL_CREATED"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
          <Button type="button" variant="secondary" onClick={exportCsv}>
            Export CSV
          </Button>
          <Button type="button" variant="ghost" disabled={!selected.length}>
            Bulk labels ({selected.length})
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-200 text-slate-500">
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-2 py-2 font-medium">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" disabled={pageIndex === 0} onClick={() => setPageIndex((p) => p - 1)}>
            Previous
          </Button>
          <p className="text-xs text-slate-500">
            Page {pageIndex + 1} · {rows.length} shipments
          </p>
          <Button
            type="button"
            variant="ghost"
            disabled={(pageIndex + 1) * pageSize >= rows.length}
            onClick={() => setPageIndex((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </Card>
    </main>
  );
}
