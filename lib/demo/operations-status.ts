import type { StatusTone } from "@/lib/demo/shipment-status";
import { SHIPMENT_STATUS_CONFIG, type ShipmentStatusCode } from "@/lib/demo/shipment-status";

/**
 * Centralized operational status configuration for Module 4.
 * Extends Module 2 shipment statuses without conflicting definitions.
 * Vehicle / driver / delivery / package statuses are separate domains.
 */

export type OpsShipmentPhase =
  | ShipmentStatusCode
  | "AWAITING_COLLECTION"
  | "AT_ORIGIN_FACILITY"
  | "READY_FOR_DISPATCH"
  | "AT_DESTINATION_FACILITY"
  | "DELAYED";

export const OPS_SHIPMENT_PHASE_CONFIG: Record<
  OpsShipmentPhase,
  { code: OpsShipmentPhase; label: string; tone: StatusTone; mapsTo?: ShipmentStatusCode }
> = {
  ...SHIPMENT_STATUS_CONFIG,
  AWAITING_COLLECTION: {
    code: "AWAITING_COLLECTION",
    label: "Awaiting collection",
    tone: "default",
    mapsTo: "BOOKED"
  },
  AT_ORIGIN_FACILITY: {
    code: "AT_ORIGIN_FACILITY",
    label: "At origin facility",
    tone: "info",
    mapsTo: "PROCESSING"
  },
  READY_FOR_DISPATCH: {
    code: "READY_FOR_DISPATCH",
    label: "Ready for dispatch",
    tone: "warning",
    mapsTo: "PROCESSING"
  },
  AT_DESTINATION_FACILITY: {
    code: "AT_DESTINATION_FACILITY",
    label: "At destination facility",
    tone: "info",
    mapsTo: "IN_TRANSIT"
  },
  DELAYED: {
    code: "DELAYED",
    label: "Delayed",
    tone: "danger",
    mapsTo: "EXCEPTION"
  }
};

export type VehicleStatus =
  | "AVAILABLE"
  | "ASSIGNED"
  | "ON_ROUTE"
  | "UNDER_MAINTENANCE"
  | "INSPECTION_REQUIRED"
  | "OUT_OF_SERVICE";

export const VEHICLE_STATUS_CONFIG: Record<VehicleStatus, { label: string; tone: StatusTone }> = {
  AVAILABLE: { label: "Available", tone: "success" },
  ASSIGNED: { label: "Assigned", tone: "info" },
  ON_ROUTE: { label: "On Route", tone: "warning" },
  UNDER_MAINTENANCE: { label: "Under Maintenance", tone: "warning" },
  INSPECTION_REQUIRED: { label: "Inspection Required", tone: "danger" },
  OUT_OF_SERVICE: { label: "Out of Service", tone: "danger" }
};

export type DriverAvailability = "AVAILABLE" | "ON_ASSIGNMENT" | "OFF_DUTY" | "ON_LEAVE";

export const DRIVER_AVAILABILITY_CONFIG: Record<DriverAvailability, { label: string; tone: StatusTone }> = {
  AVAILABLE: { label: "Available", tone: "success" },
  ON_ASSIGNMENT: { label: "On assignment", tone: "info" },
  OFF_DUTY: { label: "Off duty", tone: "default" },
  ON_LEAVE: { label: "On leave", tone: "warning" }
};

export type PackageCustodyStatus =
  | "EXPECTED"
  | "RECEIVED"
  | "PROCESSING"
  | "SORTED"
  | "STORED"
  | "READY_FOR_DISPATCH"
  | "LOADED"
  | "DEPARTED";

export const PACKAGE_CUSTODY_CONFIG: Record<PackageCustodyStatus, { label: string; tone: StatusTone }> = {
  EXPECTED: { label: "Expected", tone: "default" },
  RECEIVED: { label: "Received", tone: "info" },
  PROCESSING: { label: "Processing", tone: "warning" },
  SORTED: { label: "Sorted", tone: "info" },
  STORED: { label: "In storage", tone: "default" },
  READY_FOR_DISPATCH: { label: "Ready for dispatch", tone: "warning" },
  LOADED: { label: "Loaded", tone: "info" },
  DEPARTED: { label: "Departed", tone: "success" }
};

