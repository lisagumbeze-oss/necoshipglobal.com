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
import { Plus, ShieldAlert, UserRoundSearch } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type CustomerRecord = {
  id: string;
  name: string;
  type: "Individual" | "Business" | "Enterprise";
  country: string;
  joinDate: string;
  status: "Active" | "Suspended";
  totalShipments: number;
  totalRevenueUsd: number;
  creditLimitUsd?: number;
};

function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function CustomersPage() {
  const { pushToast } = useToast();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | CustomerRecord["type"]>("All");
  const [status, setStatus] = useState<"All" | CustomerRecord["status"]>("All");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 8;

  const query = useQuery(["admin-customers", q, type, status], () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type !== "All") params.set("type", type);
    if (status !== "All") params.set("status", status);
    const qs = params.toString();
    return apiQuery<CustomerRecord[]>(`/api/admin/customers${qs ? `?${qs}` : ""}`);
  });

  const rows = query.data ?? [];
  const revenueTotal = useMemo(() => rows.reduce((sum, c) => sum + c.totalRevenueUsd, 0), [rows]);

  const columns = useMemo<ColumnDef<CustomerRecord>[]>(
    () => [
      {
        header: "Customer",
        id: "customer",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-brand-navy">{row.original.name}</p>
            <p className="mt-1 text-xs text-slate-500">
              {row.original.id} · Joined {row.original.joinDate} · Shipments {row.original.totalShipments}
            </p>
          </div>
        )
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => <Badge tone={row.original.type === "Enterprise" ? "success" : "default"}>{row.original.type}</Badge>
      },
      { header: "Country", accessorKey: "country" },
      {
        header: "Revenue",
        accessorKey: "totalRevenueUsd",
        cell: ({ row }) => <span className="font-semibold text-brand-navy">{money(row.original.totalRevenueUsd)}</span>
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant={row.original.status === "Active" ? "secondary" : "danger"}
              type="button"
              onClick={() =>
                pushToast({
                  tone: "info",
                  title: "Account status changed",
                  message: `${row.original.name} → ${row.original.status === "Active" ? "Suspended" : "Active"}`
                })
              }
            >
              {row.original.status === "Active" ? "Suspend" : "Activate"}
            </Button>
            <Link href={`/admin/customers/${row.original.id}` as never} className="text-xs font-semibold text-brand-navy underline">
              Open
            </Link>
          </div>
        )
      }
    ],
    [pushToast]
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

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Customer Management</h1>
            <p className="text-sm text-slate-600">Portfolio view with account controls, revenue insights, and access actions.</p>
          </div>
          <Button type="button" onClick={() => pushToast({ tone: "info", title: "Customer invite flow opened" })}>
            <Plus size={16} aria-hidden /> Invite Customer
          </Button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, country, ID…" />
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={type}
                  onChange={(e) => setType(e.target.value as never)}
                  aria-label="Customer type"
                >
                  <option value="All">All types</option>
                  <option value="Individual">Individual</option>
                  <option value="Business">Business</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as never)}
                  aria-label="Account status"
                >
                  <option value="All">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <Badge tone="default">{rows.length} customers</Badge>
            </Card>

            <Card className="overflow-hidden p-0">
              <table className="w-full min-w-[920px] text-left text-sm">
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
                      <td colSpan={5} className="p-4">
                        <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                      </td>
                    </tr>
                  ) : query.isError ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-sm text-red-700">Failed to load customers.</td>
                    </tr>
                  ) : table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-sm text-slate-600">No customers match your filters.</td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-t border-slate-200">
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
                    <Button variant="secondary" type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
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
              <div className="flex items-center gap-2 font-semibold text-brand-navy">
                <UserRoundSearch size={16} aria-hidden /> Segments
              </div>
              <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Enterprise customers can have custom rates and credit limits (prototype).
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="default">High-value cohort</Badge>
                <Badge tone="warning">At-risk</Badge>
                <Badge tone="default">New this month</Badge>
              </div>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-brand-navy">
                <ShieldAlert size={16} aria-hidden /> Compliance
              </div>
              <p className="text-sm text-slate-600">Impersonation and PII access are logged (prototype).</p>
              <Badge tone="default">Audit mode: enabled</Badge>
            </Card>

            <Card className="space-y-2">
              <p className="font-semibold text-brand-navy">Filtered revenue</p>
              <p className="font-display text-2xl font-bold text-brand-navy">{money(revenueTotal)}</p>
              <p className="text-xs text-slate-500">Sum of total revenue across the current filtered set.</p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
