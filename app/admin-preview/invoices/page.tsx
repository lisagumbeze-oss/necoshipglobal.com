import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import AdminInvoicesPage from "@/app/(admin)/admin/invoices/page";

/** Development-only accounts receivable preview. */
export const dynamic = "force-dynamic";

export default function AdminPreviewInvoicesPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AdminShell previewMode>
      <AdminInvoicesPage />
    </AdminShell>
  );
}
