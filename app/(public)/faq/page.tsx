import Link from "next/link";
import { PageShell } from "@/components/pages/page-shell";

const faqs = [
  {
    q: "How do I request a quotation?",
    a: "Use Get a Quote to submit origin, destination, shipping method and cargo details. NECO provides a confirmed quotation — the public form does not invent final shipping charges."
  },
  {
    q: "How do I track a shipment?",
    a: "Open the Tracking page and enter your tracking number. Status, locations and timeline events appear when records are available."
  },
  {
    q: "Can recipients get delivery updates?",
    a: "When a recipient portal link is issued with a booking, recipients can view delivery details through that secure link."
  },
  {
    q: "What items are prohibited?",
    a: "Illegal goods, undeclared weapons and unapproved dangerous goods are not accepted. See the Prohibited Items page for guidance."
  },
  {
    q: "How do corporate rates work?",
    a: "Negotiated rates and commercial contracts are arranged through Contact Sales. We do not publish unverified subscription pricing on the marketing site."
  },
  {
    q: "How do I contact support?",
    a: "Use the Contact or Customer Support pages, or email support@necoshipglobal.com with your tracking or quotation reference."
  }
];

export default function FaqPage() {
  return (
    <PageShell title="FAQ" subtitle="Answers to common quotation, tracking, documentation and support questions.">
      <div className="space-y-4">
        {faqs.map((item) => (
          <details key={item.q} className="rounded-card border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold text-brand-navy">{item.q}</summary>
            <p className="mt-2 text-sm text-slate-600">{item.a}</p>
          </details>
        ))}
        <p className="text-sm text-slate-600">
          More references are available in the{" "}
          <Link href="/resources" className="font-semibold text-brand-navy hover:underline">
            Resources
          </Link>{" "}
          centre.
        </p>
      </div>
    </PageShell>
  );
}
