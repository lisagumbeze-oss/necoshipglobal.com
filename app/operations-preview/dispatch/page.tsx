import { notFound } from "next/navigation";
import { OperationsShell } from "@/components/operations/operations-shell";
import DispatchQueuePage from "@/app/(operations)/dispatch/queue/page";

/** Development-only dispatch board preview. */
export const dynamic = "force-dynamic";

export default function OperationsDispatchPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <OperationsShell previewMode>
      <DispatchQueuePage />
    </OperationsShell>
  );
}
