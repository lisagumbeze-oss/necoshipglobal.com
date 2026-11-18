import type {
  DeliveryStatus,
  DriverAvailability,
  ExceptionCaseStatus,
  ExceptionCategory,
  ManifestStatus,
  OpsEventCategory,
  OpsShipmentPhase,
  PackageCustodyStatus,
  VehicleStatus
} from "@/lib/demo/operations-status";

export const OPS_DEMO_NOTICE =
  "Demonstration data — sample logistics operations records for UI development only. Not live NECO fleet, warehouse, dispatch or delivery activity.";

/**
 * Vehicle records are UI demonstration fixtures only.
 * Prisma has DriverProfile / Warehouse* / Shipment / Package but no Vehicle model yet.
 * A future schema addition would be required before persisting fleet assets.
 */
export type DemoVehicleCategory =
  | "Motorcycle"
  | "Delivery van"
  | "Light commercial vehicle"
  | "Medium-duty truck"
  | "Heavy-duty truck"
  | "Other";

export type DemoVehicle = {
  id: string;
  reference: string;
  registration: string;
  category: DemoVehicleCategory;
  make: string;
  model: string;
  year: number;
  capacityLabel: string;
  assignedDriverId: string | null;
  status: VehicleStatus;
  currentAssignment: string | null;
  maintenanceStatus: string;
  ownership: string;
  nextInspection: string;
};

export type DemoDriver = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  licenceCategory: string;
  licenceExpiry: string;
  assignedVehicleId: string | null;
  availability: DriverAvailability;
  region: string;
  /** Aligns with DriverProfile.status conceptual field */
  profileStatus: string;
};

export type DemoOpsShipment = {
  id: string;
  trackingNumber: string;
  reference: string;
  phase: OpsShipmentPhase;
  origin: string;
  destination: string;
  warehouseCode: string | null;
  packageCount: number;
  method: string;
  updatedAt: string;
};

export type DemoWarehouse = {
  id: string;
  code: string;
  name: string;
  address: string;
  manager: string;
  inboundCount: number;
  outboundCount: number;
  awaitingProcessing: number;
  inStorage: number;
  awaitingDispatch: number;
};

export type DemoWarehouseBin = {
  id: string;
  warehouseCode: string;
  zone: string;
  aisle: string;
  shelf: string;
  binCode: string;
  capacityLabel: string;
  occupiedLabel: string;
};

export type DemoParcelCustody = {
  id: string;
  trackingNumber: string;
  packageId: string;
  warehouseCode: string;
  custody: PackageCustodyStatus;
  binCode: string | null;
  condition: string;
  notes: string;
};

export type DemoWarehouseMovement = {
  id: string;
  trackingNumber: string;
  warehouseCode: string;
  fromLocation: string;
  toLocation: string;
  at: string;
  operator: string;
  reason: string;
};

export type DemoScanPreview = {
  trackingNumber: string;
  packageId: string;
  scanType: string;
  warehouseCode: string;
  location: string;
  operator: string;
  resultNote: string;
};

export type DemoAssignment = {
  id: string;
  driverId: string;
  vehicleId: string;
  departureAt: string;
  origin: string;
  destination: string;
  routeLabel: string;
  shipmentIds: string[];
  status: "PLANNED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CONFLICT";
  conflictNote?: string;
};

export type DemoManifest = {
  id: string;
  reference: string;
  driverId: string;
  vehicleId: string;
  shipmentRefs: string[];
  packageCount: number;
  departureLocation: string;
  destination: string;
  plannedDeparture: string;
  status: ManifestStatus;
};

export type DemoRoutePlan = {
  id: string;
  label: string;
  origin: string;
  destination: string;
  stops: string[];
  vehicleId: string | null;
  driverId: string | null;
  shipmentRefs: string[];
  kind: "PLANNED" | "CONFIRMED";
  /** Explicitly not live GPS */
  mapNote: string;
};

