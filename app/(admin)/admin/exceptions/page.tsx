"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { useToast } from "@/components/feedback/toast-provider";

type ExceptionRecord = {
  id: string;
  type: string;
  priority: string;
  region: string;
  assignee: string;
  raisedAt: string;
  slaMinutes: number;
  note: string;
};

function formatSla(raisedAt: string, slaMinutes: number) {
  // Prototype timer: just shows minutes remaining based on a fixed "now" approximation.
  // (Real implementation would be a live timer based on Date.now())
  const elapsed = (raisedAt.includes("Apr 22") ? 75 : 210) % Math.max(1, slaMinutes);
  const remaining = Math.max(0, slaMinutes - elapsed);
  const h = Math.floor(remaining / 60);
  const m = remaining % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export default function ExceptionsAlertsPage() {
  const { pushToast } = useToast();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [assignee, setAssignee] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const query = useQuery(["admin-exceptions", q, type, region, assignee], () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (region) params.set("region", region);
    if (assignee) params.set("assignee", assignee);
    const qs = params.toString();
    return apiQuery<ExceptionRecord[]>(`/api/admin/exceptions${qs ? `?${qs}` : ""}`);
  });
  const rows = useMemo(() => query.data ?? [], [query.data]);

  const selectedCount = selected.length;
  const hasSelection = selectedCount > 0;

  const highPriority = useMemo(
    () => rows.filter((r: ExceptionRecord) => r.priority === "Critical" || r.priority === "High").length,
    [rows]
  );

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Exceptions & Alerts</h1>
            <p className="text-sm text-slate-600">Urgency queue for shipment incidents and SLA-sensitive actions.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Set Resolution Deadline</Button>
            <Button
              disabled={!hasSelection}
              onClick={() => pushToast({ tone: "info", title: "Exceptions assigned", message: `${selectedCount} selected` })}
            >
              Assign Selected ({selectedCount})
            </Button>
          </div>
        </header>

        <Card className="grid gap-3 md:grid-cols-4">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by tracking # or note" />
          <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Exception type" />
          <Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Region" />
          <Input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Assigned agent" />
        </Card>

        <Card className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="default">{rows.length} items</Badge>
            <Badge tone={highPriority > 0 ? "warning" : "success"}>{highPriority} high priority</Badge>
          </div>
          <Button variant="ghost" onClick={() => setSelected([])}>
            Clear selection
          </Button>
        </Card>

        <Card className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="p-2">Select</th>
                <th className="p-2">Tracking #</th>
                <th className="p-2">Exception</th>
                <th className="p-2">Priority</th>
                <th className="p-2">SLA Timer</th>
                <th className="p-2">Region</th>
                <th className="p-2">Assignee</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <tr>
                  <td colSpan={8} className="p-3">
                    <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                  </td>
                </tr>
              ) : query.isError ? (
                <tr>
                  <td colSpan={8} className="p-3 text-sm text-red-700">
                    Failed to load exceptions. Please try again.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-3 text-sm text-slate-600">
                    No exceptions match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((row: ExceptionRecord) => {
                  const isSelected = selected.includes(row.id);
                  return (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            setSelected((prev) => (e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)))
                          }
                        />
                      </td>
                      <td className="p-2 font-mono">{row.id}</td>
                      <td className="p-2">{row.type}</td>
                      <td className="p-2">
                        <Badge tone={row.priority === "Critical" ? "danger" : row.priority === "High" ? "warning" : "default"}>
                          {row.priority}
                        </Badge>
                      </td>
                      <td className="p-2">{formatSla(row.raisedAt, row.slaMinutes)}</td>
                      <td className="p-2">{row.region}</td>
                      <td className="p-2">{row.assignee}</td>
                      <td className="p-2">
                        <Link href={`/admin/shipments/${row.id}` as never} className="text-brand-navy underline">
                          Resolve
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Card>
      </section>
    </main>
  );
}
