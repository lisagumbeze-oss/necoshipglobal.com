import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import AdminReportsPage from "@/app/(admin)/admin/reports/page";

/** Development-only reporting preview. */
export const dynamic = "force-dynamic";

export default function AdminPreviewReportsPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AdminShell previewMode>
      <AdminReportsPage />
    </AdminShell>
  );
}