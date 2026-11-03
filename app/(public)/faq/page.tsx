import { PageShell } from "@/components/pages/page-shell";

const faqs = [
  {
    q: "How do I track a shipment?",
    a: "Use the public Tracking page with up to 10 tracking numbers, or open My Shipments after signing in."
  },
  {
    q: "Can I change a delivery address?",
    a: "Recipients can request redirect, hold, or redelivery from the recipient portal link emailed with booking."
  },
  {
    q: "What items are prohibited?",
    a: "Illegal goods, undeclared weapons, and unapproved dangerous goods are prohibited. See /prohibited-items."
  },
  {
    q: "How do insurance claims work?",
    a: "File a claim from the shipment detail page with photos and invoices. Status updates appear under Claims."
  }
];

export default function FaqPage() {
  return (
    <PageShell title="FAQ" subtitle="Answers to common shipping, tracking, customs, and claims questions.">
      <div className="space-y-4">
        {faqs.map((item) => (
          <details key={item.q} className="rounded-card border border-slate-200 p-4">
            <summary className="cursor-pointer font-semibold text-brand-navy">{item.q}</summary>
            <p className="mt-2 text-sm text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
