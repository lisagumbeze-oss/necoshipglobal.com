export type LocationPin = {
  id: string;
  city: string;
  country: string;
  address: string;
  hours: string;
  services: string[];
  serviceTypes: ("Air" | "Ocean" | "Ground" | "Customs" | "Warehouse")[];
};

export const locationPins: LocationPin[] = [
  {
    id: "lax",
    city: "Los Angeles",
    country: "USA",
    address: "1 World Way, Los Angeles, CA",
    hours: "Mon–Sun 06:00–22:00",
    services: ["Express air", "Customs", "Last-mile"],
    serviceTypes: ["Air", "Ground", "Customs"]
  },
  {
    id: "fra",
    city: "Frankfurt",
    country: "Germany",
    address: "Cargo City Süd, 60549 Frankfurt",
    hours: "Mon–Fri 07:00–20:00",
    services: ["Air freight", "Customs brokerage", "Warehousing"],
    serviceTypes: ["Air", "Customs", "Warehouse"]
  },
  {
    id: "dxb",
    city: "Dubai",
    country: "UAE",
    address: "Dubai Logistics City",
    hours: "24/7 operations desk",
    services: ["Ocean FCL", "Air express", "Bonded storage"],
    serviceTypes: ["Ocean", "Air", "Warehouse"]
  },
  {
    id: "sin",
    city: "Singapore",
    country: "Singapore",
    address: "Airline House, Changi",
    hours: "Mon–Sun 05:00–23:00",
    services: ["Regional hub", "Customs", "Fulfillment"],
    serviceTypes: ["Air", "Customs", "Warehouse"]
  },
  {
    id: "ord",
    city: "Chicago",
    country: "USA",
    address: "O'Hare Cargo Campus",
    hours: "Mon–Sun 05:00–21:00",
    services: ["Ground linehaul", "Air", "Cross-dock"],
    serviceTypes: ["Ground", "Air"]
  }
];
