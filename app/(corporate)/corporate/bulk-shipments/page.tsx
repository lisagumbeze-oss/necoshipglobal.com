"use client";

import { useState } from "react";
import { Button, Card } from "@/components/design-system/ui";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { demoOrganization } from "@/lib/demo/corporate-fixtures";

export default function CorporateBulkShipmentsPage() {
  const [notice, setNotice] = useState("");
  const [rows, setRows] = useState("PO-1001,London GB,Rotterdam NL,Road,CC-OPS\nPO-1002,Manchester GB,Dublin IE,Air,CC-RTL");

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <DashboardPageHeader
        title="Bulk shipment request"
        description="Upload or paste a demonstration batch for the sample organization. No live dispatch is performed."
      />
      <Card className="space-y-4">
        <p className="text-sm text-slate-600">
          Organization scope: <span className="font-semibold text-brand-navy">{demoOrganization.tradingName}</span>
        </p>
        <p className="text-xs text-slate-500">CSV columns: reference, origin, destination, method, cost centre</p>
        <textarea
          className="focus-ring min-h-[160px] w-full rounded-input border border-slate-300 p-3 font-mono text-sm"
          value={rows}
          onChange={(e) => setRows(e.target.value)}
          aria-label="Bulk shipment CSV"
        />
        <Button
          type="button"
          onClick={() =>
            setNotice(
              `Demonstration bulk request recorded locally (${rows.trim().split("\n").filter(Boolean).length} lines). Not sent to Production.`
            )
          }
        >
          Submit bulk request (demo)
        </Button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </Card>
    </section>
  );
}
