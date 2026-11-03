"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { CheckCircle2, ClipboardList, Upload } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

type AdminShipmentRow = {
  id: string;
  clearanceId?: string;
  destination: string;
  customer: string;
  customsStatus: string;
  broker?: string;
  brokerNotes?: string;
  missingDocs?: string[];
};

const requiredDocs = ["Commercial Invoice", "Packing List", "KYC / ID", "HS Code details"] as const;

export default function CustomsQueuePage() {
  const { pushToast } = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [brokerNotes, setBrokerNotes] = useState("");
  const [shipperMessage, setShipperMessage] = useState("");

  const query = useQuery(["admin-customs", q, status], () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status !== "All") params.set("customsStatus", status);
    const qs = params.toString();
    return apiQuery<AdminShipmentRow[]>(`/api/admin/customs${qs ? `?${qs}` : ""}`);
  });

  const rows = query.data ?? [];

  const selected = rows.find((r) => r.id === selectedId) ?? rows[0] ?? null;

  const patchClearance = async (patch: Record<string, unknown>) => {
    if (!selected) return;
    try {
      await apiQuery("/api/admin/customs", {
        method: "PATCH",
        body: JSON.stringify({
          clearanceId: selected.clearanceId,
          trackingNumber: selected.id,
          ...patch
        })
      });
      await query.refetch();
      pushToast({ tone: "success", title: "Customs updated" });
    } catch (err) {
      pushToast({
        tone: "error",
        title: "Update failed",
        message: err instanceof Error ? err.message : "Try again"
      });
    }
  };

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Customs Queue</h1>
            <p className="text-sm text-slate-600">Pending clearance shipments with doc checklists and broker collaboration (prototype).</p>
          </div>
          <Button type="button" onClick={() => pushToast({ tone: "info", title: "Document upload opened" })}>
            <Upload size={16} aria-hidden /> Upload Documents
          </Button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tracking, customer, destination…" />
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as never)}
                  aria-label="Customs status"
                >
                  <option value="All">All customs statuses</option>
                  <option value="Docs Pending">Docs Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <Badge tone="default">{rows.length} shipments</Badge>
            </Card>

            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                <div className="col-span-3">Shipment</div>
                <div className="col-span-4">Destination</div>
                <div className="col-span-2">Customs status</div>
                <div className="col-span-2">Docs</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {query.isLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-input bg-slate-100" />
                  ))}
                </div>
              ) : query.isError ? (
                <div className="p-4 text-sm text-red-700">Failed to load customs queue.</div>
              ) : rows.length === 0 ? (
                <div className="p-6 text-sm text-slate-600">No customs hold shipments match your filters.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {rows.map((r) => {
                    const missing = r.missingDocs?.length ?? 0;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        className={`grid w-full grid-cols-12 items-center gap-2 px-4 py-3 text-left text-sm hover:bg-slate-50 ${
                          selected?.id === r.id ? "bg-yellow-50" : ""
                        }`}
                        onClick={() => setSelectedId(r.id)}
                      >
                        <div className="col-span-3">
                          <p className="font-mono font-semibold text-brand-navy">{r.id}</p>
                          <p className="text-[11px] text-slate-500">{r.customer}</p>
                        </div>
                        <div className="col-span-4 text-slate-700">{r.destination}</div>
                        <div className="col-span-2">
                          <Badge tone={r.customsStatus === "Docs Pending" ? "warning" : r.customsStatus === "Rejected" ? "danger" : "default"}>
                            {r.customsStatus}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-xs text-slate-600">
                          {missing === 0 ? "Docs complete" : `${missing} missing`}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Link
                            href={`/admin/shipments/${r.id}` as never}
                            className="text-xs font-semibold text-brand-navy underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open
                          </Link>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-brand-navy">
                <ClipboardList size={16} aria-hidden /> Required documents
              </div>
              <p className="text-sm text-slate-600">
                {selected ? `Checklist for ${selected.id}` : "Select a shipment to manage docs."}
              </p>
              <div className="space-y-2">
                {requiredDocs.map((d) => {
                  const missing = selected?.missingDocs?.includes(d);
                  return (
                    <div key={d} className="flex items-center justify-between rounded-input border border-slate-200 p-3 text-sm">
                      <span className="font-semibold text-brand-navy">{d}</span>
                      <div className="flex items-center gap-2">
                        <Badge tone={missing ? "warning" : "success"}>{missing ? "Missing" : "Received"}</Badge>
                        {missing ? (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => void patchClearance({ markDocReceived: d })}
                          >
                            Mark received
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-brand-navy">
                <CheckCircle2 size={16} aria-hidden /> Broker workflow
              </div>
              <p className="text-xs text-slate-500">Broker: {selected?.broker ?? "—"}</p>
              <textarea
                className="min-h-[80px] w-full rounded-input border border-slate-200 px-3 py-2 text-sm"
                placeholder="Broker notes"
                value={brokerNotes}
                onChange={(e) => setBrokerNotes(e.target.value)}
              />
              <textarea
                className="min-h-[70px] w-full rounded-input border border-slate-200 px-3 py-2 text-sm"
                placeholder="Message to shipper"
                value={shipperMessage}
                onChange={(e) => setShipperMessage(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void patchClearance({ status: "UNDER_REVIEW", brokerNotes })}>
                  Under review
                </Button>
                <Button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => void patchClearance({ status: "CLEARED", brokerNotes, messageToShipper: shipperMessage || "Cleared by customs." })}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => void patchClearance({ status: "HOLD", brokerNotes, messageToShipper: shipperMessage || "Additional docs required." })}
                >
                  Hold
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => void patchClearance({ brokerNotes, messageToShipper: shipperMessage })}
                >
                  Send message
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
