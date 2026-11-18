import type { StatusTone } from "@/lib/demo/shipment-status";
import { Badge } from "@/components/design-system/ui";
import { cn } from "@/lib/utils";

export function OpsStatusBadge({
  label,
  tone = "default",
  className
}: {
  label: string;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <Badge tone={tone} className={cn(className)}>
      {label}
    </Badge>
  );
}
