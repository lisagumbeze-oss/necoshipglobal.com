"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, Input, ButtonLink } from "@/components/design-system/ui";
import { Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { HOW_SHIPPING_WORKS, PUBLIC_SERVICES, WHY_CHOOSE_NECO } from "@/lib/public-content";
import { PublicCtaBand, PublicPage, PublicSection } from "@/components/public/public-page";

const sectionReveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45 }
};

export default function HomePage() {
  const router = useRouter();
  const [heroTrack, setHeroTrack] = useState("");

  const goTrack = () => {
    const v = heroTrack.trim();
    if (!v) {
      router.push("/tracking" as never);
      return;
    }
    router.push(`/tracking?q=${encodeURIComponent(v)}` as never);
  };

  return (
    <PublicPage>
      {/* UI-19 direction: full-bleed hero, brand-first, dual CTAs — no fabricated ratings/reviews */}
      <section className="relative min-h-[min(92vh,52rem)] overflow-hidden bg-brand-navy text-white">
        <Image
          src="/images/company/operations-floor.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/88 to-brand-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy/40" />

        <div className="relative z-10 mx-auto flex min-h-[min(92vh,52rem)] max-w-ns-xl flex-col justify-end px-4 pb-16 pt-28 md:px-8 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-yellow">{BRAND.name}</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] md:text-5xl lg:text-6xl">
              International logistics with clear process and control
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-200 md:text-lg">
              Structured quotations, shipment tracking and coordinated delivery support for individuals and businesses —
              across air, ocean and road.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/quote" className="min-h-touch px-5">Get a Quote</ButtonLink>
              <ButtonLink href="/tracking"
                  variant="outline"
                  className="min-h-touch border-white/35 bg-transparent px-5 text-white hover:bg-white/10"
                >
                  Track Shipment
                </ButtonLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-10 max-w-xl"
          >
            <Card className="border border-white/15 bg-white/95 p-4 text-brand-navy shadow-overlay backdrop-blur">
              <p className="text-sm font-semibold">Track a shipment</p>
              <p className="ns-meta mt-1">Enter a tracking number to open the tracking workspace.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <Input
                    className="pl-9"
                    value={heroTrack}
                    onChange={(e) => setHeroTrack(e.target.value)}
                    placeholder="Enter tracking number"
                    aria-label="Enter tracking number"
                    onKeyDown={(e) => e.key === "Enter" && goTrack()}
                  />
                </div>
                <Button type="button" className="sm:min-w-[7.5rem]" onClick={goTrack}>
                  Track
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <PublicSection>
        <motion.div {...sectionReveal}>
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-brand-navy">Services</h2>
            <p className="mt-2 text-slate-600">
              Capability-focused logistics services for personal and corporate shipping programmes.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PUBLIC_SERVICES.map(({ icon: Icon, id, label, short, image }) => (
              <Link key={id} href={`/services#${id}` as never} className="group block">
                <Card className="h-full overflow-hidden p-0 transition group-hover:-translate-y-0.5 group-hover:shadow-card">
                  <div className="relative h-28 w-full bg-slate-100">
                    <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="inline-flex rounded-input bg-brand-yellow/25 p-2 text-brand-navy">
                      <Icon size={18} aria-hidden />
                    </div>
                    <p className="font-semibold text-brand-navy">{label}</p>
                    <p className="text-sm text-slate-600">{short}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </PublicSection>

      <PublicSection tone="white">
        <motion.div {...sectionReveal}>
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-brand-navy">Why choose NECO</h2>
            <p className="mt-2 text-slate-600">
              Practical capabilities you can use today — without inflated statistics or unverified awards.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {WHY_CHOOSE_NECO.map((item) => (
              <Card key={item.title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-navy" size={20} aria-hidden />
                <div>
                  <p className="font-semibold text-brand-navy">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </PublicSection>

      <PublicSection>
        <motion.div {...sectionReveal}>
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-brand-navy">How shipping works</h2>
            <p className="mt-2 text-slate-600">A clear path from quotation request to delivery completion.</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_SHIPPING_WORKS.map((step, index) => (
              <li key={step.title}>
                <Card className="h-full">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-navy">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-yellow text-[11px] font-bold">
                      {index + 1}
                    </span>
                    Step {index + 1}
                  </p>
                  <p className="mt-3 font-semibold text-brand-navy">{step.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{step.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </motion.div>
      </PublicSection>

      <PublicSection tone="white">
        <motion.div {...sectionReveal} className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden p-0">
            <div className="relative min-h-[220px] w-full bg-slate-100 md:h-full">
              <Image
                src="/images/company/hq-exterior.jpg"
                alt={`${BRAND.shortName} facilities`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Card>
          <Card className="flex flex-col justify-center space-y-4">
            <h2 className="font-display text-3xl font-bold text-brand-navy">Track with confidence</h2>
            <p className="text-slate-600">
              Use the tracking workspace to look up booking status, route details and shipment events when records are
              available. Empty and unavailable states are handled clearly when a number cannot be found.
            </p>
            <div>
              <ButtonLink href="/tracking">
                  Open tracking <ArrowRight size={16} aria-hidden />
                </ButtonLink>
            </div>
          </Card>
        </motion.div>
      </PublicSection>

      <PublicSection id="corporate">
        <motion.div {...sectionReveal}>
          <PublicCtaBand
            title="Negotiated rates and commercial contracts"
            description="For recurring lanes, multi-site programmes and account-managed logistics, speak with our commercial team. Pricing is confirmed through quotation — we do not publish unsupported subscription packages on this site."
            primaryHref="/contact?topic=corporate"
            primaryLabel="Contact sales"
            secondaryHref="/quote"
            secondaryLabel="Request a quote"
          />
        </motion.div>
      </PublicSection>

      <PublicSection tone="white">
        <motion.div {...sectionReveal}>
          <Card className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-brand-navy">Contact NECO</h2>
              <p className="mt-2 text-slate-600">
                Questions about quotations, tracking, documentation or corporate programmes — our support and sales
                teams are ready to help.
              </p>
              <p className="mt-4 text-sm text-slate-600">
                Email{" "}
                <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${BRAND.supportEmail}`}>
                  {BRAND.supportEmail}
                </a>
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <ButtonLink href="/contact">Go to contact</ButtonLink>
              <ButtonLink href="/support" variant="secondary">Customer support</ButtonLink>
            </div>
          </Card>
        </motion.div>
      </PublicSection>
    </PublicPage>
  );
}
