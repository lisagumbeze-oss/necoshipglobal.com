import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";

/**
 * Development-only Super Administrator preview.
 * Returns 404 in Production. Does not bypass authentication on /admin/* routes.
 * Does not use RoleSwitcher or impersonation.
 */
export const dynamic = "force-dynamic";

export default function AdminPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AdminShell previewMode>
      <AdminDashboardView />
    </AdminShell>
  );
}
