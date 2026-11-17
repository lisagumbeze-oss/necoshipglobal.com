import Link from "next/link";
import { Card, Button } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";
import { demoOrganization, getCorporateShipment } from "@/lib/demo/corporate-fixtures";

export default function CorporateShipmentDetailPage({ params }: { params: { shipmentId: string } }) {
  const shipment = getCorporateShipment(params.shipmentId);

  if (!shipment || shipment.organizationId !== demoOrganization.id) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DashboardPageHeader
          title="Shipment not found"
          description="No demonstration shipment for this organization matches that identifier."
        />
        <Link href={"/corporate/shipments" as never}>
          <Button variant="secondary">Back to shipments</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <DashboardPageHeader
        title={shipment.trackingNumber}
        description={`Reference ${shipment.reference} · demonstration corporate shipment`}
        actions={
          <Link href={"/corporate/shipments" as never}>
            <Button variant="secondary">All shipments</Button>
          </Link>
        }
      />

      <Card className="grid gap-4 sm:grid-cols-2">
        <Info label="Organization" value={demoOrganization.tradingName} />
        <Info label="Status" value={<ShipmentStatusBadge status={shipment.status} />} />
        <Info label="Department" value={shipment.department} />
        <Info label="Cost centre" value={`${shipment.costCentreCode} — ${shipment.costCentreName}`} />
        <Info label="Origin" value={shipment.origin} />
        <Info label="Destination" value={shipment.destination} />
        <Info label="Transport method" value={shipment.method} />
        <Info label="Booking date" value={shipment.bookingDate} />
        <Info label="Delivery date" value={shipment.deliveryDate ?? "Not available"} />
      </Card>

      <Card className="text-sm text-slate-600">
        Future backend queries will scope shipment access by organization membership. This detail view only shows the
        demonstration organization&apos;s sample record.
      </Card>
    </section>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1 text-sm text-brand-navy">{value}</div>
    </div>
  );
}