export type DemoDelivery = {
  id: string;
  reference: string;
  trackingNumber: string;
  recipientLabel: string;
  address: string;
  driverId: string | null;
  vehicleId: string | null;
  scheduledDate: string;
  status: DeliveryStatus;
  instructions: string;
};

export type DemoDeliveryAttempt = {
  id: string;
  deliveryId: string;
  at: string;
  driverName: string;
  outcome: string;
  reason: string | null;
  followUp: string | null;
};

export type DemoPodPreview = {
  deliveryId: string;
  trackingNumber: string;
  available: boolean;
  timestamp: string | null;
  recipientConfirmation: string | null;
  signatureNote: string;
  photoNote: string;
  driverName: string | null;
  locationNote: string;
};

export type DemoOpsEvent = {
  id: string;
  trackingNumber: string;
  packageId: string | null;
  category: OpsEventCategory;
  at: string;
  location: string;
  source: string;
  user: string;
  notes: string;
};

export type DemoExceptionCase = {
  id: string;
  reference: string;
  trackingNumber: string;
  packageId: string | null;
  category: ExceptionCategory;
  priority: "Low" | "Medium" | "High" | "Critical";
  reportedAt: string;
  department: string;
  status: ExceptionCaseStatus;
  assignedStaff: string;
  summary: string;
  resolution: string | null;
};

export type DemoMaintenanceRecord = {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  nextDue: string;
  notes: string;
  status: string;
};

export const demoVehicles: DemoVehicle[] = [
  {
    id: "veh1",
    reference: "FLT-DEMO-01",
    registration: "AB12 CDE",
    category: "Delivery van",
    make: "Ford",
    model: "Transit",
    year: 2022,
    capacityLabel: "1,200 kg (demo)",
    assignedDriverId: "drv1",
    status: "ON_ROUTE",
    currentAssignment: "ASN-DEMO-01",
    maintenanceStatus: "Service current (demo)",
    ownership: "NECO operated (demonstration)",
    nextInspection: "2026-12-15"
  },
  {
    id: "veh2",
    reference: "FLT-DEMO-02",
    registration: "FG34 HIJ",
    category: "Light commercial vehicle",
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2021,
    capacityLabel: "1,800 kg (demo)",
    assignedDriverId: "drv2",
    status: "ASSIGNED",
    currentAssignment: "ASN-DEMO-02",
    maintenanceStatus: "Service current (demo)",
    ownership: "NECO operated (demonstration)",
    nextInspection: "2027-01-10"
  },
  {
    id: "veh3",
    reference: "FLT-DEMO-03",
    registration: "KL56 MNO",
    category: "Medium-duty truck",
    make: "Iveco",
    model: "Eurocargo",
    year: 2020,
    capacityLabel: "7,500 kg (demo)",
    assignedDriverId: null,
    status: "AVAILABLE",
    currentAssignment: null,
    maintenanceStatus: "Service current (demo)",
    ownership: "NECO operated (demonstration)",
    nextInspection: "2026-11-30"
  },
  {
    id: "veh4",
    reference: "FLT-DEMO-04",
    registration: "PQ78 RST",
    category: "Motorcycle",
    make: "Honda",
    model: "CB500X",
    year: 2023,
    capacityLabel: "Courier panniers (demo)",
    assignedDriverId: null,
    status: "UNDER_MAINTENANCE",
    currentAssignment: null,
    maintenanceStatus: "Brake service in progress (demo)",
    ownership: "NECO operated (demonstration)",
    nextInspection: "2026-11-20"
  },
  {
    id: "veh5",
    reference: "FLT-DEMO-05",
    registration: "UV90 WXY",
    category: "Heavy-duty truck",
    make: "Volvo",
    model: "FH",
    year: 2019,
    capacityLabel: "24,000 kg (demo)",
    assignedDriverId: null,
    status: "INSPECTION_REQUIRED",
    currentAssignment: null,
    maintenanceStatus: "Annual inspection due (demo)",
    ownership: "NECO operated (demonstration)",
    nextInspection: "2026-11-18"
  }
];

