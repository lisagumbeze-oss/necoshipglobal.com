import Image from "next/image";
import Link from "next/link";
import { Button, Card, ButtonLink } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { PublicCtaBand, PublicPage, PublicPageHeader, PublicSection } from "@/components/public/public-page";

export default function AboutPage() {
  return (
    <PublicPage>
      <PublicSection>
        <PublicPageHeader
          eyebrow="Company"
          title={`About ${BRAND.shortName}`}
          description={`${BRAND.officialName} is building a professional international logistics platform that connects quotation, booking coordination, tracking and customer support in one digital experience.`}
          actions={
            <>
              <ButtonLink href="/quote">Get a Quote</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">Contact</ButtonLink>
            </>
          }
        />
      </PublicSection>

      <PublicSection tone="white" className="pt-0 md:pt-0">
        <figure className="space-y-2">
          <div className="relative h-[240px] w-full overflow-hidden rounded-card bg-slate-100 md:h-[400px]">
            <Image
              src="/images/company/hq-exterior.jpg"
              alt={`${BRAND.officialName} facilities exterior`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <figcaption className="ns-meta">NECO logistics facilities imagery</figcaption>
        </figure>
      </PublicSection>

      <PublicSection>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Purpose",
              text: "Help individuals and organisations move goods internationally with clearer process visibility."
            },
            {
              title: "Approach",
              text: "Combine practical logistics workflows with a modern customer website and role-based dashboards."
            },
            {
              title: "Commitment",
              text: "Publish only capabilities we can support. We avoid unverified awards, statistics and testimonials."
            }
          ].map((item) => (
            <Card key={item.title}>
              <p className="ns-card-title">{item.title}</p>
              <p className="ns-body mt-2">{item.text}</p>
            </Card>
          ))}
        </div>
      </PublicSection>

      <PublicSection tone="white">
        <PublicCtaBand
          title="Ready to ship with NECO?"
          description="Request a quotation or speak with our team about corporate logistics programmes."
          primaryHref="/quote"
          primaryLabel="Get a Quote"
          secondaryHref="/contact?topic=corporate"
          secondaryLabel="Contact sales"
        />
      </PublicSection>
    </PublicPage>
  );
}
