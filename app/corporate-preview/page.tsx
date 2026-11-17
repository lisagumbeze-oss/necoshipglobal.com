import { notFound } from "next/navigation";
import { CorporateShell } from "@/components/corporate/corporate-shell";
import { CorporateDashboardView } from "@/components/corporate/corporate-dashboard-view";

/**
 * Development-only preview of the corporate portal.
 * Returns 404 in Production. Does not bypass authentication on /corporate/* routes.
 */
export const dynamic = "force-dynamic";

export default function CorporatePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <CorporateShell previewMode>
      <CorporateDashboardView />
    </CorporateShell>
  );
}
