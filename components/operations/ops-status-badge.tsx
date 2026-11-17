import { STATUS_TONE_CLASS, type StatusTone } from "@/lib/demo/shipment-status";
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
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_TONE_CLASS[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
