"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminOrganizations } from "@/lib/demo/admin-fixtures";

export default function AdminOrganizationsPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return demoAdminOrganizations;
    return demoAdminOrganizations.filter((o) =>
      [o.reference, o.name, o.country, o.status].some((v) => v.toLowerCase().includes(query))
    );
  }, [q]);

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Corporate organizations"
        description="Company-wide organization directory. Each organization detail remains scoped — confidential data is never shared across tenants."
      />
      <AdminUiNote>
        Outstanding balances and credit statuses are demonstration labels only. No live corporate finance is connected in
        this module.
      </AdminUiNote>

      <Card>
        <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="org-q">
          Search organizations
        </label>
        <Input id="org-q" className="mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, reference, country…" />
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Contract</th>
              <th className="px-4 py-3">Rates</th>
              <th className="px-4 py-3">Credit</th>
              <th className="px-4 py-3">Outstanding</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{o.reference}</td>
                <td className="px-4 py-3 font-semibold text-brand-navy">{o.name}</td>
                <td className="px-4 py-3">{o.country}</td>
                <td className="px-4 py-3">
                  <Badge tone={o.status === "Active" ? "success" : "warning"}>{o.status}</Badge>
                </td>
                <td className="px-4 py-3">{o.contractStatus}</td>
                <td className="px-4 py-3">{o.rateStatus}</td>
                <td className="px-4 py-3">{o.creditStatus}</td>
                <td className="px-4 py-3 text-amber-900">{o.outstandingLabel}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/organizations/${o.id}` as never}
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
