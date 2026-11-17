import type { LucideIcon } from "lucide-react";
import {
  Plane,
  Ship,
  Truck,
  Package,
  Warehouse,
  ShieldCheck,
  Building2,
  Globe2
} from "lucide-react";

export type PublicService = {
  id: string;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  image: string;
};

/** Capability-focused services — no unverified volume or partnership claims. */
export const PUBLIC_SERVICES: PublicService[] = [
  {
    id: "air-freight",
    label: "Air Freight",
    short: "Time-sensitive international air moves",
    description:
      "International air freight for documents, parcels and commercial cargo, with milestone visibility from booking through delivery handoff.",
    icon: Plane,
    image: "/images/services/air-freight.svg"
  },
  {
    id: "ocean-freight",
    label: "Ocean Freight",
    short: "FCL and LCL ocean programmes",
    description:
      "Ocean freight for full-container and consolidated loads, coordinated from origin gateway to destination delivery where arranged.",
    icon: Ship,
    image: "/images/services/ocean-freight.svg"
  },
  {
    id: "road-transport",
    label: "Road Transportation",
    short: "Domestic and regional road haulage",
    description:
      "Road transportation for domestic and cross-border lanes, including linehaul and distribution handoffs where available.",
    icon: Truck,
    image: "/images/services/ground-shipping.svg"
  },
  {
    id: "last-mile",
    label: "Last-Mile Delivery",
    short: "Final delivery and proof of delivery",
    description:
      "Last-mile delivery coordination with status updates and proof-of-delivery capture when the lane supports it.",
    icon: Package,
    image: "/images/services/ground-shipping.svg"
  },
  {
    id: "freight-forwarding",
    label: "Freight Forwarding",
    short: "End-to-end forwarding coordination",
    description:
      "Freight forwarding that connects booking, documentation, carrier selection and delivery planning into one customer journey.",
    icon: Globe2,
    image: "/images/services/air-freight.svg"
  },
  {
    id: "warehousing",
    label: "Warehousing",
    short: "Storage and fulfilment handling",
    description:
      "Warehousing support for inbound receipt, storage and outbound preparation as part of a broader logistics programme.",
    icon: Warehouse,
    image: "/images/services/customs-brokerage.svg"
  },
  {
    id: "customs",
    label: "Customs Coordination",
    short: "Documentation and clearance support",
    description:
      "Customs coordination to help assemble commercial documents, classification inputs and clearance handoffs with licensed partners where required.",
    icon: ShieldCheck,
    image: "/images/services/customs-brokerage.svg"
  },
  {
    id: "corporate",
    label: "Corporate Logistics",
    short: "Negotiated programmes for businesses",
    description:
      "Corporate logistics programmes for recurring lanes, multi-site shipping and account-managed commercial contracts.",
    icon: Building2,
    image: "/images/services/ocean-freight.svg"
  }
];

export const WHY_CHOOSE_NECO = [
  {
    title: "Structured quotation process",
    text: "Collect origin, destination, method and cargo details so commercial teams can prepare a confirmed quotation."
  },
  {
    title: "Shipment visibility tools",
    text: "Track booked shipments with status, locations and event timelines when tracking data is available."
  },
  {
    title: "Multi-mode logistics coverage",
    text: "Air, ocean, road, warehousing and customs coordination under one customer-facing experience."
  },
  {
    title: "Corporate account pathways",
    text: "Dedicated contact for negotiated rates, recurring lanes and commercial contracts."
  }
] as const;

export const HOW_SHIPPING_WORKS = [
  {
    title: "Request a quotation",
    text: "Submit origin, destination, cargo and preferred shipping method through Get a Quote."
  },
  {
    title: "Confirm shipment",
    text: "Review the confirmed quotation with NECO and approve the booking details."
  },
  {
    title: "Arrange collection",
    text: "Schedule pickup or drop-off according to the agreed service plan."
  },
  {
    title: "Process and transport",
    text: "Documentation, handling and transport are coordinated for the selected mode."
  },
  {
    title: "Track shipment",
    text: "Follow progress with tracking status and timeline updates when events are recorded."
  },
  {
    title: "Complete delivery",
    text: "Delivery is completed with proof-of-delivery capture where the lane supports it."
  }
] as const;

export const SHIPPING_METHODS = [
  { value: "AIR", label: "Air Freight" },
  { value: "OCEAN", label: "Ocean Freight" },
  { value: "ROAD", label: "Road Transportation" },
  { value: "EXPRESS", label: "Express / Time-definite" },
  { value: "UNSURE", label: "Not sure — advise me" }
] as const;
