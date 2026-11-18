import { notFound } from "next/navigation";
import { CorporateShell } from "@/components/corporate/corporate-shell";
import CorporateRatesPage from "@/app/(corporate)/corporate/rates/page";

/** Development-only corporate rates + pricing approval preview. */
export const dynamic = "force-dynamic";

export default function CorporateRatesPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <CorporateShell previewMode>
      <CorporateRatesPage />
    </CorporateShell>
  );
}
