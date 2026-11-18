import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/design-system/ui";

export function PublicPage({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={cn("bg-brand-surface", className)}>{children}</main>;
}

export function PublicSection({
  children,
  className,
  tone = "surface",
  id
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "white" | "navy";
  id?: string;
}) {
  const toneClass =
    tone === "white" ? "bg-white" : tone === "navy" ? "bg-brand-navy text-white" : "bg-brand-surface";
  return (
    <section id={id} className={cn(toneClass, "px-4 py-12 md:px-8 md:py-16", className)}>
      <div className="ns-container max-w-ns-xl">{children}</div>
    </section>
  );
}

export function PublicPageHeader({
  title,
  description,
  actions,
  eyebrow
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="max-w-3xl space-y-3">
      {eyebrow ? <p className="ns-meta font-semibold uppercase tracking-[0.16em] text-brand-navy">{eyebrow}</p> : null}
      <h1 className="ns-page-title">{title}</h1>
      {description ? <p className="ns-body text-base text-slate-600 md:text-lg">{description}</p> : null}
      {actions ? <div className="flex flex-wrap gap-3 pt-2">{actions}</div> : null}
    </header>
  );
}

export function PublicCtaBand({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-white/10 bg-brand-navy text-white shadow-card">
      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_auto] md:items-center md:p-8">
        <div>
          <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
          {secondaryHref && secondaryLabel ? (
            <ButtonLink
              href={secondaryHref}
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              {secondaryLabel}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </div>
  );
}
