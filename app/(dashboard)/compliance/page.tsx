"use client";

import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/design-system/ui";
import { PageShell } from "@/components/pages/page-shell";
import { apiFetch } from "@/lib/client-api";
import { useToast } from "@/components/feedback/toast-provider";

export default function CompliancePage() {
  const { pushToast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [exportPreview, setExportPreview] = useState("");

  const requestExport = async () => {
    setExporting(true);
    const result = await apiFetch<unknown>("/api/compliance/export", { method: "POST" });
    setExporting(false);
    if (!result.ok) {
      pushToast({ tone: "error", title: "Export failed", message: result.error });
      return;
    }
    setExportPreview(JSON.stringify(result.data, null, 2));
    pushToast({ tone: "success", title: "Export ready" });
  };

  const requestDelete = async () => {
    if (!confirmEmail.trim()) {
      pushToast({ tone: "error", title: "Confirm your email", message: "Type your account email to purge data." });
      return;
    }
    setDeleting(true);
    const result = await apiFetch<{ status: string; purged?: Record<string, number> }>("/api/compliance/delete", {
      method: "POST",
      body: JSON.stringify({ confirm: "DELETE", immediate: true })
    });
    setDeleting(false);
    if (!result.ok) {
      pushToast({ tone: "error", title: "Delete request failed", message: result.error });
      return;
    }
    pushToast({
      tone: "success",
      title: result.data.status === "purged" ? "Account data purged" : "Deletion queued",
      message:
        result.data.status === "purged"
          ? `Removed ${Object.values(result.data.purged ?? {}).reduce((a, b) => a + b, 0)} records for ${confirmEmail}.`
          : `Status: ${result.data.status}`
    });
  };

  return (
    <PageShell
      title="Compliance"
      subtitle="GDPR data export / erasure requests and sanctions screening guidance."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-brand-navy">Export my data</p>
            <Badge>GDPR Art. 15</Badge>
          </div>
          <p className="text-sm text-slate-600">
            Download a machine-readable copy of account, shipment, billing, and claim records.
          </p>
          <Button type="button" disabled={exporting} onClick={() => void requestExport()}>
            {exporting ? "Preparing…" : "Request export"}
          </Button>
          {exportPreview ? (
            <textarea
              readOnly
              className="min-h-[220px] w-full rounded-input border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs"
              value={exportPreview}
            />
          ) : null}
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-brand-navy">Delete my account</p>
            <Badge tone="danger">GDPR Art. 17</Badge>
          </div>
          <p className="text-sm text-slate-600">
            Submit an erasure request. Active shipments and legal retention holds may delay completion.
          </p>
          <Input
            type="email"
            placeholder="Confirm account email (for your records)"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
          <Button type="button" variant="danger" disabled={deleting} onClick={() => void requestDelete()}>
            {deleting ? "Submitting…" : "Request deletion"}
          </Button>
        </Card>
      </div>

      <Card className="mt-4 space-y-2">
        <p className="font-semibold text-brand-navy">Sanctions & denied-party screening</p>
        <p className="text-sm text-slate-600">
          NecoShip screens shippers and consignees against applicable sanctions lists before label release. Hits are
          reviewed by compliance and are not exposed in self-serve exports. Contact compliance@necoship.global for
          regulated disclosures.
        </p>
      </Card>
    </PageShell>
  );
}
