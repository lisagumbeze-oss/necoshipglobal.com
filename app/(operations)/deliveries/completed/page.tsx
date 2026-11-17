import { DeliveryList } from "@/components/operations/delivery-list";

export default function DeliveriesCompletedPage() {
  return (
    <DeliveryList
      statuses={["DELIVERED"]}
      title="Completed deliveries"
      description="Demonstration successfully delivered stops."
    />
  );
}