export const demoDrivers: DemoDriver[] = [
  {
    id: "drv1",
    reference: "DRV-DEMO-01",
    name: "Samira Okonkwo",
    email: "samira.demo@necoship.example",
    phone: "+44 7700 900101",
    licenceCategory: "C1",
    licenceExpiry: "2028-04-12",
    assignedVehicleId: "veh1",
    availability: "ON_ASSIGNMENT",
    region: "London / South East",
    profileStatus: "ON_DUTY"
  },
  {
    id: "drv2",
    reference: "DRV-DEMO-02",
    name: "James Whitfield",
    email: "james.demo@necoship.example",
    phone: "+44 7700 900102",
    licenceCategory: "C",
    licenceExpiry: "2027-09-01",
    assignedVehicleId: "veh2",
    availability: "ON_ASSIGNMENT",
    region: "Midlands",
    profileStatus: "ON_DUTY"
  },
  {
    id: "drv3",
    reference: "DRV-DEMO-03",
    name: "Elena Rossi",
    email: "elena.demo@necoship.example",
    phone: "+44 7700 900103",
    licenceCategory: "B",
    licenceExpiry: "2029-01-20",
    assignedVehicleId: null,
    availability: "AVAILABLE",
    region: "North West",
    profileStatus: "AVAILABLE"
  },
  {
    id: "drv4",
    reference: "DRV-DEMO-04",
    name: "Omar Hassan",
    email: "omar.demo@necoship.example",
    phone: "+44 7700 900104",
    licenceCategory: "A",
    licenceExpiry: "2026-12-01",
    assignedVehicleId: null,
    availability: "OFF_DUTY",
    region: "London",
    profileStatus: "OFF_DUTY"
  }
];

export const demoOpsShipments: DemoOpsShipment[] = [
  {
    id: "osh1",
    trackingNumber: "NS-OPS-900101",
    reference: "OPS-REF-101",
    phase: "AWAITING_COLLECTION",
    origin: "London, GB",
    destination: "Manchester, GB",
    warehouseCode: null,
    packageCount: 2,
    method: "Road",
    updatedAt: "2026-11-17T08:00:00Z"
  },
  {
    id: "osh2",
    trackingNumber: "NS-OPS-900102",
    reference: "OPS-REF-102",
    phase: "COLLECTED",
    origin: "Birmingham, GB",
    destination: "Leeds, GB",
    warehouseCode: "WH-LON-01",
    packageCount: 1,
    method: "Road",
    updatedAt: "2026-11-17T09:15:00Z"
  },
  {
    id: "osh3",
    trackingNumber: "NS-OPS-900103",
    reference: "OPS-REF-103",
    phase: "AT_ORIGIN_FACILITY",
    origin: "London, GB",
    destination: "Rotterdam, NL",
    warehouseCode: "WH-LON-01",
    packageCount: 4,
    method: "Road + partner ocean",
    updatedAt: "2026-11-17T10:00:00Z"
  },
  {
    id: "osh4",
    trackingNumber: "NS-OPS-900104",
    reference: "OPS-REF-104",
    phase: "PROCESSING",
    origin: "Manchester, GB",
    destination: "Dublin, IE",
    warehouseCode: "WH-MAN-01",
    packageCount: 3,
    method: "Air (partner)",
    updatedAt: "2026-11-17T10:30:00Z"
  },
  {
    id: "osh5",
    trackingNumber: "NS-OPS-900105",
    reference: "OPS-REF-105",
    phase: "READY_FOR_DISPATCH",
    origin: "London, GB",
    destination: "Paris, FR",
    warehouseCode: "WH-LON-01",
    packageCount: 2,
    method: "Road",
    updatedAt: "2026-11-17T11:00:00Z"
  },
  {
    id: "osh6",
    trackingNumber: "NS-OPS-900106",
    reference: "OPS-REF-106",
    phase: "IN_TRANSIT",
    origin: "Felixstowe, GB",
    destination: "Hamburg, DE",
    warehouseCode: null,
    packageCount: 6,
    method: "Ocean (partner)",
    updatedAt: "2026-11-16T18:00:00Z"
  },
  {
    id: "osh7",
    trackingNumber: "NS-OPS-900107",
    reference: "OPS-REF-107",
    phase: "AT_DESTINATION_FACILITY",
    origin: "London, GB",
    destination: "Brussels, BE",
    warehouseCode: "WH-BRU-01",
    packageCount: 1,
    method: "Road",
    updatedAt: "2026-11-17T07:40:00Z"
  },
  {
    id: "osh8",
    trackingNumber: "NS-OPS-900108",
    reference: "OPS-REF-108",
    phase: "OUT_FOR_DELIVERY",
    origin: "London, GB",
    destination: "Croydon, GB",
    warehouseCode: "WH-LON-01",
    packageCount: 1,
    method: "Last-mile",
    updatedAt: "2026-11-17T12:00:00Z"
  },
  {
    id: "osh9",
    trackingNumber: "NS-OPS-900109",
    reference: "OPS-REF-109",
    phase: "DELIVERED",
    origin: "Leeds, GB",
    destination: "York, GB",
    warehouseCode: null,
    packageCount: 1,
    method: "Last-mile",
    updatedAt: "2026-11-16T16:20:00Z"
  },
  {
    id: "osh10",
    trackingNumber: "NS-OPS-900110",
    reference: "OPS-REF-110",
    phase: "DELAYED",
    origin: "Southampton, GB",
    destination: "Valencia, ES",
    warehouseCode: "WH-SOU-01",
    packageCount: 2,
    method: "Ocean (partner)",
    updatedAt: "2026-11-17T06:00:00Z"
  },
  {
    id: "osh11",
    trackingNumber: "NS-OPS-900111",
    reference: "OPS-REF-111",
    phase: "EXCEPTION",
    origin: "London, GB",
    destination: "Edinburgh, GB",
    warehouseCode: "WH-LON-01",
    packageCount: 1,
    method: "Road",
    updatedAt: "2026-11-17T11:45:00Z"
  }
];

