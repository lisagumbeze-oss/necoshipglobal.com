import type { DemoTimelineEvent } from "@/lib/demo/customer-fixtures";
import { Timeline } from "@/components/design-system/timeline";
import { getShipmentStatus } from "@/lib/demo/shipment-status";

export function ShipmentTimeline({ events }: { events: DemoTimelineEvent[] }) {
  return (
    <Timeline
      items={events.map((event) => {
        const status = getShipmentStatus(event.status);
        return {
          id: event.id,
          title: event.title,
          description: event.description,
          meta: `${event.location} · ${new Date(event.timestamp).toLocaleString()}`,
          badge: status.label,
          tone: status.tone
        };
      })}
      empty="No timeline events are available for this demonstration shipment."
    />
  );
}
