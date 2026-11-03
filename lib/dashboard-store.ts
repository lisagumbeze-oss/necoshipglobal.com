import { create } from "zustand";

type DashboardFilters = {
  serviceType: string;
  carrier: string;
  region: string;
  invoiceStatus: string;
  shipmentStatus: string;
  shipmentSearch: string;
  trackingQuery: string;
  setFilter: (
    key:
      | "serviceType"
      | "carrier"
      | "region"
      | "invoiceStatus"
      | "shipmentStatus"
      | "shipmentSearch"
      | "trackingQuery",
    value: string
  ) => void;
  resetFilters: () => void;
};

const initialState = {
  serviceType: "",
  carrier: "",
  region: "",
  invoiceStatus: "",
  shipmentStatus: "",
  shipmentSearch: "",
  trackingQuery: ""
};

export const useDashboardFilters = create<DashboardFilters>((set) => ({
  ...initialState,
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetFilters: () => set(initialState)
}));
