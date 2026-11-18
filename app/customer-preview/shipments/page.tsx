import { notFound } from "next/navigation";
import { CustomerShell } from "@/components/dashboard/customer-shell";
import MyShipmentsPage from "@/app/(dashboard)/shipments/page";

/** Development-only customer shipment register preview. */
export const dynamic = "force-dynamic";

export default function CustomerShipmentsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <CustomerShell previewMode>
      <MyShipmentsPage />
    </CustomerShell>
  );
}
