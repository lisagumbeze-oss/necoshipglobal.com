import Link from "next/link";
import { Badge, Button, Card, Timeline } from "@/components/design-system";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { OpsStatusBadge } from "@/components/operations/ops-status-badge";
import { OpsDemoNote } from "@/components/operations/ops-demo-note";
import {
  demoDeliveryAttempts,
  demoDrivers,
  demoPodPreviews,
  demoRoutes,
  demoVehicles,
  getDelivery
} from "@/lib/demo/operations-fixtures";
import { DELIVERY_STATUS_CONFIG } from "@/lib/demo/operations-status";

export default function DeliveryDetailPage({ params }: { params: { deliveryId: string } }) {
  const delivery = getDelivery(params.deliveryId);
  if (!delivery) {
    return (
      <section className="mx-auto max-w-ns-xl space-y-4">
        <DashboardPageHeader title="Delivery not found" description="No demonstration delivery matches." />
        <Link href={"/admin/deliveries" as never}>
          <Button variant="secondary">Back</Button>
        </Link>
      </section>
    );
  }

  const driver = demoDrivers.find((d) => d.id === delivery.driverId);
  const vehicle = demoVehicles.find((v) => v.id === delivery.vehicleId);
  const attempts = demoDeliveryAttempts.filter((a) => a.deliveryId === delivery.id);
  const pod = demoPodPreviews.find((p) => p.deliveryId === delivery.id);
  const route = demoRoutes.find(
    (r) =>
      (vehicle && r.vehicleId === vehicle.id) ||
      (driver && r.driverId === driver.id) ||
      r.shipmentRefs.includes(delivery.trackingNumber)
  );

  const progressSteps = [
    { id: "assigned", title: "Assigned", done: ["ASSIGNED", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED_ATTEMPT", "RESCHEDULED", "EXCEPTION"].includes(delivery.status) },
    { id: "ofd", title: "Out for delivery", done: ["OUT_FOR_DELIVERY", "DELIVERED", "FAILED_ATTEMPT", "RESCHEDULED", "EXCEPTION"].includes(delivery.status) },
    { id: "attempt", title: "Attempt recorded", done: attempts.length > 0 || delivery.status === "DELIVERED" },
    { id: "complete", title: "Completed / POD", done: delivery.status === "DELIVERED" && Boolean(pod?.available) }
  ];

  const timelineItems = [
    {
      id: "sched",
      title: "Scheduled delivery window",
      description: delivery.instructions,
      meta: delivery.scheduledDate,
      badge: "Plan"
    },
    ...(route
      ? route.stops.map((stop, index) => ({
          id: `stop-${index}`,
          title: `Stop ${index + 1}`,
          description: stop,
          meta: "Schematic stop sequence — not live driver location",
          badge: "Route"
        }))
      : []),
    ...attempts.map((a) => ({
      id: a.id,
      title: a.outcome,
      description: [a.reason, a.followUp].filter(Boolean).join(" · ") || "Attempt recorded in demonstration fixtures",
      meta: `${new Date(a.at).toLocaleString()} · ${a.driverName}`,
      badge: a.outcome.toLowerCase().includes("fail") ? "Failed" : "Attempt",
      tone: (a.outcome.toLowerCase().includes("fail") ? "danger" : "info") as "danger" | "info"
    })),
    ...(delivery.status === "EXCEPTION"
      ? [
          {
            id: "ex",
            title: "Delivery exception",
            description: "Exception state present on demonstration delivery — not a live incident feed.",
            meta: delivery.reference,
            badge: "Exception",
            tone: "danger" as const
          }
        ]
      : [])
  ];

  return (
    <section className="mx-auto max-w-ns-xl space-y-5">
      <DashboardPageHeader
        title={delivery.reference}
        description={`UI-37 delivery route timeline · ${delivery.trackingNumber}`}
        actions={
          <Link href={"/admin/deliveries" as never}>
            <Button variant="secondary">All deliveries</Button>
          </Link>
        }
      />

      <OpsDemoNote title="No live driver location">
        <p>
          Stop sequencing and progress use demonstration fixtures. Completed deliveries and POD appear only when fixture
          evidence exists — nothing is fabricated as live confirmation.
        </p>
      </OpsDemoNote>

      <Card className="flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-brand-yellow">
        <div>
          <p className="ns-meta font-semibold uppercase tracking-wide">Driver route overview</p>
          <p className="mt-1 font-semibold text-brand-navy">{delivery.recipientLabel}</p>
          <p className="ns-meta">{delivery.address}</p>
        </div>
        <OpsStatusBadge
          label={DELIVERY_STATUS_CONFIG[delivery.status].label}
          tone={DELIVERY_STATUS_CONFIG[delivery.status].tone}
        />
      </Card>

      <div className="grid gap-3 sm:grid-cols-4">
        {progressSteps.map((step) => (
          <Card key={step.id} className={`p-3 ${step.done ? "border-l-4 border-l-brand-navy" : ""}`}>
            <p className="ns-meta font-semibold uppercase tracking-wide">{step.title}</p>
            <p className="mt-1 text-sm font-semibold text-brand-navy">{step.done ? "Recorded" : "Not evidenced"}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <Card className="grid gap-3 text-sm sm:grid-cols-2">
            <Field label="Driver" value={driver?.name ?? "Unassigned"} />
            <Field label="Vehicle" value={vehicle?.reference ?? "Unassigned"} />
            <Field label="Scheduled" value={delivery.scheduledDate} />
            <Field label="Route plan" value={route?.label ?? "No linked route fixture"} />
          </Card>

          <Card className="space-y-3">
            <h2 className="ns-card-title">Failed attempts / exceptions</h2>
            {attempts.filter((a) => a.outcome.toLowerCase().includes("fail")).length === 0 &&
            delivery.status !== "EXCEPTION" &&
            delivery.status !== "FAILED_ATTEMPT" ? (
              <p className="ns-body">No failed-attempt fixtures for this delivery.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {attempts
                  .filter((a) => a.outcome.toLowerCase().includes("fail") || delivery.status === "FAILED_ATTEMPT")
                  .map((a) => (
                    <li key={a.id} className="rounded-input border border-brand-danger/30 bg-ns-dangerSoft px-3 py-2">
                      <p className="font-semibold text-brand-danger">{a.outcome}</p>
                      <p className="ns-meta">{new Date(a.at).toLocaleString()}</p>
                      {a.reason ? <p className="mt-1 text-slate-700">{a.reason}</p> : null}
                    </li>
                  ))}
              </ul>
            )}
          </Card>

          <Card className="space-y-2">
            <h2 className="ns-card-title">Proof of delivery state</h2>
            {!pod || !pod.available ? (
              <div className="rounded-input bg-brand-surface-muted p-4 text-sm text-slate-600">
                <p>{pod?.signatureNote ?? "No authorized proof-of-delivery preview is available."}</p>
                <p className="mt-1 text-xs text-amber-800">No fabricated signatures or photos are generated.</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <Badge tone="success">POD available (demo preview)</Badge>
                <p className="text-slate-600">Captured {pod.timestamp ? new Date(pod.timestamp).toLocaleString() : "—"}</p>
                <p className="text-slate-600">Recipient confirmation: {pod.recipientConfirmation}</p>
                <p className="text-slate-600">Driver: {pod.driverName}</p>
                <p className="text-amber-900">{pod.signatureNote}</p>
                <p className="text-amber-900">{pod.photoNote}</p>
                <p className="ns-meta">{pod.locationNote}</p>
              </div>
            )}
          </Card>
        </div>

        <Card className="space-y-3">
          <h2 className="ns-card-title">Delivery progress timeline</h2>
          <p className="ns-meta">Stop sequence and attempts from fixtures — not live GPS breadcrumbs.</p>
          <Timeline items={timelineItems} empty="No timeline events available for this demonstration delivery." />
        </Card>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-ns-border bg-brand-surface-muted px-3 py-2">
      <p className="ns-meta font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-brand-navy">{value}</p>
    </div>
  );
}