export const demoWarehouses: DemoWarehouse[] = [
  {
    id: "wh1",
    code: "WH-LON-01",
    name: "London Gateway Hub (demo)",
    address: "1 Demonstration Way, Tilbury, Essex",
    manager: "Nadia Brooks",
    inboundCount: 14,
    outboundCount: 9,
    awaitingProcessing: 6,
    inStorage: 42,
    awaitingDispatch: 8
  },
  {
    id: "wh2",
    code: "WH-MAN-01",
    name: "Manchester Sort Centre (demo)",
    address: "Unit 4 Demo Park, Manchester",
    manager: "Chris Patel",
    inboundCount: 7,
    outboundCount: 5,
    awaitingProcessing: 3,
    inStorage: 21,
    awaitingDispatch: 4
  },
  {
    id: "wh3",
    code: "WH-BRU-01",
    name: "Brussels Destination Facility (demo)",
    address: "Demo Logistics Park, Brussels",
    manager: "Partner facility contact (demo)",
    inboundCount: 4,
    outboundCount: 2,
    awaitingProcessing: 1,
    inStorage: 8,
    awaitingDispatch: 2
  }
];

export const demoWarehouseBins: DemoWarehouseBin[] = [
  {
    id: "bin1",
    warehouseCode: "WH-LON-01",
    zone: "Inbound",
    aisle: "A1",
    shelf: "S2",
    binCode: "A1-S2-B04",
    capacityLabel: "40 parcels (demo)",
    occupiedLabel: "28 parcels (demo)"
  },
  {
    id: "bin2",
    warehouseCode: "WH-LON-01",
    zone: "Outbound EU",
    aisle: "C3",
    shelf: "S1",
    binCode: "C3-S1-B12",
    capacityLabel: "60 parcels (demo)",
    occupiedLabel: "15 parcels (demo)"
  },
  {
    id: "bin3",
    warehouseCode: "WH-MAN-01",
    zone: "Air export",
    aisle: "B2",
    shelf: "S3",
    binCode: "B2-S3-B01",
    capacityLabel: "30 parcels (demo)",
    occupiedLabel: "11 parcels (demo)"
  }
];

