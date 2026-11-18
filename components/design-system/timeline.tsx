"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Badge } from "@/components/design-system/ui";
import type { StatusTone } from "@/lib/demo/shipment-status";

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  tone?: StatusTone;
  badge?: string;
};

export function Timeline({
  items,
  className,
  empty
}: {
  items: TimelineItem[];
  className?: string;
  empty?: ReactNode;
}) {
  if (!items.length) {
    return <div className={cn("ns-body", className)}>{empty ?? "No timeline events available."}</div>;
  }

  return (
    <ol className={cn("space-y-4", className)}>
      {items.map((item) => (
        <li key={item.id} className="relative border-l-2 border-brand-yellow/60 pl-4">
          <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-yellow" aria-hidden />
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-brand-navy">{item.title}</p>
            {item.badge ? <Badge tone={item.tone ?? "default"}>{item.badge}</Badge> : null}
          </div>
          {item.description ? <p className="ns-body mt-1">{item.description}</p> : null}
          {item.meta ? <p className="ns-meta mt-1">{item.meta}</p> : null}
        </li>
      ))}
    </ol>
  );
}
