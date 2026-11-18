import Link from "next/link";
import { Button, ButtonLink } from "@/components/design-system/ui";
import { PublicPage, PublicPageHeader, PublicSection } from "@/components/public/public-page";

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
    <PublicPage>
      <PublicSection>
        <PublicPageHeader
          eyebrow="Help"
          title="FAQ"
          description="Answers to common quotation, tracking, documentation and support questions."
          actions={
            <ButtonLink href="/contact" variant="secondary">Contact support</ButtonLink>
          }
        />
      </PublicSection>
      <PublicSection tone="white" className="pt-0 md:pt-0">
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-card border border-ns-border bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-brand-navy">{item.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{item.a}</p>
            </details>
          ))}
          <p className="ns-body pt-2">
            More references are available in the{" "}
            <Link href="/resources" className="font-semibold text-brand-navy hover:underline">
              Resources
            </Link>{" "}
            centre.
          </p>
        </div>
      </PublicSection>
    </PublicPage>
  );
}
