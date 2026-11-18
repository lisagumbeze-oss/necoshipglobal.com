import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { demoDeliveries, demoVehicles, getDriver } from "@/lib/demo/operations-fixtures";
import { DRIVER_AVAILABILITY_CONFIG } from "@/lib/demo/operations-status";

export default function DriverDetailPage({ params }: { params: { driverId: string } }) {
  const driver = getDriver(params.driverId);
  if (!driver) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-4">
        <DashboardPageHeader title="Driver not found" description="No demonstration driver matches." />
        <Link href={"/fleet/drivers" as never}>
          <Button variant="secondary">Back</Button>
        </Link>
      </section>
    );
  }
  const vehicle = demoVehicles.find((v) => v.id === driver.assignedVehicleId);
  const history = demoDeliveries.filter((d) => d.driverId === driver.id);

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title={driver.name}
        description={`${driver.reference} · ${driver.region}`}
        actions={
          <Link href={"/fleet/drivers" as never}>
            <Button variant="secondary">Directory</Button>
          </Link>
        }
      />
      <Card className="flex justify-between gap-2">
        <p className="text-sm text-slate-600">Profile status: {driver.profileStatus}</p>
        <OpsStatusBadge
          label={DRIVER_AVAILABILITY_CONFIG[driver.availability].label}
          tone={DRIVER_AVAILABILITY_CONFIG[driver.availability].tone}
        />
      </Card>
      <Card className="grid gap-3 text-sm sm:grid-cols-2">
        <Field label="Email" value={driver.email} />
        <Field label="Phone" value={driver.phone} />
        <Field label="Licence category" value={driver.licenceCategory} />
        <Field label="Licence expiry" value={driver.licenceExpiry} />
        <Field label="Assigned vehicle" value={vehicle?.reference ?? "Unassigned"} />
      </Card>
      <Card className="space-y-2">
        <h2 className="font-semibold text-brand-navy">Delivery history (demo)</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">No demonstration deliveries linked.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {history.map((h) => (
              <li key={h.id}>
                <Link href={`/deliveries/${h.id}` as never} className="font-mono text-brand-navy hover:underline">
                  {h.reference}
                </Link>{" "}
                · {h.status.replaceAll("_", " ")}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-brand-navy">{value}</p>
    </div>
  );
}
