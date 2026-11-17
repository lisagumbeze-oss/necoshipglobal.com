"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoSupportTickets } from "@/lib/demo/admin-fixtures";

export default function AdminSupportDeskPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(demoSupportTickets[0]?.id ?? "");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return demoSupportTickets;
    return demoSupportTickets.filter((t) =>
      [t.reference, t.customer, t.category, t.subject, t.status].some((v) => v.toLowerCase().includes(query))
    );
  }, [q]);

  const detail = demoSupportTickets.find((t) => t.id === selected) ?? rows[0];
  const escalated = demoSupportTickets.filter((t) => t.status === "Escalated");

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Customer support desk"
        description="Support tickets, escalated enquiries and dispute triage. Ticket subjects are demonstration placeholders."
      />
      <AdminUiNote>
        Do not fabricate customer conversation transcripts. Legacy support tools remain available under{" "}
        <code className="rounded bg-amber-100 px-1">/admin/support</code>.
      </AdminUiNote>

      <Card className="text-sm">
        <p className="font-semibold text-brand-navy">Escalated enquiries</p>
        <p className="mt-1 text-slate-600">
          {escalated.length === 0
            ? "No escalated demonstration tickets."
            : escalated.map((t) => `${t.reference} (${t.customer})`).join(" · ")}
        </p>
      </Card>

      <Card>
        <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="sup-q">
          Search tickets
        </label>
        <Input id="sup-q" className="mt-1" value={q} onChange={(e) => setQ(e.target.value)} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr
                  key={t.id}
                  className={`cursor-pointer border-b border-slate-100 ${selected === t.id ? "bg-slate-50" : ""}`}
                  onClick={() => setSelected(t.id)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{t.reference}</td>
                  <td className="px-4 py-3">{t.customer}</td>
                  <td className="px-4 py-3">{t.category}</td>
                  <td className="px-4 py-3">
                    <Badge tone={t.priority === "High" ? "danger" : "default"}>{t.priority}</Badge>
                  </td>
                  <td className="px-4 py-3">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {detail ? (
          <Card className="space-y-3 text-sm h-fit">
            <h2 className="font-semibold text-brand-navy">Ticket review</h2>
            <p className="font-mono font-semibold">{detail.reference}</p>
            <p>Subject: {detail.subject}</p>
            <p>Assignee: {detail.assignee}</p>
            <p>Submitted: {detail.submittedAt}</p>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              Activity history preview uses status transitions only — no invented chat transcripts.
            </div>
            <Button type="button" variant="secondary" disabled>
              Escalate further
            </Button>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
