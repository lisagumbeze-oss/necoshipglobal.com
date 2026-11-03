import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ShipmentStatus =
  | "In Transit"
  | "Delivered"
  | "Customs Hold"
  | "Out for Delivery"
  | "Exception";
