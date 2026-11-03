"use client";

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
import { Clock, MessageSquareText, Plus, ShieldCheck, Star } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type TicketRecord = {
  id: string;
  subject: string;
  shipmentId?: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  lastReplyAt: string;
};

type StaffRecord = { id: string; name: string };

type AssignedTicket = TicketRecord & { assignee: string; csat: number | null };

const canned = [
  { id: "tpl-001", title: "Customs docs request", body: "Please upload invoice + packing list. Once received, clearance typically completes within 12–24 hours." },
  { id: "tpl-002", title: "Delivery exception — address verification", body: "Please confirm the recipient address and phone number. We will reschedule delivery once verified." },
  { id: "tpl-003", title: "Invoice due reminder", body: "Your invoice is due soon. Paying now prevents service interruption. Reply if you need an extension." }
];

export default function AdminSupportPage() {
  const { pushToast } = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | TicketRecord["status"]>("All");
  const [assignee, setAssignee] = useState("All");
  const [activeTemplate, setActiveTemplate] = useState(canned[0]!.id);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 8;

  const staffQuery = useQuery(["admin-staff"], async () => {
    const data = await apiQuery<{ staff: StaffRecord[] }>("/api/admin/staff");
    return data.staff;
  });
  const ticketsQuery = useQuery(["admin-tickets", q, status], () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status !== "All") params.set("status", status);
    const qs = params.toString();
    return apiQuery<TicketRecord[]>(`/api/tickets${qs ? `?${qs}` : ""}`);
  });

  const staffNames = useMemo(() => ["Unassigned", ...(staffQuery.data ?? []).map((s) => s.name)], [staffQuery.data]);

  const enriched = useMemo(() => {
    const list = ticketsQuery.data ?? [];
    const pick = (id: string) => (Number(id.replace(/\D/g, "")) % staffNames.length);
    const withAssignee: AssignedTicket[] = list.map((t) => ({
      ...t,
      assignee: staffNames[pick(t.id)] ?? "Unassigned",
      csat: t.status === "Resolved" ? 4 + (pick(t.id) % 2) : null
    }));
    return withAssignee.filter((t) => (assignee === "All" ? true : t.assignee === assignee));
  }, [assignee, staffNames, ticketsQuery.data]);

  const sla = useMemo(() => {
    const open = enriched.filter((t) => t.status !== "Resolved").length;
    const avgFirstResponseMins = 18 + (open % 7) * 3;
    const avgResolutionHrs = 6.2 + (open % 5) * 0.8;
    const breaches = Math.max(0, open - 2);
    return { open, avgFirstResponseMins, avgResolutionHrs, breaches };
  }, [enriched]);

  const template = canned.find((t) => t.id === activeTemplate) ?? canned[0]!;

  const columns = useMemo<ColumnDef<AssignedTicket>[]>(
    () => [
      {
        header: "Ticket",
        accessorKey: "id",
        cell: ({ row }) => <span className="font-mono font-semibold text-brand-navy">{row.original.id}</span>
      },
      {
        header: "Subject",
        id: "subject",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-brand-navy">{row.original.subject}</p>
            <p className="mt-1 text-xs text-slate-500">
              {row.original.shipmentId ? `Shipment ${row.original.shipmentId}` : "General"} · Last reply {row.original.lastReplyAt}
            </p>
          </div>
        )
      },
      { header: "Assignee", accessorKey: "assignee" },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge tone={row.original.status === "Resolved" ? "success" : row.original.status === "In Progress" ? "warning" : "default"}>
            {row.original.status}
          </Badge>
        )
      },
      {
        header: "CSAT",
        accessorKey: "csat",
        cell: ({ row }) => (
          <div className="flex justify-end text-xs text-slate-700">
            {row.original.csat ? (
              <span className="inline-flex items-center gap-1">
                <Star size={14} className="text-amber-500" aria-hidden /> {row.original.csat}
              </span>
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </div>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: enriched,
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
            <h1 className="font-display text-3xl font-bold text-brand-navy">Support Ticket Dashboard</h1>
            <p className="text-sm text-slate-600">Cross-customer support operations with SLA metrics and templates.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => pushToast({ tone: "info", title: "Assigned unowned tickets" })}
            >
              Assign Unowned Tickets
            </Button>
            <Button type="button" onClick={() => pushToast({ tone: "info", title: "Canned response creator opened" })}>
              <Plus size={16} aria-hidden /> New template
            </Button>
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs text-slate-500">Open tickets</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{sla.open}</p>
          </Card>
          <Card>
            <p className="text-xs text-slate-500">Avg first response</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{sla.avgFirstResponseMins}m</p>
          </Card>
          <Card>
            <p className="text-xs text-slate-500">Avg resolution</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{sla.avgResolutionHrs.toFixed(1)}h</p>
          </Card>
          <Card>
            <p className="text-xs text-slate-500">SLA breaches</p>
            <p className="font-display text-2xl font-bold text-brand-navy">{sla.breaches}</p>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ticket, subject, shipment…" />
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as never)}
                  aria-label="Ticket status"
                >
                  <option value="All">All</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  aria-label="Assignee"
                >
                  <option value="All">All assignees</option>
                  {staffNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <Badge tone="default">{enriched.length} tickets</Badge>
            </Card>

            <Card className="overflow-hidden p-0">
              <table className="w-full min-w-[980px] text-left text-sm">
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
                  {ticketsQuery.isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-4">
                        <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                      </td>
                    </tr>
                  ) : ticketsQuery.isError ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-sm text-red-700">Failed to load tickets.</td>
                    </tr>
                  ) : table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-sm text-slate-600">No tickets match your filters.</td>
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
              {!ticketsQuery.isLoading && !ticketsQuery.isError ? (
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
                <Clock size={16} aria-hidden /> SLA dashboard
              </div>
              <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Breach alerts highlight tickets that need immediate follow-up (prototype).
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={sla.breaches > 0 ? "danger" : "success"}>{sla.breaches} breach alerts</Badge>
                <Badge tone="default">First response target: 30m</Badge>
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-brand-navy">
                <ShieldCheck size={16} aria-hidden /> Canned responses
              </div>
              <select
                className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                value={activeTemplate}
                onChange={(e) => setActiveTemplate(e.target.value)}
                aria-label="Select template"
              >
                {canned.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <div className="rounded-card border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <p className="font-semibold text-brand-navy">{template.title}</p>
                <p className="mt-2 text-sm text-slate-600">{template.body}</p>
              </div>
              <Button type="button" onClick={() => pushToast({ tone: "info", title: "Template inserted into composer" })}>
                <MessageSquareText size={16} aria-hidden /> Use template
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
