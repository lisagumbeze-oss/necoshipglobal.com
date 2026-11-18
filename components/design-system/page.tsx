"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="max-w-3xl space-y-2">
        {breadcrumbs}
        <h1 className="ns-page-title">{title}</h1>
        {description ? <p className="ns-body">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({
  items,
  className
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("ns-meta", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden className="text-slate-300">/</span> : null}
              {item.href && !last ? (
                <Link href={item.href as never} className="text-brand-navy hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-brand-navy" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Tabs({
  items,
  value,
  onChange,
  className
}: {
  items: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Section tabs"
      className={cn("flex flex-wrap gap-1 border-b border-ns-border", className)}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            id={`tab-${item.id}`}
            className={cn(
              "focus-ring min-h-touch rounded-t-md px-3 py-2 text-sm font-semibold transition",
              selected
                ? "border-b-2 border-brand-yellow text-brand-navy"
                : "text-slate-500 hover:text-brand-navy"
            )}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            {typeof item.count === "number" ? (
              <span className="ml-2 rounded-badge bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function FilterBar({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-3 rounded-card border border-ns-border bg-white p-3 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
