"use client";

import { useState } from "react";
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
import { Activity, Download, RefreshCcw, RotateCw } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type ApiLogRecord = {
  id: string;
  direction: "Inbound" | "Outbound";
  path: string;
  status: number;
  latencyMs: number;
  createdAt: string;
  payloadPreview: string;
};

type WebhookLogRecord = {
  id: string;
  endpoint: string;
  event: string;
  status: "Delivered" | "Retrying" | "Failed";
  attempts: number;
  createdAt: string;
  lastError?: string;
};

type SystemEventRecord = {
  id: string;
  kind: "Auth" | "Admin" | "Shipment" | "Billing" | "Integration";
  message: string;
  createdAt: string;
};

function PayloadModal({ title, payload, onClose }: { title: string; payload: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Payload viewer">
      <Card className="w-full max-w-3xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Payload</p>
            <p className="font-display text-xl font-bold text-brand-navy">{title}</p>
          </div>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
        <pre className="max-h-[60vh] overflow-auto rounded-card border border-slate-200 bg-slate-950 p-3 text-xs text-slate-200">
{payload}
        </pre>
      </Card>
    </div>
  );
}

export default function SystemLogsApiPage() {
  const { pushToast } = useToast();
  const [q, setQ] = useState("");
  const [payload, setPayload] = useState<{ title: string; body: string } | null>(null);
  const [apiPage, setApiPage] = useState(0);
  const apiPageSize = 8;

  const logsQuery = useQuery(["admin-system-logs"], () =>
    apiQuery<{
      apiLogs: ApiLogRecord[];
      webhookLogs: WebhookLogRecord[];
      systemEvents: SystemEventRecord[];
    }>("/api/admin/system-logs")
  );

  const carriers = [
    { name: "FedEx", status: "Operational" as const, latency: "142ms" },
    { name: "DHL", status: "Operational" as const, latency: "188ms" },
    { name: "UPS", status: "Degraded" as const, latency: "1.2s" },
    { name: "USPS", status: "Operational" as const, latency: "210ms" }
  ];

  const apiRows = (logsQuery.data?.apiLogs ?? []).filter((r: ApiLogRecord) =>
    q ? `${r.path} ${r.payloadPreview}`.toLowerCase().includes(q.toLowerCase()) : true
  );
  const whRows = (logsQuery.data?.webhookLogs ?? []).filter((r: WebhookLogRecord) =>
    q ? `${r.endpoint} ${r.event}`.toLowerCase().includes(q.toLowerCase()) : true
  );
  const evtRows = (logsQuery.data?.systemEvents ?? []).filter((r: SystemEventRecord) =>
    q ? `${r.kind} ${r.message}`.toLowerCase().includes(q.toLowerCase()) : true
  );

  const apiColumns: ColumnDef<ApiLogRecord>[] = [
    { header: "Dir", accessorKey: "direction" },
    { header: "Path", accessorKey: "path", cell: ({ row }) => <span className="font-mono text-xs text-slate-700">{row.original.path}</span> },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge tone={row.original.status >= 500 ? "danger" : row.original.status >= 400 ? "warning" : "success"}>
          {row.original.status}
        </Badge>
      )
    },
    { header: "Latency", accessorKey: "latencyMs", cell: ({ row }) => <span>{row.original.latencyMs}ms</span> },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="secondary"
          type="button"
          onClick={() => setPayload({ title: `${row.original.direction} ${row.original.path}`, body: row.original.payloadPreview })}
        >
          View
        </Button>
      )
    }
  ];

  const apiTable = useReactTable({
    data: apiRows,
    columns: apiColumns,
    state: {
      pagination: { pageIndex: apiPage, pageSize: apiPageSize }
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex: apiPage, pageSize: apiPageSize }) : updater;
      setApiPage(next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">System Logs & API</h1>
            <p className="text-sm text-slate-600">API traffic, webhook health, carrier integrations, and audit events.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => logsQuery.refetch()}>
              <RefreshCcw size={16} aria-hidden /> Refresh
            </Button>
            <Button type="button" onClick={() => pushToast({ tone: "info", title: "Logs export started" })}>
              <Download size={16} aria-hidden /> Export Logs
            </Button>
          </div>
        </header>

        <Card className="flex flex-wrap items-center justify-between gap-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search path, webhook event, audit message…" />
          <Badge tone="default">
            {(apiRows.length + whRows.length + evtRows.length).toLocaleString()} results
          </Badge>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-brand-navy">
              <Activity size={16} aria-hidden /> Carrier integration health
            </div>
            <div className="space-y-2">
              {carriers.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-input border border-slate-200 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-brand-navy">{c.name}</p>
                    <p className="text-xs text-slate-500">Latency: {c.latency}</p>
                  </div>
                  <Badge tone={c.status === "Operational" ? "success" : "warning"}>{c.status}</Badge>
                </div>
              ))}
            </div>
            <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Degraded carriers can auto-fallback to cached tracking snapshots (prototype).
            </div>
          </Card>

          <Card className="lg:col-span-2 space-y-3">
            <p className="font-semibold text-brand-navy">API logs</p>
            <div className="overflow-hidden rounded-card border border-slate-200 bg-white">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  {apiTable.getHeaderGroups().map((headerGroup) => (
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
                  {logsQuery.isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-4">
                        <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                      </td>
                    </tr>
                  ) : apiTable.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-sm text-slate-600">No API logs match your search.</td>
                    </tr>
                  ) : (
                    apiTable.getRowModel().rows.map((row) => (
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
              {!logsQuery.isLoading ? (
                <div className="flex items-center justify-between border-t border-slate-100 px-3 py-3 text-sm">
                  <p className="text-slate-600">
                    Page {apiTable.getState().pagination.pageIndex + 1} of {apiTable.getPageCount() || 1}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" type="button" onClick={() => apiTable.previousPage()} disabled={!apiTable.getCanPreviousPage()}>
                      Previous
                    </Button>
                    <Button type="button" onClick={() => apiTable.nextPage()} disabled={!apiTable.getCanNextPage()}>
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-brand-navy">Webhook delivery logs</p>
              <Button
                variant="secondary"
                type="button"
                onClick={() => pushToast({ tone: "info", title: "Retry triggered for failed webhook deliveries" })}
              >
                <RotateCw size={16} aria-hidden /> Retry failed
              </Button>
            </div>
            <div className="overflow-hidden rounded-card border border-slate-200 bg-white">
              <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                <div className="col-span-5">Endpoint</div>
                <div className="col-span-4">Event</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Try</div>
              </div>
              {logsQuery.isLoading ? (
                <div className="p-4">
                  <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                </div>
              ) : whRows.length === 0 ? (
                <div className="p-4 text-sm text-slate-600">No webhook logs match your search.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {whRows.map((w) => (
                    <div key={w.id} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                      <div className="col-span-5 truncate font-mono text-xs text-slate-700">{w.endpoint}</div>
                      <div className="col-span-4 font-mono text-xs text-slate-700">{w.event}</div>
                      <div className="col-span-2">
                        <Badge tone={w.status === "Delivered" ? "success" : w.status === "Failed" ? "danger" : "warning"}>{w.status}</Badge>
                      </div>
                      <div className="col-span-1 text-right text-slate-700">{w.attempts}</div>
                      {w.lastError ? (
                        <div className="col-span-12 -mt-1 pb-2 text-xs text-red-700">{w.lastError}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-3">
            <p className="font-semibold text-brand-navy">Audit events</p>
            <div className="space-y-2">
              {logsQuery.isLoading ? (
                <div className="h-10 animate-pulse rounded-input bg-slate-100" />
              ) : evtRows.length === 0 ? (
                <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No events match your search.</div>
              ) : (
                evtRows.slice(0, 8).map((e) => (
                  <div key={e.id} className="rounded-input border border-slate-200 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <Badge tone="default">{e.kind}</Badge>
                      <p className="text-xs text-slate-500">{e.createdAt}</p>
                    </div>
                    <p className="mt-2 font-semibold text-brand-navy">{e.message}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {payload ? <PayloadModal title={payload.title} payload={payload.body} onClose={() => setPayload(null)} /> : null}
      </section>
    </main>
  );
}
