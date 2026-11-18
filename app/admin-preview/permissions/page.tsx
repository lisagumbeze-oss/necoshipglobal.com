import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import AdminPermissionsPage from "@/app/(admin)/admin/permissions/page";

/** Development-only permission matrix preview. */
export const dynamic = "force-dynamic";

export default function AdminPreviewPermissionsPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AdminShell previewMode>
      <AdminPermissionsPage />
    </AdminShell>
  );
}
