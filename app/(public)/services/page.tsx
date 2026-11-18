import Link from "next/link";
import Image from "next/image";
import { Button, Card, ButtonLink } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { PUBLIC_SERVICES } from "@/lib/public-content";
import { PublicCtaBand, PublicPage, PublicPageHeader, PublicSection } from "@/components/public/public-page";

export default function ServicesPage() {
  return (
    <PublicPage>
      <PublicSection>
        <PublicPageHeader
          eyebrow="Capabilities"
          title="Services"
          description={`${BRAND.name} provides multi-mode logistics services for individuals and corporate customers. Transit times and commercial rates are confirmed during quotation for each lane and cargo profile.`}
          actions={
            <>
              <ButtonLink href="/quote">Get a Quote</ButtonLink>
              <ButtonLink href="/contact?topic=corporate" variant="secondary">Contact sales</ButtonLink>
            </>
          }
        />
      </PublicSection>

      <PublicSection tone="white" className="pt-0 md:pt-0">
        <div className="grid gap-4 lg:grid-cols-2">
          {PUBLIC_SERVICES.map(({ id, icon: Icon, label, description, image }) => (
            <Card key={id} id={id} className="scroll-mt-28 overflow-hidden p-0">
              <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[160px] bg-slate-100">
                  <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                </div>
                <div className="space-y-3 p-5">
                  <div className="inline-flex rounded-input bg-brand-yellow/25 p-2 text-brand-navy">
                    <Icon size={18} aria-hidden />
                  </div>
                  <h2 className="font-display text-xl font-bold text-brand-navy">{label}</h2>
                  <p className="text-sm text-slate-600">{description}</p>
                  <Link href="/quote" className="inline-block text-sm font-semibold text-brand-navy hover:underline">
                    Request a quotation
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </PublicSection>

      <PublicSection>
        <PublicCtaBand
          title="Need a tailored programme?"
          description="Corporate logistics, negotiated rates and multi-lane contracts are arranged through our commercial team."
          primaryHref="/contact?topic=corporate"
          primaryLabel="Contact sales"
          secondaryHref="/quote"
          secondaryLabel="Get a Quote"
        />
      </PublicSection>
    </PublicPage>
  );
}
