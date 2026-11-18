import { notFound } from "next/navigation";
import { CustomerShell } from "@/components/dashboard/customer-shell";
import UserDashboardHomePage from "@/app/(dashboard)/dashboard/page";

/**
 * Development-only preview of the individual customer portal.
 * Returns 404 in Production. Does not bypass authentication on /dashboard/* routes.
 */
export const dynamic = "force-dynamic";

export default function CustomerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <CustomerShell previewMode>
      <UserDashboardHomePage />
    </CustomerShell>
  );
}