export const demoParcelCustody: DemoParcelCustody[] = [
  {
    id: "pc1",
    trackingNumber: "NS-OPS-900103",
    packageId: "PKG-103-A",
    warehouseCode: "WH-LON-01",
    custody: "RECEIVED",
    binCode: "A1-S2-B04",
    condition: "Intact (demo check)",
    notes: "Awaiting sort to EU outbound"
  },
  {
    id: "pc2",
    trackingNumber: "NS-OPS-900104",
    packageId: "PKG-104-A",
    warehouseCode: "WH-MAN-01",
    custody: "PROCESSING",
    binCode: "B2-S3-B01",
    condition: "Intact (demo check)",
    notes: "Air partner documentation check"
  },
  {
    id: "pc3",
    trackingNumber: "NS-OPS-900105",
    packageId: "PKG-105-A",
    warehouseCode: "WH-LON-01",
    custody: "READY_FOR_DISPATCH",
    binCode: "C3-S1-B12",
    condition: "Intact (demo check)",
    notes: "Allocated to MNF-DEMO-01"
  },
  {
    id: "pc4",
    trackingNumber: "NS-OPS-900107",
    packageId: "PKG-107-A",
    warehouseCode: "WH-BRU-01",
    custody: "STORED",
    binCode: null,
    condition: "Intact (demo check)",
    notes: "Awaiting last-mile assignment"
  }
];

export const demoWarehouseMovements: DemoWarehouseMovement[] = [
  {
    id: "wm1",
    trackingNumber: "NS-OPS-900103",
    warehouseCode: "WH-LON-01",
    fromLocation: "Receiving dock",
    toLocation: "A1-S2-B04",
    at: "2026-11-17T10:05:00Z",
    operator: "Warehouse Staff (demo)",
    reason: "Put-away after receiving"
  },
  {
    id: "wm2",
    trackingNumber: "NS-OPS-900105",
    warehouseCode: "WH-LON-01",
    fromLocation: "Sort lane 2",
    toLocation: "C3-S1-B12",
    at: "2026-11-17T10:50:00Z",
    operator: "Warehouse Staff (demo)",
    reason: "Outbound staging"
  }
];

export const demoScanPreview: DemoScanPreview = {
  trackingNumber: "",
  packageId: "",
  scanType: "RECEIVING",
  warehouseCode: "WH-LON-01",
  location: "Receiving dock",
  operator: "Current operator (demo)",
  resultNote: "Scanner hardware not connected. Enter a tracking number to preview UI feedback only."
};

export const demoAssignments: DemoAssignment[] = [
  {
    id: "asn1",
    driverId: "drv1",
    vehicleId: "veh1",
    departureAt: "2026-11-17T13:00:00Z",
    origin: "WH-LON-01",
    destination: "Croydon last-mile cluster",
    routeLabel: "Route LSE-12 (demo planned)",
    shipmentIds: ["osh8"],
    status: "IN_PROGRESS"
  },
  {
    id: "asn2",
    driverId: "drv2",
    vehicleId: "veh2",
    departureAt: "2026-11-17T15:00:00Z",
    origin: "WH-LON-01",
    destination: "Dover gateway",
    routeLabel: "Route SE-04 (demo planned)",
    shipmentIds: ["osh5"],
    status: "CONFIRMED"
  },
  {
    id: "asn3",
    driverId: "drv1",
    vehicleId: "veh3",
    departureAt: "2026-11-17T16:00:00Z",
    origin: "WH-LON-01",
    destination: "Midlands",
    routeLabel: "Conflict sample route",
    shipmentIds: ["osh2"],
    status: "CONFLICT",
    conflictNote: "Driver drv1 already assigned to veh1 / ASN-DEMO-01 in the same window (demonstration conflict)."
  }
];

