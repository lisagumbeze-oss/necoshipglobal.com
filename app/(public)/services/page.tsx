import Link from "next/link";
import Image from "next/image";
import { Button, Card } from "@/components/design-system/ui";
import { BRAND } from "@/lib/brand";
import { PUBLIC_SERVICES } from "@/lib/public-content";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-brand-navy">Services</h1>
          <p className="mt-2 text-slate-600">
            {BRAND.name} provides multi-mode logistics services for individuals and corporate customers. Transit times
            and commercial rates are confirmed during quotation for each lane and cargo profile.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/quote">
              <Button>Get a Quote</Button>
            </Link>
            <Link href={"/contact?topic=corporate" as never}>
              <Button variant="secondary">Contact sales</Button>
            </Link>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          {PUBLIC_SERVICES.map(({ id, icon: Icon, label, description, image }) => (
            <Card key={id} id={id} className="scroll-mt-28 overflow-hidden p-0">
              <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[160px] bg-slate-100">
                  <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                </div>
                <div className="space-y-3 p-5">
                  <div className="inline-flex rounded-input bg-yellow-50 p-2 text-brand-navy">
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

        <Card className="bg-brand-navy text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Need a tailored programme?</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">
                Corporate logistics, negotiated rates and multi-lane contracts are arranged through our commercial team.
              </p>
            </div>
            <Link href={"/contact?topic=corporate" as never}>
              <Button>Contact sales</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
