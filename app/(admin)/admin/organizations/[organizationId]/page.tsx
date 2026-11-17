"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import {
  demoAdminContracts,
  demoAdminInvoices,
  demoAdminShipments,
  demoAdminStaff,
  getAdminOrganization
} from "@/lib/demo/admin-fixtures";

export default function AdminOrganizationDetailPage() {
  const params = useParams<{ organizationId: string }>();
  const org = getAdminOrganization(params.organizationId);

  if (!org) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader title="Organization not found" />
        <Link href={"/admin/organizations" as never} className="text-sm font-semibold text-brand-navy hover:underline">
          Back to organizations
        </Link>
      </section>
    );
  }

  const shipments = demoAdminShipments.filter((s) => s.organization === org.name);
  const contracts = demoAdminContracts.filter((c) => c.organization === org.name);
  const invoices = demoAdminInvoices.filter((i) => i.billingParty === org.name);

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title={org.name}
        description={`${org.reference} · Demonstration organization workspace (tenant-scoped view)`}
        actions={
          <Link href={"/admin/organizations" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Back
          </Link>
        }
      />
      <AdminUiNote>
        This detail view shows only demonstration records for <strong>{org.name}</strong>. Confidential information from
        other organizations is never exposed here.
      </AdminUiNote>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Account status", value: org.status },
          { label: "Contract status", value: org.contractStatus },
          { label: "Negotiated rates", value: org.rateStatus },
          { label: "Credit account", value: org.creditStatus }
        ].map((item) => (
          <Card key={item.label} className="space-y-1 p-4">
            <p className="text-[11px] font-semibold uppercase text-slate-500">{item.label}</p>
            <p className="font-semibold text-brand-navy">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Company profile</h2>
          <p>Registration country: {org.country}</p>
          <p>Members (demo count): {org.members}</p>
          <p>Outstanding: <span className="text-amber-900">{org.outstandingLabel}</span></p>
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Departments (demo)</h2>
          <ul className="list-disc space-y-1 pl-5 text-slate-600">
            <li>Logistics operations</li>
            <li>Finance / billing</li>
            <li>Procurement</li>
          </ul>
          <p className="text-xs text-slate-500">
            Staff directory remains separate from organization membership privileges. Sample staff labels:
            {demoAdminStaff.slice(0, 2).map((s) => ` ${s.name}`).join(",")}…
          </p>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold text-brand-navy">Members (demo count preview)</h2>
        <p className="text-sm text-slate-600">
          {org.members} organization members represented for UI review. Member lists are not shared across tenants.
        </p>
      </Card>

      <Card className="overflow-x-auto p-0">
        <div className="border-b border-slate-200 px-4 py-3 font-semibold text-brand-navy">Shipments</div>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Tracking</th>
              <th className="px-4 py-2">Lane</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-slate-500">
                  No demonstration shipments for this organization.
                </td>
              </tr>
            ) : (
              shipments.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-mono text-brand-navy">{s.trackingNumber}</td>
                  <td className="px-4 py-2">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="px-4 py-2">
                    <Badge>{s.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Contracts</h2>
          {contracts.map((c) => (
            <div key={c.id} className="rounded-md border border-slate-100 p-3">
              <p className="font-mono font-semibold text-brand-navy">{c.reference}</p>
              <p>
                {c.status} · {c.agreementType}
              </p>
              <Link href={`/admin/contracts/${c.id}` as never} className="text-brand-navy hover:underline">
                Open contract
              </Link>
            </div>
          ))}
          {contracts.length === 0 ? <p className="text-slate-500">No demonstration contracts.</p> : null}
        </Card>
        <Card className="space-y-2 text-sm">
          <h2 className="font-semibold text-brand-navy">Invoices</h2>
          {invoices.map((i) => (
            <div key={i.id} className="rounded-md border border-slate-100 p-3">
              <p className="font-mono font-semibold text-brand-navy">{i.reference}</p>
              <p>
                {i.status} · {i.totalLabel} · outstanding {i.outstandingLabel}
              </p>
            </div>
          ))}
          {invoices.length === 0 ? <p className="text-slate-500">No demonstration invoices.</p> : null}
        </Card>
      </div>
    </section>
  );
}
