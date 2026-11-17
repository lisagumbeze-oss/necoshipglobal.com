"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ToneBadge } from "@/components/dashboard/status-badge";
import { demoTickets, type DemoSupportTicket } from "@/lib/demo/customer-fixtures";

const toneMap = {
  OPEN: "info",
  PENDING: "warning",
  RESOLVED: "success",
  CLOSED: "default"
} as const;

export default function SupportTicketsPage() {
  const [rows, setRows] = useState<DemoSupportTicket[]>(demoTickets);
  const [selected, setSelected] = useState<DemoSupportTicket | null>(demoTickets[0] ?? null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Tracking");
  const [priority, setPriority] = useState<DemoSupportTicket["priority"]>("MEDIUM");
  const [description, setDescription] = useState("");
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Support"
        description="Demonstration support tickets and conversation timeline. Not live customer service transcripts."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">New support ticket</h2>
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <select
            className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Tracking</option>
            <option>Documentation</option>
            <option>Billing</option>
            <option>Pickup</option>
            <option>Other</option>
          </select>
          <select
            className="focus-ring h-11 w-full rounded-input border border-slate-300 bg-white px-3 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value as DemoSupportTicket["priority"])}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <textarea
            className="focus-ring min-h-[100px] w-full rounded-input border border-slate-300 p-3 text-sm"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            type="button"
            onClick={() => {
              if (!subject.trim() || !description.trim()) {
                setNotice("Subject and description are required.");
                return;
              }
              const ticket: DemoSupportTicket = {
                id: `tkt_local_${Date.now()}`,
                subject,
                category,
                priority,
                status: "OPEN",
                createdAt: new Date().toISOString(),
                messages: [
                  {
                    id: `msg_${Date.now()}`,
                    author: "CUSTOMER",
                    body: description,
                    at: new Date().toISOString()
                  }
                ]
              };
              setRows((prev) => [ticket, ...prev]);
              setSelected(ticket);
              setSubject("");
              setDescription("");
              setNotice("Demonstration ticket created locally.");
            }}
          >
            Create demonstration ticket
          </Button>
          {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <h3 className="text-sm font-semibold text-brand-navy">Ticket history</h3>
            {rows.map((t) => (
              <button
                key={t.id}
                type="button"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => setSelected(t)}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-brand-navy">{t.subject}</p>
                  <ToneBadge label={t.status} tone={toneMap[t.status]} />
                </div>
                <p className="text-xs text-slate-500">
                  {t.category} · {t.priority}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold text-brand-navy">Conversation view</h2>
          {selected ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-brand-navy">{selected.subject}</p>
                <ToneBadge label={selected.status} tone={toneMap[selected.status]} />
              </div>
              <p className="text-xs text-slate-500">
                Priority {selected.priority} · Opened {new Date(selected.createdAt).toLocaleString()}
              </p>
              <ol className="space-y-3">
                {selected.messages.map((m) => (
                  <li
                    key={m.id}
                    className={`rounded-xl px-3 py-2 text-sm ${
                      m.author === "CUSTOMER" ? "bg-yellow-50 text-brand-navy" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                      {m.author === "CUSTOMER" ? "You (demo)" : "Support (demo)"} · {new Date(m.at).toLocaleString()}
                    </p>
                    <p className="mt-1">{m.body}</p>
                  </li>
                ))}
              </ol>
              <textarea
                className="focus-ring min-h-[80px] w-full rounded-input border border-slate-300 p-3 text-sm"
                placeholder="Add a demonstration reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (!reply.trim() || !selected) return;
                  const message = {
                    id: `msg_${Date.now()}`,
                    author: "CUSTOMER" as const,
                    body: reply,
                    at: new Date().toISOString()
                  };
                  const updated = { ...selected, messages: [...selected.messages, message] };
                  setSelected(updated);
                  setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                  setReply("");
                }}
              >
                Post demo reply
              </Button>
            </>
          ) : (
            <p className="text-sm text-slate-500">Select a ticket to view the sample conversation timeline.</p>
          )}
        </Card>
      </div>
    </section>
  );
}
