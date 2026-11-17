"use client";

import { useMemo, useState } from "react";
import { Badge, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAuditEntries } from "@/lib/demo/admin-fixtures";

export default function AdminAuditLogsPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return demoAuditEntries;
    return demoAuditEntries.filter((a) =>
      [a.reference, a.user, a.category, a.resource, a.summary, a.outcome].some((v) => v.toLowerCase().includes(query))
    );
  }, [q]);

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Audit logs"
        description="Platform activity records for administrative review. Rows below are clearly labelled demonstration data."
      />
      <AdminUiNote>
        Demonstration audit entries only. Legacy system logs remain under <code className="rounded bg-amber-100 px-1">/admin/system-logs</code>.
      </AdminUiNote>

      <Card>
        <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="aud-q">
          Search audit trail
        </label>
        <Input id="aud-q" className="mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="User, resource, action…" />
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Activity ref</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Summary</th>
              <th className="px-4 py-3">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{a.reference}</td>
                <td className="px-4 py-3">{a.user}</td>
                <td className="px-4 py-3">{a.category}</td>
                <td className="px-4 py-3 font-mono text-xs">{a.resource}</td>
                <td className="px-4 py-3 whitespace-nowrap">{new Date(a.at).toLocaleString()}</td>
                <td className="px-4 py-3">{a.summary}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={a.outcome === "Success" ? "success" : a.outcome === "Denied" ? "warning" : "danger"}
                  >
                    {a.outcome}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