export const demoManifests: DemoManifest[] = [
  {
    id: "mnf1",
    reference: "MNF-DEMO-01",
    driverId: "drv2",
    vehicleId: "veh2",
    shipmentRefs: ["NS-OPS-900105"],
    packageCount: 2,
    departureLocation: "WH-LON-01",
    destination: "Dover / partner handoff",
    plannedDeparture: "2026-11-17T15:00:00Z",
    status: "READY"
  },
  {
    id: "mnf2",
    reference: "MNF-DEMO-02",
    driverId: "drv1",
    vehicleId: "veh1",
    shipmentRefs: ["NS-OPS-900108"],
    packageCount: 1,
    departureLocation: "WH-LON-01",
    destination: "Croydon",
    plannedDeparture: "2026-11-17T12:00:00Z",
    status: "DEPARTED"
  },
  {
    id: "mnf3",
    reference: "MNF-DEMO-03",
    driverId: "drv3",
    vehicleId: "veh3",
    shipmentRefs: ["NS-OPS-900109"],
    packageCount: 1,
    departureLocation: "WH-MAN-01",
    destination: "York",
    plannedDeparture: "2026-11-16T09:00:00Z",
    status: "COMPLETED"
  }
];

export const demoRoutes: DemoRoutePlan[] = [
  {
    id: "rt1",
    label: "LSE-12 last-mile (demo)",
    origin: "WH-LON-01",
    destination: "Croydon",
    stops: ["Lewisham", "Bromley", "Croydon"],
    vehicleId: "veh1",
    driverId: "drv1",
    shipmentRefs: ["NS-OPS-900108"],
    kind: "CONFIRMED",
    mapNote: "Map-ready layout. No live GPS positions. Stops are illustrative demonstration data."
  },
  {
    id: "rt2",
    label: "SE-04 gateway (demo)",
    origin: "WH-LON-01",
    destination: "Dover",
    stops: ["Dartford", "Maidstone", "Dover"],
    vehicleId: "veh2",
    driverId: "drv2",
    shipmentRefs: ["NS-OPS-900105"],
    kind: "PLANNED",
    mapNote: "Planned route only. Connect Mapbox later. Do not treat as live vehicle telemetry."
  }
];

export const demoDeliveries: DemoDelivery[] = [
  {
    id: "del1",
    reference: "DEL-DEMO-01",
    trackingNumber: "NS-OPS-900108",
    recipientLabel: "Recipient on file (restricted preview)",
    address: "12 Demo Street, Croydon CR0 1AB",
    driverId: "drv1",
    vehicleId: "veh1",
    scheduledDate: "2026-11-17",
    status: "OUT_FOR_DELIVERY",
    instructions: "Leave with reception if available (demo instruction)"
  },
  {
    id: "del2",
    reference: "DEL-DEMO-02",
    trackingNumber: "NS-OPS-900109",
    recipientLabel: "Recipient on file (restricted preview)",
    address: "5 Sample Close, York YO1 7HH",
    driverId: "drv3",
    vehicleId: "veh3",
    scheduledDate: "2026-11-16",
    status: "DELIVERED",
    instructions: "Signature required (demo)"
  },
  {
    id: "del3",
    reference: "DEL-DEMO-03",
    trackingNumber: "NS-OPS-900111",
    recipientLabel: "Recipient on file (restricted preview)",
    address: "88 Demonstration Road, Edinburgh EH1 1AA",
    driverId: "drv2",
    vehicleId: "veh2",
    scheduledDate: "2026-11-17",
    status: "FAILED_ATTEMPT",
    instructions: "Call before arrival (demo)"
  },
  {
    id: "del4",
    reference: "DEL-DEMO-04",
    trackingNumber: "NS-OPS-900107",
    recipientLabel: "Recipient on file (restricted preview)",
    address: "Demo Avenue 3, Brussels",
    driverId: null,
    vehicleId: null,
    scheduledDate: "2026-11-18",
    status: "PENDING",
    instructions: "Business hours delivery (demo)"
  }
];

