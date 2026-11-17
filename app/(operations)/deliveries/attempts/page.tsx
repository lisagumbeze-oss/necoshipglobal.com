import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoDeliveryAttempts, demoDeliveries } from "@/lib/demo/operations-fixtures";

export default function DeliveryAttemptsPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title="Delivery attempts"
        description="Demonstration attempt history. Outcomes are sample records only."
      />
      <div className="grid gap-3">
        {demoDeliveryAttempts.map((a) => {
          const delivery = demoDeliveries.find((d) => d.id === a.deliveryId);
          return (
            <Card key={a.id} className="space-y-1 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-brand-navy">{a.outcome}</p>
                {delivery ? (
                  <Link href={`/deliveries/${delivery.id}` as never} className="font-mono text-brand-navy hover:underline">
                    {delivery.reference}
                  </Link>
                ) : null}
              </div>
              <p className="text-slate-600">
                {new Date(a.at).toLocaleString()} · {a.driverName}
              </p>
              {a.reason ? <p className="text-slate-600">Reason: {a.reason}</p> : null}
              {a.followUp ? <p className="text-xs text-amber-800">Follow-up: {a.followUp}</p> : null}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
