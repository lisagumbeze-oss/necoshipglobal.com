import type { ReactNode } from "react";
import { Card } from "@/components/design-system/ui";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-start gap-3 border-dashed">
      <div>
        <p className="font-semibold text-brand-navy">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      {action}
    </Card>
  );
}