export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED_ATTEMPT"
  | "RESCHEDULED"
  | "EXCEPTION";

export const DELIVERY_STATUS_CONFIG: Record<DeliveryStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "Pending", tone: "default" },
  ASSIGNED: { label: "Assigned", tone: "info" },
  OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "warning" },
  DELIVERED: { label: "Delivered", tone: "success" },
  FAILED_ATTEMPT: { label: "Failed attempt", tone: "danger" },
  RESCHEDULED: { label: "Rescheduled", tone: "warning" },
  EXCEPTION: { label: "Exception", tone: "danger" }
};

export type ManifestStatus = "DRAFT" | "READY" | "DEPARTED" | "COMPLETED" | "CANCELLED";

export const MANIFEST_STATUS_CONFIG: Record<ManifestStatus, { label: string; tone: StatusTone }> = {
  DRAFT: { label: "Draft", tone: "default" },
  READY: { label: "Ready", tone: "info" },
  DEPARTED: { label: "Departed", tone: "warning" },
  COMPLETED: { label: "Completed", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "danger" }
};

export type ExceptionCategory =
  | "DELAYED_SHIPMENT"
  | "DAMAGED_PACKAGE"
  | "MISSING_PACKAGE"
  | "FAILED_DELIVERY"
  | "VEHICLE_BREAKDOWN"
  | "ROUTE_DISRUPTION"
  | "WAREHOUSE_DISCREPANCY"
  | "CUSTOMS_DELAY"
  | "DOCUMENTATION_ISSUE"
  | "OTHER";

export type ExceptionCaseStatus =
  | "OPEN"
  | "UNDER_INVESTIGATION"
  | "AWAITING_INFORMATION"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export const EXCEPTION_STATUS_CONFIG: Record<ExceptionCaseStatus, { label: string; tone: StatusTone }> = {
  OPEN: { label: "Open", tone: "danger" },
  UNDER_INVESTIGATION: { label: "Under Investigation", tone: "warning" },
  AWAITING_INFORMATION: { label: "Awaiting Information", tone: "warning" },
  ESCALATED: { label: "Escalated", tone: "danger" },
  RESOLVED: { label: "Resolved", tone: "success" },
  CLOSED: { label: "Closed", tone: "default" }
};

/** Operational event categories for custody timeline UI (not live events). */
export const OPS_EVENT_CATEGORIES = [
  "Shipment Created",
  "Collection Assigned",
  "Collected",
  "Arrived at Warehouse",
  "Received",
  "Processing",
  "Sorted",
  "Stored",
  "Ready for Dispatch",
  "Loaded",
  "Departed",
  "In Transit",
  "Arrived at Destination Facility",
  "Customs Processing",
  "Customs Released",
  "Out for Delivery",
  "Delivery Attempted",
  "Delivered",
  "Returned",
  "Exception Recorded"
] as const;

export type OpsEventCategory = (typeof OPS_EVENT_CATEGORIES)[number];

/**
 * UI role labels for operations (least-privilege navigation design).
 * Maps conceptually to Prisma UserRole where possible; enforcement is backend-only.
 */
export const OPS_UI_ROLES = [
  { id: "SUPER_ADMIN", label: "Super Administrator", prismaHint: "ADMIN" },
  { id: "OPS_MANAGER", label: "Operations Manager", prismaHint: "OPS_MANAGER" },
  { id: "WAREHOUSE_MANAGER", label: "Warehouse Manager", prismaHint: "OPS_MANAGER / StaffProfile" },
  { id: "WAREHOUSE_STAFF", label: "Warehouse Staff", prismaHint: "StaffProfile" },
  { id: "DISPATCHER", label: "Dispatcher", prismaHint: "OPS_MANAGER / StaffProfile" },
  { id: "DELIVERY_AGENT", label: "Delivery Agent", prismaHint: "DRIVER + DriverProfile" },
  { id: "FLEET_MANAGER", label: "Fleet Manager", prismaHint: "OPS_MANAGER (vehicle entity not in schema yet)" },
  { id: "SUPPORT_AGENT", label: "Customer Support Agent", prismaHint: "SUPPORT_AGENT" }
] as const;
