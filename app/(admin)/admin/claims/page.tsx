"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoClaimCases } from "@/lib/demo/admin-fixtures";

export default function AdminClaimsPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(demoClaimCases[0]?.id ?? "");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return demoClaimCases;
    return demoClaimCases.filter((c) =>
      [c.reference, c.customer, c.organization ?? "", c.shipmentRef, c.category, c.status].some((v) =>
        v.toLowerCase().includes(query)
      )
    );
  }, [q]);

  const detail = demoClaimCases.find((c) => c.id === selected) ?? rows[0];

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Claims administration"
        description="Central review of shipment claims, damage, loss and delay complaints. Summaries are synthetic — no fabricated conversations."
      />
      <AdminUiNote>
        Claim detail text is labelled demonstration content only. Resolution actions do not update live claim records.
      </AdminUiNote>

      <Card>
        <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="clm-q">
          Search claims
        </label>
        <Input id="clm-q" className="mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reference, customer, shipment…" />
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
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className={`cursor-pointer border-b border-slate-100 ${selected === c.id ? "bg-slate-50" : ""}`}
                  onClick={() => setSelected(c.id)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{c.reference}</td>
                  <td className="px-4 py-3">
                    <p>{c.customer}</p>
                    <p className="text-xs text-slate-500">{c.organization ?? "Individual"}</p>
                  </td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3">
                    <Badge tone={c.priority === "High" ? "danger" : c.priority === "Medium" ? "warning" : "default"}>
                      {c.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {detail ? (
          <Card className="space-y-3 text-sm h-fit">
            <h2 className="font-semibold text-brand-navy">Claim review</h2>
            <p className="font-mono font-semibold">{detail.reference}</p>
            <p>Shipment: {detail.shipmentRef}</p>
            <p>Assigned staff: {detail.assignee}</p>
            <p>Submitted: {detail.submittedAt}</p>
            <p>Resolution summary: {detail.summary}</p>
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Activity history</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-600">
                <li>Case opened (demonstration)</li>
                <li>Assigned to {detail.assignee} (demonstration)</li>
                <li>Status set to {detail.status} (demonstration)</li>
              </ul>
            </div>
            <Button type="button" variant="secondary" disabled>
              Mark resolved
            </Button>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