export const demoDeliveryAttempts: DemoDeliveryAttempt[] = [
  {
    id: "att1",
    deliveryId: "del3",
    at: "2026-11-17T11:20:00Z",
    driverName: "James Whitfield",
    outcome: "Failed",
    reason: "No secure access / recipient unavailable (demo)",
    followUp: "Reschedule suggested (demo)"
  },
  {
    id: "att2",
    deliveryId: "del2",
    at: "2026-11-16T15:55:00Z",
    driverName: "Elena Rossi",
    outcome: "Delivered",
    reason: null,
    followUp: null
  }
];

export const demoPodPreviews: DemoPodPreview[] = [
  {
    deliveryId: "del2",
    trackingNumber: "NS-OPS-900109",
    available: true,
    timestamp: "2026-11-16T15:55:00Z",
    recipientConfirmation: "Name on file (demo)",
    signatureNote: "Signature image not attached in this demonstration module.",
    photoNote: "Photograph preview unavailable — no fabricated POD media.",
    driverName: "Elena Rossi",
    locationNote: "Delivery address recorded (demo). Not live GPS."
  },
  {
    deliveryId: "del1",
    trackingNumber: "NS-OPS-900108",
    available: false,
    timestamp: null,
    recipientConfirmation: null,
    signatureNote: "No proof of delivery yet — shipment still out for delivery.",
    photoNote: "No photograph available.",
    driverName: "Samira Okonkwo",
    locationNote: "Live location unavailable."
  }
];

export const demoOpsEvents: DemoOpsEvent[] = [
  {
    id: "ev1",
    trackingNumber: "NS-OPS-900105",
    packageId: "PKG-105-A",
    category: "Ready for Dispatch",
    at: "2026-11-17T11:00:00Z",
    location: "WH-LON-01",
    source: "Warehouse UI (demo)",
    user: "Nadia Brooks",
    notes: "Staged on outbound lane"
  },
  {
    id: "ev2",
    trackingNumber: "NS-OPS-900108",
    packageId: "PKG-108-A",
    category: "Out for Delivery",
    at: "2026-11-17T12:05:00Z",
    location: "Croydon route",
    source: "Dispatch UI (demo)",
    user: "Dispatcher (demo)",
    notes: "Manifest MNF-DEMO-02"
  },
  {
    id: "ev3",
    trackingNumber: "NS-OPS-900111",
    packageId: "PKG-111-A",
    category: "Exception Recorded",
    at: "2026-11-17T11:45:00Z",
    location: "Edinburgh",
    source: "Delivery UI (demo)",
    user: "James Whitfield",
    notes: "Failed attempt — access issue"
  }
];

export const demoExceptions: DemoExceptionCase[] = [
  {
    id: "exc1",
    reference: "EXC-DEMO-01",
    trackingNumber: "NS-OPS-900111",
    packageId: "PKG-111-A",
    category: "FAILED_DELIVERY",
    priority: "High",
    reportedAt: "2026-11-17T11:45:00Z",
    department: "Last-mile",
    status: "UNDER_INVESTIGATION",
    assignedStaff: "Support Agent (demo)",
    summary: "Demonstration failed delivery — recipient access unavailable.",
    resolution: null
  },
  {
    id: "exc2",
    reference: "EXC-DEMO-02",
    trackingNumber: "NS-OPS-900110",
    packageId: null,
    category: "DELAYED_SHIPMENT",
    priority: "Medium",
    reportedAt: "2026-11-17T06:00:00Z",
    department: "Linehaul coordination",
    status: "AWAITING_INFORMATION",
    assignedStaff: "Operations Manager (demo)",
    summary: "Demonstration delay on partner ocean leg — not a live incident.",
    resolution: null
  },
  {
    id: "exc3",
    reference: "EXC-DEMO-03",
    trackingNumber: "NS-OPS-900103",
    packageId: "PKG-103-B",
    category: "WAREHOUSE_DISCREPANCY",
    priority: "Low",
    reportedAt: "2026-11-16T14:00:00Z",
    department: "Warehouse",
    status: "RESOLVED",
    assignedStaff: "Warehouse Manager (demo)",
    summary: "Demonstration bin count mismatch corrected in UI sample.",
    resolution: "Counts reconciled in demonstration notes."
  }
];

