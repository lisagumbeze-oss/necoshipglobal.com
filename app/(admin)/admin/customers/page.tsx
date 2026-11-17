"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminNonOperationalNote } from "@/components/admin/admin-ui-note";
import { demoAdminCustomers } from "@/lib/demo/admin-fixtures";

const PAGE_SIZE = 8;

export default function AdminCustomersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Suspended" | "Under review">("All");
  const [verification, setVerification] = useState<"All" | "Verified" | "Pending" | "Unverified">("All");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return demoAdminCustomers.filter((c) => {
      if (status !== "All" && c.status !== status) return false;
      if (verification !== "All" && c.verification !== verification) return false;
      if (!query) return true;
      return [c.reference, c.name, c.email, c.phone, c.category].some((v) => v.toLowerCase().includes(query));
    });
  }, [q, status, verification]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Individual customer management"
        description="Central directory of demonstration customer accounts. Search, filter and review without modifying live records."
      />
      <AdminNonOperationalNote action="Verification, suspension and reactivation" />

      <Card className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="cust-q">
            Search
          </label>
          <Input
            id="cust-q"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Reference, name, email…"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="cust-status">
            Account status
          </label>
          <select
            id="cust-status"
            className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as typeof status);
              setPage(0);
            }}
          >
            <option>All</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Under review</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="cust-ver">
            Verification
          </label>
          <select
            id="cust-ver"
            className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={verification}
            onChange={(e) => {
              setVerification(e.target.value as typeof verification);
              setPage(0);
            }}
          >
            <option>All</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Unverified</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Shipments</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No demonstration customers match these filters.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{c.reference}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-brand-navy">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.email}</p>
                    <p className="text-xs text-slate-500">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{c.registeredAt}</td>
                  <td className="px-4 py-3">
                    <Badge tone={c.verification === "Verified" ? "success" : "warning"}>{c.verification}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={c.status === "Active" ? "success" : c.status === "Suspended" ? "danger" : "warning"}
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{c.shipments}</td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${c.id}` as never}
                      className="text-sm font-semibold text-brand-navy hover:underline"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Showing {rows.length} of {filtered.length} · page {page + 1}/{pageCount}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={page + 1 >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
