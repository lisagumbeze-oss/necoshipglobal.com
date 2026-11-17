"use client";

import Link from "next/link";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ToneBadge } from "@/components/dashboard/status-badge";
import { demoClaims } from "@/lib/demo/customer-fixtures";

export default function ClaimDetailPage({ params }: { params: { claimId: string } }) {
  const claim = demoClaims.find((c) => c.id === params.claimId) ?? {
    id: params.claimId,
    reference: params.claimId,
    category: "OTHER" as const,
    shipmentReference: "—",
    status: "SUBMITTED" as const,
    createdAt: new Date().toISOString(),
    summary: "Local demonstration claim detail.",
    documents: [] as string[]
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <DashboardPageHeader
        title={claim.reference}
        description="Claim detail — sample conversation and documents only."
        actions={
          <Link href={"/claims" as never}>
            <Button variant="secondary">Back to claims</Button>
          </Link>
        }
      />
      <Card className="space-y-3">
        <ToneBadge label={claim.status.replaceAll("_", " ")} tone="warning" />
        <p className="text-sm text-slate-600">{claim.summary}</p>
        <p className="text-xs text-slate-500">
          Category {claim.category.replaceAll("_", " ")} · Shipment {claim.shipmentReference}
        </p>
        <p className="text-xs text-slate-500">Created {new Date(claim.createdAt).toLocaleString()}</p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          Supporting documents listed here are demonstration filenames and are not retrieved from external storage.
          <ul className="mt-2 list-disc pl-5">
            {(claim.documents.length ? claim.documents : ["No files"]).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </Card>
    </section>
  );
}
