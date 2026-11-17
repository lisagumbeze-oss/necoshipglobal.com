"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card, Input } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { ADMIN_ROLE_DEFS, demoAdminStaff } from "@/lib/demo/admin-fixtures";

export default function AdminStaffPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return demoAdminStaff;
    return demoAdminStaff.filter((s) =>
      [s.reference, s.name, s.department, s.title, s.roleLabel, s.email].some((v) => v.toLowerCase().includes(query))
    );
  }, [q]);

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Staff directory"
        description="Personnel records are separate from platform privileges. Role labels are representational — unknown roles do not receive administrator access."
      />
      <AdminUiNote>
        This directory does not assign live privileges. Future authorization must enforce permissions at API and data-access
        layers. Do not treat UI role chips as granted access.
      </AdminUiNote>

      <Card>
        <label className="text-xs font-semibold uppercase text-slate-500" htmlFor="staff-q">
          Search staff
        </label>
        <Input id="staff-q" className="mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, department, role…" />
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Job title</th>
              <th className="px-4 py-3">Operational role</th>
              <th className="px-4 py-3">Employment</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{s.reference}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-brand-navy">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.email}</p>
                  <p className="text-xs text-slate-500">{s.phone}</p>
                </td>
                <td className="px-4 py-3">{s.department}</td>
                <td className="px-4 py-3">{s.title}</td>
                <td className="px-4 py-3">{s.roleLabel}</td>
                <td className="px-4 py-3">
                  <Badge tone={s.employmentStatus === "Active" ? "success" : "warning"}>{s.employmentStatus}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={s.accountStatus === "Active" ? "success" : "warning"}>{s.accountStatus}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/staff/${s.id}` as never} className="text-sm font-semibold text-brand-navy hover:underline">
                    Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="space-y-2 text-sm text-slate-600">
        <h2 className="font-semibold text-brand-navy">Future role assignment targets</h2>
        <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_ROLE_DEFS.map((r) => (
            <li key={r.id} className="rounded-md border border-slate-100 px-3 py-2">
              <p className="font-medium text-brand-navy">{r.label}</p>
              <p className="text-[11px] text-slate-500">
                UI id: {r.id} · Prisma hint: {r.prismaHint}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
