import { DeliveryList } from "@/components/operations/delivery-list";

export default function DeliveriesAssignedPage() {
  return (
    <DeliveryList
      statuses={["ASSIGNED"]}
      title="Assigned deliveries"
      description="Demonstration deliveries with driver/vehicle allocation."
    />
  );
}
