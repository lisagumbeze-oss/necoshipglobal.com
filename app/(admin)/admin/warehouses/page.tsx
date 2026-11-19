import { redirect } from "next/navigation";

export default function WarehousesIndexPage() {
  redirect("/admin/warehouses/locations");
}
