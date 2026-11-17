import { DeliveryList } from "@/components/operations/delivery-list";

export default function DeliveriesOutPage() {
  return (
    <DeliveryList
      statuses={["OUT_FOR_DELIVERY"]}
      title="Out for delivery"
      description="Demonstration last-mile runs currently marked out for delivery."
    />
  );
}
