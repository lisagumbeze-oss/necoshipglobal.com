import { storeObject } from "@/lib/services/storage";

export type CommercialInvoiceInput = {
  trackingNumber: string;
  invoiceNumber: string;
  shipperName: string;
  shipperAddress: string;
  consigneeName: string;
  consigneeAddress: string;
  commodity: string;
  hsCode?: string | null;
  quantity: number;
  weightKg: number;
  declaredValueCents: number;
  currency: string;
  incoterms?: string | null;
  originCountry: string;
  destCountry: string;
};

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(cents / 100);
}

/** Generate a customs-ready commercial invoice as HTML (printable / archive). */
export function buildCommercialInvoiceHtml(input: CommercialInvoiceInput) {
  const unitValue = input.quantity > 0 ? Math.round(input.declaredValueCents / input.quantity) : input.declaredValueCents;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Commercial Invoice ${input.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #0B1F3A; margin: 32px; font-size: 12px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .muted { color: #64748B; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #CBD5E1; padding: 8px; text-align: left; }
    th { background: #F1F5F9; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .box { border: 1px solid #CBD5E1; padding: 12px; border-radius: 6px; }
  </style>
</head>
<body>
  <h1>Commercial Invoice</h1>
  <p class="muted">NecoShip Global · Invoice ${input.invoiceNumber} · Tracking ${input.trackingNumber}</p>
  <div class="grid">
    <div class="box">
      <strong>Shipper / Exporter</strong>
      <p>${escapeHtml(input.shipperName)}<br/>${escapeHtml(input.shipperAddress)}<br/>Origin: ${escapeHtml(input.originCountry)}</p>
    </div>
    <div class="box">
      <strong>Consignee / Importer</strong>
      <p>${escapeHtml(input.consigneeName)}<br/>${escapeHtml(input.consigneeAddress)}<br/>Destination: ${escapeHtml(input.destCountry)}</p>
    </div>
  </div>
  <p><strong>Incoterms:</strong> ${escapeHtml(input.incoterms || "DDP")} &nbsp;|&nbsp; <strong>Currency:</strong> ${escapeHtml(input.currency)}</p>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>HS Code</th>
        <th>Qty</th>
        <th>Weight (kg)</th>
        <th>Unit Value</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${escapeHtml(input.commodity || "General merchandise")}</td>
        <td>${escapeHtml(input.hsCode || "—")}</td>
        <td>${input.quantity}</td>
        <td>${input.weightKg}</td>
        <td>${money(unitValue, input.currency)}</td>
        <td>${money(input.declaredValueCents, input.currency)}</td>
      </tr>
    </tbody>
  </table>
  <p style="margin-top:24px" class="muted">I declare that the information on this invoice is true and correct.</p>
  <p>Authorized signature: ______________________ &nbsp; Date: ${new Date().toISOString().slice(0, 10)}</p>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function generateAndStoreCommercialInvoice(input: CommercialInvoiceInput) {
  const html = buildCommercialInvoiceHtml(input);
  const stored = await storeObject({
    folder: "customs",
    key: `customs/${input.trackingNumber}-commercial-invoice.html`,
    body: html,
    mimeType: "text/html"
  });
  return {
    ...stored,
    filename: `${input.trackingNumber}-commercial-invoice.html`,
    type: "COMMERCIAL_INVOICE" as const,
    html
  };
}

export function defaultDocsChecklist(intl: boolean) {
  if (!intl) return { required: [] as string[], received: [] as string[] };
  return {
    required: ["Commercial Invoice", "Packing List", "HS Codes"],
    received: ["Commercial Invoice"] as string[]
  };
}
