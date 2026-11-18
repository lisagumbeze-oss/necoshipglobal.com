export const SHIPMENT_STATUSES = [
  "PENDING",
  "BOOKED",
  "COLLECTED",
  "PROCESSING",
  "IN_TRANSIT",
  "CUSTOMS_PROCESSING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "EXCEPTION",
  "RETURNED"
] as const;

export type ShipmentStatusCode = (typeof SHIPMENT_STATUSES)[number];

export type StatusTone = "default" | "success" | "warning" | "danger" | "info";

export type ShipmentStatusConfig = {
  code: ShipmentStatusCode;
  label: string;
  tone: StatusTone;
  description: string;
};

export const SHIPMENT_STATUS_CONFIG: Record<ShipmentStatusCode, ShipmentStatusConfig> = {
  PENDING: {
    code: "PENDING",
    label: "Pending",
    tone: "default",
    description: "Shipment request awaiting confirmation"
  },
  BOOKED: {
    code: "BOOKED",
    label: "Booked",
    tone: "info",
    description: "Booking confirmed; collection not yet started"
  },
  COLLECTED: {
    code: "COLLECTED",
    label: "Collected",
    tone: "info",
    description: "Package collected from origin"
  },
  PROCESSING: {
    code: "PROCESSING",
    label: "Processing",
    tone: "warning",
    description: "Package in hub or gateway processing"
  },
  IN_TRANSIT: {
    code: "IN_TRANSIT",
    label: "In Transit",
    tone: "info",
    description: "Shipment moving between locations"
  },
  CUSTOMS_PROCESSING: {
    code: "CUSTOMS_PROCESSING",
    label: "Customs Processing",
    tone: "warning",
    description: "Customs documentation or clearance in progress"
  },
  OUT_FOR_DELIVERY: {
    code: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    tone: "warning",
    description: "Final-mile delivery attempt underway"
  },
  DELIVERED: {
    code: "DELIVERED",
    label: "Delivered",
    tone: "success",
    description: "Shipment delivered to recipient"
  },
  EXCEPTION: {
    code: "EXCEPTION",
    label: "Exception",
    tone: "danger",
    description: "Delivery or transit exception requires attention"
  },
  RETURNED: {
    code: "RETURNED",
    label: "Returned",
    tone: "danger",
    description: "Shipment returned to sender"
  }
};

export function getShipmentStatus(code: string): ShipmentStatusConfig {
  const key = code.toUpperCase().replace(/\s+/g, "_") as ShipmentStatusCode;
  return (
    SHIPMENT_STATUS_CONFIG[key] ?? {
      code: "PENDING",
      label: code.replaceAll("_", " "),
      tone: "default",
      description: "Status"
    }
  );
}

export const STATUS_TONE_CLASS: Record<StatusTone, string> = {
  default: "bg-slate-100 text-slate-700",
  info: "bg-ns-infoSoft text-brand-info",
  success: "bg-ns-successSoft text-brand-success",
  warning: "bg-ns-warningSoft text-brand-warning",
  danger: "bg-ns-dangerSoft text-brand-danger"
};
