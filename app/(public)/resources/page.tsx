import Link from "next/link";
import { Card } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";

const resources = [
  {
    href: "/faq",
    title: "FAQ",
    text: "Answers to common questions about quotations, tracking and documentation."
  },
  {
    href: "/prohibited-items",
    title: "Prohibited items",
    text: "Guidance on goods that cannot be accepted for transport."
  },
  {
    href: "/dangerous-goods",
    title: "Dangerous goods",
    text: "Overview of restricted materials and documentation expectations."
  },
  {
    href: "/blog",
    title: "Articles",
    text: "Operational notes and shipping guidance from the NECO content library."
  },
  {
    href: "/developers",
    title: "Developer resources",
    text: "API and integration documentation for technical teams."
  },
  {
    href: "/terms",
    title: "Terms and Conditions",
    text: "Legal terms that govern use of NECO services and this website."
  },
  {
    href: "/privacy",
    title: "Privacy Policy",
    text: "How personal data is handled across NECO digital experiences."
  },
  {
    href: "/cookies",
    title: "Cookie Policy",
    text: "Information about cookies and similar technologies used on this site."
  }
] as const;

export default function ResourcesPage() {
  return (
    <main className="bg-brand-surface">
      <div className="ns-container max-w-ns-xl space-y-8 py-10 md:py-14">
        <header className="max-w-3xl">
          <p className="ns-meta font-semibold uppercase tracking-[0.16em] text-brand-navy">Library</p>
          <h1 className="ns-page-title mt-2">Resources</h1>
          <p className="ns-body mt-2 text-base">
            Helpful references for shipping with {BRAND.name}. Use these guides before requesting a quotation or opening
            a support request.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((item) => (
            <Link key={item.href} href={item.href as never} className="block">
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-card">
                <p className="ns-card-title">{item.title}</p>
                <p className="ns-body mt-2">{item.text}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
