import { notFound } from "next/navigation";
import { OperationsShell } from "@/components/operations/operations-shell";
import { OperationsDashboardView } from "@/components/operations/operations-dashboard-view";

/**
 * Development-only preview of the operations portal.
 * Returns 404 in Production. Does not bypass auth on /operations|fleet|warehouses|dispatch|deliveries.
 */
export const dynamic = "force-dynamic";

export default function OperationsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <OperationsShell previewMode>
      <OperationsDashboardView />
    </OperationsShell>
  );
}
