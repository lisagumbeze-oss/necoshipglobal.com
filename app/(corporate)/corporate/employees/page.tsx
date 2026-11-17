import { Card, Badge } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  CORPORATE_ROLE_LABELS,
  demoEmployees,
  demoOrganization,
  scopeByOrganization
} from "@/lib/demo/corporate-fixtures";

export default function CorporateEmployeesPage() {
  const employees = scopeByOrganization(demoEmployees);

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Employee directory"
        description="Demonstration organization members and UI role labels mapped to Prisma OrgMemberRole. Permissions cannot be changed here."
      />

      <Card className="text-sm text-slate-600">
        Organization: {demoOrganization.registeredName}. Role controls are representational only — this module does not
        modify authentication or database authorization.
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Organization role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-semibold text-brand-navy">{e.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{e.reference}</td>
                <td className="px-4 py-3">{e.department}</td>
                <td className="px-4 py-3">
                  <span className="block">{e.email}</span>
                  <span className="text-xs text-slate-500">{e.phone}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={e.accountStatus === "Active" ? "success" : "warning"}>{e.accountStatus}</Badge>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-navy">{CORPORATE_ROLE_LABELS[e.role]}</p>
                  <p className="text-[11px] text-slate-500">Prisma: {e.role}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="space-y-2 text-sm text-slate-600">
        <h2 className="font-semibold text-brand-navy">Role representations</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Organization Administrator (ORG_ADMIN)</strong> — overview, company profile, employee directory,
            shipment oversight.
          </li>
          <li>
            <strong>Shipment Manager (SHIPPER)</strong> — shipment and bulk requests, quotations, tracking.
          </li>
          <li>
            <strong>Billing Manager (BILLING)</strong> — invoices, statements, financial reports, billing contacts.
          </li>
          <li>
            <strong>Viewer (VIEWER)</strong> — read-only access to authorized company information.
          </li>
        </ul>
        <p className="text-xs text-amber-800">
          Users cannot change their own permissions through these simulated dashboard controls.
        </p>
      </Card>
    </section>
  );
}
