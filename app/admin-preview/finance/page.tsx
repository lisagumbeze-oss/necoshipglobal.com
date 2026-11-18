import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import AdminFinancePage from "@/app/(admin)/admin/finance/page";

/** Development-only finance dashboard preview. */
export const dynamic = "force-dynamic";

export default function AdminPreviewFinancePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AdminShell previewMode>
      <AdminFinancePage />
    </AdminShell>
  );
}
