import { notFound } from "next/navigation";
import { RecipientPortalView } from "@/components/recipient/recipient-portal-view";
import { demoRecipientPortal } from "@/lib/demo/customer-fixtures";

/**
 * Local development preview of the recipient portal.
 * Returns 404 in Production so it cannot be used as an unrestricted public route.
 * Force dynamic so the NODE_ENV gate is evaluated per request, not baked as static HTML at build time.
 */
export const dynamic = "force-dynamic";

export default function RecipientPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RecipientPortalView data={demoRecipientPortal} />;
}
