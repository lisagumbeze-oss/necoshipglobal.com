"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { AlertTriangle, Mail, MessageSquareText, RefreshCcw, ShieldCheck, UserPlus } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";

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

type DocumentRecord = {
  id: string;
  type: string;
  shipmentId: string;
  filename: string;
  createdAt: string;
};

type StaffRecord = { id: string; name: string };

function statusTone(status: string) {
  if (status === "Delivered") return "success";
  if (status === "Exception") return "danger";
  if (status === "Customs Hold") return "warning";
  return "default";
}

export default function AdminShipmentDetailPage() {
  const { pushToast } = useToast();
  const notify = (title: string, message?: string, tone: "info" | "success" = "info") =>
    pushToast({ tone, title, message });
  const params = useParams<{ trackingId: string }>();
  const trackingId = decodeURIComponent(params.trackingId);

  const shipmentQuery = useQuery(["admin-shipment", trackingId], async () => {
    const rows = await apiQuery<ShipmentRecord[]>(
      `/api/admin/shipments?q=${encodeURIComponent(trackingId)}`
    );
    return rows.find((s) => s.id.toLowerCase() === trackingId.toLowerCase()) ?? null;
  });
  const docsQuery = useQuery(["admin-documents", trackingId], () =>
    apiQuery<DocumentRecord[]>(`/api/documents?q=${encodeURIComponent(trackingId)}`)
  );
  const staffQuery = useQuery(["admin-staff"], async () => {
    const data = await apiQuery<{ staff: StaffRecord[] }>("/api/admin/staff");
    return data.staff;
  });

  const shipment = shipmentQuery.data;

  const [overrideStatus, setOverrideStatus] = useState<string>("In Transit");
  const [overrideReason, setOverrideReason] = useState("");
  const [assignee, setAssignee] = useState("Unassigned");
  const [exceptionType, setExceptionType] = useState("Customs Hold");
  const [exceptionNote, setExceptionNote] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const auditTrail = useMemo(
    () => [
      { at: "Apr 22, 2026 10:15 UTC", who: "System", what: "Status updated from carrier feed" },
      { at: "Apr 22, 2026 10:18 UTC", who: "Nina V.", what: "Flagged exception for review" },
      { at: "Apr 22, 2026 10:22 UTC", who: "Alex P.", what: "Sent customer update via email" }
    ],
    []
  );

  const carrierRaw = useMemo(() => {
    const loc = shipment?.status === "Customs Hold" ? "Customs facility" : shipment?.destination ?? "—";
    const carrierStatus =
      shipment?.status === "Customs Hold"
        ? "CUSTOMS_HOLD"
        : shipment?.status === "Delivered"
          ? "DELIVERED"
          : shipment?.status === "Exception"
            ? "EXCEPTION"
            : "IN_TRANSIT";
    return JSON.stringify(
      {
        trackingId,
        carrierStatus,
        location: loc,
        lastUpdated: new Date().toISOString(),
        raw: { provider: "PrototypeCarrier", confidence: 0.92 }
      },
      null,
      2
    );
  }, [shipment?.destination, shipment?.status, trackingId]);

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Admin / All Shipments / {trackingId}</p>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Shipment Detail</h1>
            <p className="text-sm text-slate-600">Internal tools: status override, notes, assignment, comms, audit.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {shipment ? <Badge tone={statusTone(shipment.status)}>{shipment.status}</Badge> : null}
            <Button variant="secondary" type="button" onClick={() => shipmentQuery.refetch()} disabled={shipmentQuery.isFetching}>
              <RefreshCcw size={16} aria-hidden /> Refresh
            </Button>
            <Button type="button" onClick={() => notify("Exception escalated")}>
              <AlertTriangle size={16} aria-hidden /> Escalate
            </Button>
          </div>
        </header>

        {shipmentQuery.isLoading ? (
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <div className="h-96 animate-pulse rounded-card bg-slate-100" />
            <div className="h-96 animate-pulse rounded-card bg-slate-100" />
          </div>
        ) : shipmentQuery.isError ? (
          <Card className="text-sm text-red-700">Failed to load shipment.</Card>
        ) : !shipment ? (
          <Card className="text-sm text-slate-600">Shipment not found.</Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4">
              <Card className="space-y-2">
                <p className="font-semibold text-brand-navy">Shipment overview</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-input border border-slate-200 p-3 text-sm">
                    <p className="text-xs text-slate-500">Route</p>
                    <p className="font-semibold text-brand-navy">
                      {shipment.origin} → {shipment.destination}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Service: {shipment.service}</p>
                  </div>
                  <div className="rounded-input border border-slate-200 p-3 text-sm">
                    <p className="text-xs text-slate-500">Recipient</p>
                    <p className="font-semibold text-brand-navy">{shipment.recipient}</p>
                    <p className="mt-1 text-xs text-slate-500">ETA: {shipment.eta}</p>
                  </div>
                </div>
              </Card>

              <Card className="space-y-3">
                <p className="font-semibold text-brand-navy">Operational timeline (prototype)</p>
                {[
                  `${shipment.updatedAt} - Carrier status sync`,
                  `Apr 22, 2026 09:15 UTC - Alert raised to operations queue`,
                  `Apr 21, 2026 13:40 UTC - Pickup scan received`,
                  `Apr 21, 2026 09:25 UTC - Shipment created by customer`
                ].map((item) => (
                  <div key={item} className="rounded-input border border-slate-200 p-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </Card>

              <Card className="space-y-2">
                <p className="font-semibold text-brand-navy">Documents</p>
                {docsQuery.isLoading ? (
                  <div className="h-10 animate-pulse rounded-input bg-slate-100" />
                ) : (docsQuery.data ?? []).length === 0 ? (
                  <div className="rounded-input border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                    No documents found for this shipment.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(docsQuery.data ?? []).map((d) => (
                      <div key={d.id} className="flex items-center justify-between gap-3 rounded-input border border-slate-200 p-3 text-sm">
                        <div>
                          <p className="font-semibold text-brand-navy">{d.type}</p>
                          <p className="text-xs text-slate-500">{d.filename}</p>
                        </div>
                        <Button variant="secondary" type="button" onClick={() => notify("Download started", d.filename)}>
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="space-y-2">
                <p className="font-semibold text-brand-navy">Carrier raw API response</p>
                <pre className="overflow-auto rounded-card border border-slate-200 bg-slate-950 p-3 text-xs text-slate-200">
{carrierRaw}
                </pre>
              </Card>

              <Card className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-brand-navy">Audit trail</p>
                  <Badge tone="default">{auditTrail.length} events</Badge>
                </div>
                <div className="space-y-2">
                  {auditTrail.map((e) => (
                    <div key={e.at} className="rounded-input border border-slate-200 p-3 text-sm">
                      <p className="font-semibold text-brand-navy">{e.what}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {e.at} · {e.who}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="space-y-2">
                <p className="font-semibold text-brand-navy">Status override</p>
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as never)}
                  aria-label="Override status"
                >
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Customs Hold">Customs Hold</option>
                  <option value="Exception">Exception</option>
                </select>
                <Input value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Reason (required for audit)" />
                <Button
                  className="w-full"
                  type="button"
                  disabled={!overrideReason.trim()}
                  onClick={() => notify("Status overridden", `${trackingId} → ${overrideStatus}`)}
                >
                  Apply status change
                </Button>
              </Card>

              <Card className="space-y-2">
                <p className="font-semibold text-brand-navy">Assign to agent</p>
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  aria-label="Assignee"
                >
                  <option value="Unassigned">Unassigned</option>
                  {(staffQuery.data ?? []).map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.id})
                    </option>
                  ))}
                </select>
                <Button className="w-full" variant="secondary" type="button" onClick={() => notify("Shipment assigned", `${trackingId} → ${assignee}`)}>
                  <UserPlus size={16} aria-hidden /> Assign owner
                </Button>
              </Card>

              <Card className="space-y-2">
                <p className="font-semibold text-brand-navy">Exception flag</p>
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={exceptionType}
                  onChange={(e) => setExceptionType(e.target.value)}
                  aria-label="Exception type"
                >
                  {["Lost Package", "Customs Hold", "Delivery Failure", "Address Issue", "Damage Reported", "Carrier Delay"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <textarea
                  className="focus-ring h-24 w-full rounded-input border border-slate-300 p-2 text-sm"
                  placeholder="Exception note (internal)…"
                  value={exceptionNote}
                  onChange={(e) => setExceptionNote(e.target.value)}
                />
                <Button
                  className="w-full"
                  variant="danger"
                  type="button"
                  onClick={() => notify("Exception flagged", `${trackingId} · ${exceptionType}`)}
                >
                  Flag exception
                </Button>
              </Card>

              <Card className="space-y-2">
                <p className="font-semibold text-brand-navy">Internal notes</p>
                <textarea
                  className="focus-ring h-28 w-full rounded-input border border-slate-300 p-2 text-sm"
                  placeholder="Notes are staff-only and included in audit exports."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                />
                <Button
                  className="w-full"
                  variant="ghost"
                  type="button"
                  disabled={!internalNote.trim()}
                  onClick={() => {
                    notify("Internal note saved", undefined, "success");
                    setInternalNote("");
                  }}
                >
                  <ShieldCheck size={16} aria-hidden /> Save internal note
                </Button>
              </Card>

              <Card className="space-y-2">
                <p className="font-semibold text-brand-navy">Customer communication</p>
                <Button className="w-full" type="button" onClick={() => notify("Customer email sent")}>
                  <Mail size={16} aria-hidden /> Send email update
                </Button>
                <Button className="w-full" variant="secondary" type="button" onClick={() => notify("Customer SMS sent")}>
                  <MessageSquareText size={16} aria-hidden /> Send SMS alert
                </Button>
                <Button className="w-full" variant="ghost" type="button" onClick={() => notify("Refund / credit flow opened")}>
                  Initiate refund / credit
                </Button>
              </Card>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
