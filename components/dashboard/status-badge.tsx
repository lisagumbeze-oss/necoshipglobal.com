import { getShipmentStatus, STATUS_TONE_CLASS, type StatusTone } from "@/lib/demo/shipment-status";
import { cn } from "@/lib/utils";

export function ShipmentStatusBadge({ status }: { status: string }) {
  const cfg = getShipmentStatus(status);
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", STATUS_TONE_CLASS[cfg.tone])}>
      {cfg.label}
    </span>
  );
}

export function ToneBadge({
  label,
  tone = "default"
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", STATUS_TONE_CLASS[tone])}>
      {label}
    </span>
  );
}
