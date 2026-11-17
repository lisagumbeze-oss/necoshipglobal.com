"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminContracts } from "@/lib/demo/admin-fixtures";

const STATUSES = ["All", "Draft", "Pending Review", "Pending Approval", "Active", "Expiring", "Expired", "Suspended"] as const;

export default function AdminContractsPage() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const rows = useMemo(() => {
    if (status === "All") return demoAdminContracts;
    return demoAdminContracts.filter((c) => c.status === status);
  }, [status]);

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Contract management"
        description="Corporate agreement directory. Demonstration documents are not signed legal agreements."
      />
      <AdminUiNote>
        Contract values labelled “not verified” must not be treated as genuine commercial commitments. No live approvals in
        this module.
      </AdminUiNote>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button key={s} type="button" variant={status === s ? "primary" : "secondary"} onClick={() => setStatus(s)}>
            {s}
          </Button>
        ))}
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Effective</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No demonstration contracts in this status.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{c.reference}</td>
                  <td className="px-4 py-3">{c.organization}</td>
                  <td className="px-4 py-3">{c.agreementType}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{c.effectiveFrom}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{c.expiresAt}</td>
                  <td className="px-4 py-3 text-amber-900">{c.valueLabel}</td>
                  <td className="px-4 py-3">
                    <Badge tone={c.status === "Active" ? "success" : "warning"}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/contracts/${c.id}` as never}
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
    </section>
  );
}
