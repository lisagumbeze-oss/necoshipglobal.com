import { PageShell } from "@/components/pages/page-shell";

export default function ProhibitedItemsPage() {
  return (
    <PageShell
      title="Prohibited & Restricted Items"
      subtitle="Do not tender these commodities without prior written approval and compliant DG documentation."
    >
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
        <li>Illegal narcotics and controlled substances without licenses</li>
        <li>Explosives, fireworks, and undeclared ammunition</li>
        <li>Counterfeit goods and sanctioned-party shipments</li>
        <li>Lithium batteries not meeting packing instructions</li>
        <li>Perishables requiring cold chain without booked special service</li>
        <li>Cash, bullion, and negotiable instruments above policy limits</li>
      </ul>
    </PageShell>
  );
}
