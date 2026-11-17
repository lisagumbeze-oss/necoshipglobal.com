"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminShipments } from "@/lib/demo/admin-fixtures";

export default function AdminShipmentsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [method, setMethod] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [customer, setCustomer] = useState("");
  const [organization, setOrganization] = useState("");

  const rows = useMemo(() => {
    return demoAdminShipments.filter((s) => {
      if (status !== "All" && s.status !== status) return false;
      if (method !== "All" && s.method !== method) return false;
      if (from && s.bookedAt < from) return false;
      if (to && s.bookedAt > to) return false;
      if (customer && !s.customer.toLowerCase().includes(customer.toLowerCase())) return false;
      if (organization && !(s.organization ?? "").toLowerCase().includes(organization.toLowerCase())) return false;
      const query = q.trim().toLowerCase();
      if (!query) return true;
      return [s.trackingNumber, s.reference, s.customer, s.organization ?? "", s.origin, s.destination].some((v) =>
        v.toLowerCase().includes(query)
      );
    });
  }, [q, status, method, from, to, customer, organization]);

  const methods = Array.from(new Set(demoAdminShipments.map((s) => s.method)));
  const statuses = Array.from(new Set(demoAdminShipments.map((s) => s.status)));

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Global shipment oversight"
        description="Company-wide visibility into demonstration shipments. Administrative visibility does not imply permission to alter operational records."
      />
      <AdminUiNote>
        Do not modify shipment states through these administrative screens. Operational state changes remain outside this
        Module 5 UI stage.
      </AdminUiNote>

      <Card className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <div className="md:col-span-2 xl:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="ship-q">
            Search
          </label>
          <Input id="ship-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tracking, customer, lane…" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="ship-status">
            Status
          </label>
          <select
            id="ship-status"
            className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="ship-method">
            Service
          </label>
          <select
            id="ship-method"
            className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option>All</option>
            {methods.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="ship-from">
            From
          </label>
          <Input id="ship-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="ship-to">
            To
          </label>
          <Input id="ship-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="ship-cust">
            Customer
          </label>
          <Input id="ship-cust" value={customer} onChange={(e) => setCustomer(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="ship-org">
            Organization
          </label>
          <Input id="ship-org" value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Tracking</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Lane</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Booked</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{s.reference}</td>
                <td className="px-4 py-3 font-mono font-semibold text-brand-navy">{s.trackingNumber}</td>
                <td className="px-4 py-3">{s.customer}</td>
                <td className="px-4 py-3">{s.organization ?? "—"}</td>
                <td className="px-4 py-3">
                  {s.origin} → {s.destination}
                </td>
                <td className="px-4 py-3">{s.method}</td>
                <td className="px-4 py-3 whitespace-nowrap">{s.bookedAt}</td>
                <td className="px-4 py-3">
                  <Badge tone={s.status === "EXCEPTION" ? "danger" : s.status === "DELIVERED" ? "success" : "default"}>
                    {s.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">{s.deliveryStatus}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/shipments/${s.trackingNumber}` as never}
                    className="text-sm font-semibold text-brand-navy hover:underline"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
