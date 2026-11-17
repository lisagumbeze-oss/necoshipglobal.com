import Link from "next/link";
import { Card, Badge } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  demoCorporateShipments,
  demoCostCentres,
  demoOrganization,
  scopeByOrganization
} from "@/lib/demo/corporate-fixtures";

export default function CorporateCostCentresPage() {
  const centres = scopeByOrganization(demoCostCentres);
  const shipments = scopeByOrganization(demoCorporateShipments);

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <DashboardPageHeader
        title="Cost centres"
        description="Demonstration cost-centre structure for the sample organization. Expenditure and budgets are synthetic."
      />

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">Shipments</th>
              <th className="px-4 py-3">Expenditure</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Remaining</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {centres.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono font-semibold text-brand-navy">{c.code}</td>
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">{c.department}</td>
                <td className="px-4 py-3">{c.manager}</td>
                <td className="px-4 py-3">{c.shipmentCount}</td>
                <td className="px-4 py-3 text-amber-900">{c.expenditureLabel}</td>
                <td className="px-4 py-3 text-amber-900">{c.budgetLabel}</td>
                <td className="px-4 py-3 text-amber-900">{c.remainingLabel}</td>
                <td className="px-4 py-3">
                  <Badge tone={c.status === "Active" ? "success" : "default"}>{c.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div>
        <h2 className="mb-3 font-semibold text-brand-navy">Shipment allocation by cost centre</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {centres.map((c) => {
            const linked = shipments.filter((s) => s.costCentreCode === c.code);
            return (
              <Card key={c.id} className="space-y-2">
                <p className="font-semibold text-brand-navy">
                  {c.code} — {c.name}
                </p>
                {linked.length === 0 ? (
                  <p className="text-sm text-slate-500">No demonstration shipments allocated.</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {linked.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/corporate/shipments/${s.trackingNumber}` as never}
                          className="font-mono text-brand-navy hover:underline"
                        >
                          {s.trackingNumber}
                        </Link>
                        <span className="text-slate-500"> · {s.destination}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="text-sm text-slate-600">
        Organization scope: {demoOrganization.tradingName}. Reporting charts for expenditure by department and service are
        available under{" "}
        <Link href={"/corporate/reports" as never} className="font-semibold text-brand-navy underline-offset-2 hover:underline">
          Reports
        </Link>
        .
      </Card>
    </section>
  );
}
