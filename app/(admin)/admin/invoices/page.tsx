"use client";

import { useMemo, useState } from "react";
import { Badge, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminInvoices } from "@/lib/demo/admin-fixtures";

export default function AdminInvoicesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(demoAdminInvoices[0]?.id ?? "");

  const rows = useMemo(() => {
    return demoAdminInvoices.filter((i) => {
      if (status !== "All" && i.status !== status) return false;
      const query = q.trim().toLowerCase();
      if (!query) return true;
      return [i.reference, i.billingParty, i.customerRef].some((v) => v.toLowerCase().includes(query));
    });
  }, [q, status]);

  const detail = demoAdminInvoices.find((i) => i.id === selected) ?? rows[0];

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Invoice management"
        description="Invoice directory and detail preview. Amounts are demonstration labels only."
      />
      <AdminUiNote>No real invoices are created or modified from this interface.</AdminUiNote>

      <Card className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="inv-q">
            Search
          </label>
          <Input id="inv-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Invoice, party, customer ref…" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="inv-status">
            Status
          </label>
          <select
            id="inv-status"
            className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            <option>Draft</option>
            <option>Due</option>
            <option>Paid</option>
            <option>Overdue</option>
            <option>Void</option>
          </select>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Billing party</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr
                  key={i.id}
                  className={`cursor-pointer border-b border-slate-100 last:border-0 ${selected === i.id ? "bg-slate-50" : ""}`}
                  onClick={() => setSelected(i.id)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{i.reference}</td>
                  <td className="px-4 py-3">{i.billingParty}</td>
                  <td className="px-4 py-3">{i.period}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{i.dueDate}</td>
                  <td className="px-4 py-3 text-amber-900">{i.totalLabel}</td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={i.status === "Paid" ? "success" : i.status === "Overdue" ? "danger" : "warning"}
                    >
                      {i.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {detail ? (
          <Card className="space-y-2 text-sm h-fit">
            <h2 className="font-semibold text-brand-navy">Invoice details</h2>
            <p className="font-mono font-semibold">{detail.reference}</p>
            <p>Customer reference: {detail.customerRef}</p>
            <p>Billing organization / party: {detail.billingParty}</p>
            <p>Billing period: {detail.period}</p>
            <p>Due date: {detail.dueDate}</p>
            <p>Subtotal: {detail.subtotalLabel}</p>
            <p>Tax: {detail.taxLabel}</p>
            <p>Total: {detail.totalLabel}</p>
            <p>Outstanding: {detail.outstandingLabel}</p>
            <p>
              Status: <Badge>{detail.status}</Badge>
            </p>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
