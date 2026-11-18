import { notFound } from "next/navigation";
import { OperationsShell } from "@/components/operations/operations-shell";
import FleetVehiclesPage from "@/app/(operations)/fleet/vehicles/page";

/** Development-only fleet directory preview. */
export const dynamic = "force-dynamic";

export default function OperationsFleetPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <OperationsShell previewMode>
      <FleetVehiclesPage />
    </OperationsShell>
  );
}
