import { getShipmentStatus, type StatusTone } from "@/lib/demo/shipment-status";
import { Badge } from "@/components/design-system/ui";

export function ShipmentStatusBadge({ status }: { status: string }) {
  const cfg = getShipmentStatus(status);
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

export function ToneBadge({
  label,
  tone = "default"
}: {
  label: string;
  tone?: StatusTone;
}) {
  return <Badge tone={tone}>{label}</Badge>;
}
