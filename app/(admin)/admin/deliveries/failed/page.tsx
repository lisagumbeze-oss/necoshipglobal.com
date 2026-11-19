import { DeliveryList } from "@/components/operations/delivery-list";

export default function DeliveriesFailedPage() {
  return (
    <DeliveryList
      statuses={["FAILED_ATTEMPT", "EXCEPTION"]}
      title="Failed deliveries"
      description="Demonstration failed attempts and delivery exceptions."
    />
  );
}
