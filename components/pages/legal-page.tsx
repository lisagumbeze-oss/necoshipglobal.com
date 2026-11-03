import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function LegalPage({
  title,
  updated,
  children
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm text-slate-500">{BRAND.name}</p>
        <h1 className="font-display text-3xl font-bold text-brand-navy">{title}</h1>
        <p className="text-sm text-slate-600">Last updated: {updated}</p>
      </header>
      <article className="prose prose-slate max-w-none space-y-4 text-sm leading-relaxed text-slate-700">
        {children}
      </article>
      <p className="text-sm text-slate-500">
        Questions?{" "}
        <Link href={"/contact" as never}>Contact support</Link>
        {" · "}
        <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>
      </p>
    </main>
  );
}
