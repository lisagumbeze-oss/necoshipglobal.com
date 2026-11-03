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
import { apiQuery } from "@/lib/query-api";
import { Download, Flag, RefreshCcw, UserPlus } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type AdminShipmentRow = {
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
  customer: string;
  carrier: string;
  exceptionFlag: boolean;
  originCountry: string;
  destinationCountry: string;
  customsStatus: string;
};

function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function AdminShipmentsPage() {
  const { pushToast } = useToast();
  const notify = (title: string, message?: string) => pushToast({ tone: "info", title, message });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | string>("All");
  const [customer, setCustomer] = useState("");
  const [carrier, setCarrier] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [customsStatus, setCustomsStatus] = useState<"All" | string>("All");
  const [exceptionOnly, setExceptionOnly] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const query = useQuery(
    ["admin-shipments", q, status, customer, carrier, originCountry, destinationCountry, customsStatus, exceptionOnly],
    () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status !== "All") params.set("status", status);
      if (customer) params.set("customer", customer);
      if (carrier) params.set("carrier", carrier);
      if (originCountry) params.set("originCountry", originCountry);
      if (destinationCountry) params.set("destinationCountry", destinationCountry);
      if (customsStatus !== "All") params.set("customsStatus", customsStatus);
      if (exceptionOnly) params.set("exceptionOnly", "true");
      const qs = params.toString();
      return apiQuery<AdminShipmentRow[]>(`/api/admin/shipments${qs ? `?${qs}` : ""}`);
    }
  );

  const rows = query.data ?? [];

  const revenueTotal = useMemo(() => rows.reduce((sum, r) => sum + r.costUsd, 0), [rows]);

  const columns = useMemo<ColumnDef<AdminShipmentRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 accent-brand-navy"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all page rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 accent-brand-navy"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label={`Select ${row.original.id}`}
          />
        )
      },
      {
        header: "Tracking",
        accessorKey: "id",
        cell: ({ row }) => (
          <div className="font-mono font-semibold text-brand-navy">
            <span>{row.original.id}</span>
            {row.original.exceptionFlag ? <span className="ml-2 text-red-600" title="Exception flagged">●</span> : null}
          </div>
        )
      },
      { header: "Customer", accessorKey: "customer" },
      {
        header: "Route",
        id: "route",
        cell: ({ row }) => (
          <div>
            <p className="text-xs text-slate-700">
              {row.original.origin} → {row.original.destination}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Customs: {row.original.customsStatus} · Updated: {row.original.updatedAt}
            </p>
          </div>
        )
      },
      { header: "Carrier", accessorKey: "carrier" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.status === "Delivered"
                ? "success"
                : row.original.status === "Exception"
                  ? "danger"
                  : row.original.status === "Customs Hold"
                    ? "warning"
                    : "default"
            }
          >
            {row.original.status}
          </Badge>
        )
      },
      {
        header: "Revenue",
        accessorKey: "costUsd",
        cell: ({ row }) => <span className="font-semibold text-brand-navy">{money(row.original.costUsd)}</span>
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <Link href={`/admin/shipments/${row.original.id}` as never} className="text-xs font-semibold text-brand-navy underline">
            View
          </Link>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      pagination: { pageIndex, pageSize }
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">All Shipments</h1>
            <p className="text-sm text-slate-600">Super-table across all customers with advanced filters and bulk actions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => query.refetch()} disabled={query.isFetching}>
              <RefreshCcw size={16} aria-hidden /> Refresh
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => notify("Export started", "CSV generation in progress")}
            >
              <Download size={16} aria-hidden /> Export CSV
            </Button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            <Card className="grid gap-3 md:grid-cols-4">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tracking, customer, route…" />
              <Input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Customer" />
              <Input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Carrier" />
              <select
                className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                value={status}
                onChange={(e) => setStatus(e.target.value as never)}
                aria-label="Status filter"
              >
                <option value="All">All statuses</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Customs Hold">Customs Hold</option>
                <option value="Exception">Exception</option>
              </select>
              <Input value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} placeholder="Origin country" />
              <Input value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)} placeholder="Destination country" />
              <select
                className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                value={customsStatus}
                onChange={(e) => setCustomsStatus(e.target.value as never)}
                aria-label="Customs status filter"
              >
                <option value="All">All customs</option>
                <option value="Docs Pending">Docs Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Cleared">Cleared</option>
                <option value="Rejected">Rejected</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
              <button
                type="button"
                className={`focus-ring rounded-button px-3 py-2 text-sm font-semibold ${
                  exceptionOnly ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => setExceptionOnly((v) => !v)}
                aria-pressed={exceptionOnly}
              >
                Exceptions only
              </button>
            </Card>

            <Card className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="default">{rows.length} shipments</Badge>
                <Badge tone="default">Revenue: {money(revenueTotal)}</Badge>
                <Badge tone={selectedCount > 0 ? "success" : "default"}>{selectedCount} selected</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => notify("Assign agent", `${selectedCount} shipments selected`)}
                >
                  <UserPlus size={16} aria-hidden /> Assign agent
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => notify("Bulk status update", `${selectedCount} shipments selected`)}
                >
                  Bulk update status
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => notify("Exception flag applied", `${selectedCount} shipments selected`)}
                >
                  <Flag size={16} aria-hidden /> Flag exception
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden p-0">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="p-3">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {query.isLoading ? (
                    <tr>
                      <td colSpan={8} className="p-4">
                        <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                      </td>
                    </tr>
                  ) : query.isError ? (
                    <tr>
                      <td colSpan={8} className="p-4 text-sm text-red-700">
                        Failed to load shipments. Please try again.
                      </td>
                    </tr>
                  ) : table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-sm text-slate-600">
                        No shipments match your filters.
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-3 align-middle">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {!query.isLoading && !query.isError ? (
                <div className="flex items-center justify-between border-t border-slate-100 px-3 py-3 text-sm">
                  <p className="text-slate-600">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Bulk operations</p>
              <p className="text-sm text-slate-600">
                Apply changes across multiple shipments. Actions are audited and require appropriate permissions (prototype).
              </p>
              <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Tip: Filter by “Exceptions only” to focus on urgent shipments first.
              </div>
            </Card>

            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Governance</p>
              <p className="text-sm text-slate-600">Sensitive fields are masked for non-finance roles (prototype).</p>
              <Button variant="secondary" type="button" onClick={() => notify("Opened audit trail")}>
                View audit trail
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
