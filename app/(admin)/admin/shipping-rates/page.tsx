import Link from "next/link";
import { Badge, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AdminUiNote } from "@/components/admin/admin-ui-note";
import { demoAdminRateCards } from "@/lib/demo/admin-fixtures";

export default function AdminShippingRatesPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <DashboardPageHeader
        title="Negotiated rate cards"
        description="Corporate rate-card directory for commercial review. Figures are demonstration bands, not live tariffs."
        actions={
          <Link href={"/admin/rate-approvals" as never} className="text-sm font-semibold text-brand-navy hover:underline">
            Rate approvals
          </Link>
        }
      />
      <AdminUiNote>
        Rate cards shown here are synthetic. Do not treat values as approved commercial pricing. Legacy API rate-card tools
        remain under <code className="rounded bg-amber-100 px-1">/admin/rate-cards</code>.
      </AdminUiNote>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Lane</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Weight band</th>
              <th className="px-4 py-3">Minimum</th>
              <th className="px-4 py-3">Surcharges</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Validity</th>
              <th className="px-4 py-3">Approval</th>
            </tr>
          </thead>
          <tbody>
            {demoAdminRateCards.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-navy">{r.reference}</td>
                <td className="px-4 py-3">{r.organization}</td>
                <td className="px-4 py-3">
                  {r.origin} → {r.destination}
                </td>
                <td className="px-4 py-3">{r.service}</td>
                <td className="px-4 py-3">{r.weightBand}</td>
                <td className="px-4 py-3 text-amber-900">{r.minimumLabel}</td>
                <td className="px-4 py-3">{r.surcharges}</td>
                <td className="px-4 py-3">{r.currency}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {r.validFrom} – {r.validTo}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={r.approvalStatus === "Approved" ? "success" : "warning"}>{r.approvalStatus}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
