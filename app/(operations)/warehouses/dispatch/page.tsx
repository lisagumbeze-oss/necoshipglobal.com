import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoParcelCustody } from "@/lib/demo/operations-fixtures";
import { PACKAGE_CUSTODY_CONFIG } from "@/lib/demo/operations-status";

export default function WarehouseDispatchPrepPage() {
  const ready = demoParcelCustody.filter((p) =>
    ["READY_FOR_DISPATCH", "LOADED", "RECEIVED", "PROCESSING", "SORTED", "STORED"].includes(p.custody)
  );

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <DashboardPageHeader
        title="Outgoing dispatch preparation"
        description="Packages ready for manifest allocation. Physical custody view — not retail stock quantities."
      />
      <div className="grid gap-3">
        {ready.map((p) => (
          <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-mono font-semibold text-brand-navy">{p.trackingNumber}</p>
              <p className="text-slate-600">
                {p.packageId} · {p.warehouseCode} · {p.binCode ?? "Staging"}
              </p>
              <p className="text-xs text-slate-500">{p.notes}</p>
            </div>
            <OpsStatusBadge label={PACKAGE_CUSTODY_CONFIG[p.custody].label} tone={PACKAGE_CUSTODY_CONFIG[p.custody].tone} />
          </Card>
        ))}
      </div>
      <Card className="text-sm text-slate-600">
        Continue in{" "}
        <Link href={"/dispatch/manifests" as never} className="font-semibold text-brand-navy hover:underline">
          Dispatch manifests
        </Link>{" "}
        to allocate packages (demonstration only).
      </Card>
    </section>
  );
}
