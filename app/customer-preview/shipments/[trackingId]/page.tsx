import { notFound } from "next/navigation";
import { CustomerShell } from "@/components/dashboard/customer-shell";
import ShipmentDetailPage from "@/app/(dashboard)/shipments/[trackingId]/page";

/** Development-only customer shipment detail preview. */
export const dynamic = "force-dynamic";

export default function CustomerShipmentDetailPreviewPage({
  params
}: {
  params: { trackingId: string };
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <CustomerShell previewMode>
      <ShipmentDetailPage params={params} />
    </CustomerShell>
  );
}
