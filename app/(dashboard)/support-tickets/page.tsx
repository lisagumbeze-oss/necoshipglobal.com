"use client";

import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { apiQuery } from "@/lib/query-api";
import { MessageSquare, Plus, Send, Tag } from "lucide-react";
import { useToast } from "@/components/feedback/toast-provider";
import { useQueryClient } from "react-query";

type TicketRecord = {
  id: string;
  subject: string;
  shipmentId?: string;
  status: "Open" | "In Progress" | "Resolved" | string;
  createdAt: string;
  lastReplyAt: string;
};

function statusTone(status: TicketRecord["status"]) {
  if (status === "Resolved") return "success";
  if (status === "In Progress") return "warning";
  return "default";
}

function NewTicketModal({
  onClose,
  onCreated
}: {
  onClose: () => void;
  onCreated: (title: string, message?: string) => void;
}) {
  const [subject, setSubject] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [priority, setPriority] = useState<"Low" | "Normal" | "High">("Normal");
  const [message, setMessage] = useState("");

  const canSubmit = subject.trim().length >= 6 && message.trim().length >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-label="Create ticket">
      <Card className="w-full max-w-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Support</p>
            <p className="font-display text-xl font-bold text-brand-navy">Create Ticket</p>
          </div>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Subject (e.g., Customs hold documents)" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Input
            placeholder="Related shipment ID (optional)"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
          />
          <label className="md:col-span-2 text-xs font-semibold text-slate-600">
            Priority
            <select
              className="mt-1 w-full rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
              value={priority}
              onChange={(e) => setPriority(e.target.value as never)}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </label>
          <label className="md:col-span-2 text-xs font-semibold text-slate-600">
            Description
            <textarea
              className="mt-1 min-h-[120px] w-full rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Include tracking ID, recipient details, and any screenshots if relevant."
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            SLA hint: High priority is best for clearance delays and delivery exceptions.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={async () => {
                try {
                  await apiQuery("/api/tickets", {
                    method: "POST",
                    body: JSON.stringify({
                      subject,
                      shipmentId: shipmentId || undefined,
                      body: message,
                      priority
                    })
                  });
                  onCreated("Ticket created", `${subject} · Priority: ${priority}`);
                  onClose();
                } catch (err) {
                  onCreated("Could not create ticket", err instanceof Error ? err.message : "Try again");
                }
              }}
            >
              <Plus size={16} aria-hidden /> Create
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function SupportTicketsPage() {
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const onNotify = (title: string, message?: string) => pushToast({ tone: "info", title, message });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | TicketRecord["status"]>("All");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [reply, setReply] = useState("");

  const ticketsQuery = useQuery(["tickets", q, status], () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status !== "All") params.set("status", status);
    const qs = params.toString();
    return apiQuery<TicketRecord[]>(`/api/tickets${qs ? `?${qs}` : ""}`);
  });

  const tickets = ticketsQuery.data ?? [];
  const active = useMemo(() => tickets.find((t) => t.id === activeId) ?? null, [tickets, activeId]);

  return (
    <main className="min-h-screen bg-brand-surface p-4 md:p-8">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy">Support Tickets</h1>
            <p className="text-sm text-slate-600">Track issues, share shipment context, and resolve faster.</p>
          </div>
          <Button type="button" onClick={() => setShowCreate(true)}>
            <Plus size={16} aria-hidden /> Create Ticket
          </Button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input placeholder="Search ticket ID, subject, or shipment…" value={q} onChange={(e) => setQ(e.target.value)} />
                <select
                  className="rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as never)}
                  aria-label="Filter tickets by status"
                >
                  <option value="All">All</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <Badge tone="default">{tickets.length} tickets</Badge>
            </Card>

            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                <div className="col-span-3">Ticket</div>
                <div className="col-span-5">Subject</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Updated</div>
              </div>

              {ticketsQuery.isLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-input bg-slate-100" />
                  ))}
                </div>
              ) : ticketsQuery.isError ? (
                <div className="p-4 text-sm text-red-700">Failed to load tickets. Please try again.</div>
              ) : tickets.length === 0 ? (
                <div className="p-6 text-sm text-slate-600">No tickets found. Create one to get help quickly.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {tickets.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`grid w-full grid-cols-12 items-center gap-2 px-4 py-3 text-left text-sm hover:bg-slate-50 focus-ring ${
                        activeId === t.id ? "bg-slate-50" : ""
                      }`}
                      onClick={() => setActiveId(t.id)}
                    >
                      <div className="col-span-3 font-semibold text-brand-navy">{t.id}</div>
                      <div className="col-span-5 text-slate-700">{t.subject}</div>
                      <div className="col-span-2">
                        <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                      </div>
                      <div className="col-span-2 text-right text-xs text-slate-500">{t.lastReplyAt}</div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">Ticket details</p>
                  <p className="text-xs text-slate-500">Select a ticket to view the conversation.</p>
                </div>
                {active ? <Badge tone={statusTone(active.status)}>{active.status}</Badge> : null}
              </div>

              {active ? (
                <>
                  <div className="rounded-input border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">Subject</p>
                    <p className="font-semibold text-brand-navy">{active.subject}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Tag size={14} aria-hidden /> {active.id}
                      </span>
                      {active.shipmentId ? (
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare size={14} aria-hidden /> Shipment: {active.shipmentId}
                        </span>
                      ) : (
                        <span className="text-slate-500">No shipment linked</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-card bg-slate-50 p-3 text-sm">
                      <p className="text-xs font-semibold text-slate-600">NecoShip Support</p>
                      <p className="mt-1 text-slate-700">
                        Thanks—our team is reviewing the details. If this is customs-related, uploading invoice + packing list
                        usually clears within 12–24 hours.
                      </p>
                      <p className="mt-2 text-xs text-slate-500">Last updated: {active.lastReplyAt}</p>
                    </div>
                    <div className="rounded-card bg-white p-3 text-sm">
                      <p className="text-xs font-semibold text-slate-600">You</p>
                      <p className="mt-1 text-slate-700">
                        {active.shipmentId
                          ? `Need help with shipment ${active.shipmentId}. Please advise next steps.`
                          : "I have a billing question regarding recent charges."}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">Created: {active.createdAt}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600">
                      Reply
                      <textarea
                        className="mt-1 min-h-[110px] w-full rounded-input border border-slate-200 bg-white px-3 py-2 text-sm focus-ring"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Add details, attach references, or ask for an update…"
                      />
                    </label>
                    <div className="flex flex-wrap justify-between gap-2">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => onNotify("Attachment picker opened")}
                      >
                        Attach
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => onNotify("Ticket marked as resolved")}
                          disabled={active.status === "Resolved"}
                        >
                          Close ticket
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            if (!reply.trim()) return;
                            onNotify("Reply sent");
                            setReply("");
                          }}
                          disabled={!reply.trim()}
                        >
                          <Send size={16} aria-hidden /> Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-card border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  Choose a ticket from the list to view details and respond.
                </div>
              )}
            </Card>
          </div>
        </div>

        {showCreate ? (
          <NewTicketModal
            onClose={() => setShowCreate(false)}
            onCreated={async (title, message) => {
              onNotify(title, message);
              await queryClient.invalidateQueries(["tickets"]);
            }}
          />
        ) : null}
      </section>
    </main>
  );
}