export const demoMaintenance: DemoMaintenanceRecord[] = [
  {
    id: "mnt1",
    vehicleId: "veh4",
    type: "Brake service",
    date: "2026-11-17",
    nextDue: "2027-05-17",
    notes: "In progress (demo)",
    status: "In progress"
  },
  {
    id: "mnt2",
    vehicleId: "veh5",
    type: "Annual inspection",
    date: "2025-11-18",
    nextDue: "2026-11-18",
    notes: "Inspection required (demo)",
    status: "Due"
  },
  {
    id: "mnt3",
    vehicleId: "veh1",
    type: "Routine service",
    date: "2026-09-01",
    nextDue: "2027-03-01",
    notes: "Completed (demo)",
    status: "Completed"
  }
];

export function getOpsOverviewStats() {
  const count = (phase: OpsShipmentPhase | OpsShipmentPhase[]) => {
    const set = Array.isArray(phase) ? phase : [phase];
    return demoOpsShipments.filter((s) => set.includes(s.phase)).length;
  };
  const openExceptions = demoExceptions.filter((e) => !["RESOLVED", "CLOSED"].includes(e.status)).length;
  const vehiclesAvailable = demoVehicles.filter((v) => v.status === "AVAILABLE").length;
  const vehiclesAssigned = demoVehicles.filter((v) => v.status === "ASSIGNED" || v.status === "ON_ROUTE").length;
  const manifestsReady = demoManifests.filter((m) => m.status === "READY").length;
  const manifestsDeparted = demoManifests.filter((m) => m.status === "DEPARTED").length;
  const warehouseAwaiting = demoWarehouses.reduce((n, w) => n + w.awaitingProcessing + w.awaitingDispatch, 0);
  const loadedPackages = demoParcelCustody.filter((p) => p.custody === "LOADED").length;
  const stagingPackages = demoParcelCustody.filter((p) =>
    ["READY_FOR_DISPATCH", "SORTED", "STORED", "PROCESSING"].includes(p.custody)
  ).length;
  const maintenanceDue = demoMaintenance.filter((m) => m.status !== "Completed").length;
  return {
    total: demoOpsShipments.length,
    awaitingCollection: count("AWAITING_COLLECTION"),
    collected: count("COLLECTED"),
    atOrigin: count("AT_ORIGIN_FACILITY"),
    processing: count("PROCESSING"),
    readyDispatch: count("READY_FOR_DISPATCH"),
    inTransit: count("IN_TRANSIT"),
    atDestination: count("AT_DESTINATION_FACILITY"),
    outForDelivery: count("OUT_FOR_DELIVERY"),
    delivered: count("DELIVERED"),
    delayed: count("DELAYED"),
    exceptions: count("EXCEPTION"),
    openExceptionCases: openExceptions,
    vehiclesAvailable,
    vehiclesAssigned,
    vehiclesTotal: demoVehicles.length,
    manifestsReady,
    manifestsDeparted,
    warehouseAwaiting,
    loadedPackages,
    stagingPackages,
    maintenanceDue,
    driversOnDuty: demoDrivers.filter((d) => d.availability === "AVAILABLE" || d.availability === "ON_ASSIGNMENT")
      .length
  };
}

export function getVehicle(id: string) {
  return demoVehicles.find((v) => v.id === id || v.reference === id) ?? null;
}

export function getDriver(id: string) {
  return demoDrivers.find((d) => d.id === id || d.reference === id) ?? null;
}

export function getOpsShipment(idOrTracking: string) {
  const key = idOrTracking.toUpperCase();
  return (
    demoOpsShipments.find(
      (s) => s.id.toUpperCase() === key || s.trackingNumber.toUpperCase() === key || s.reference.toUpperCase() === key
    ) ?? null
  );
}

export function getException(id: string) {
  return demoExceptions.find((e) => e.id === id || e.reference === id) ?? null;
}

export function getDelivery(id: string) {
  return demoDeliveries.find((d) => d.id === id || d.reference === id) ?? null;
}
