import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import AdminStaffPage from "@/app/(admin)/admin/staff/page";

/** Development-only staff directory preview. */
export const dynamic = "force-dynamic";

export default function AdminPreviewStaffPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AdminShell previewMode>
      <AdminStaffPage />
    </AdminShell>
  );
}
