import { redirect } from "next/navigation";

export default function FleetIndexPage() {
  redirect("/admin/fleet/vehicles");
}
