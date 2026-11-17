import type { DemoTimelineEvent } from "@/lib/demo/customer-fixtures";
import { ShipmentStatusBadge } from "@/components/dashboard/status-badge";

export function ShipmentTimeline({ events }: { events: DemoTimelineEvent[] }) {
  if (!events.length) {
    return (
      <p className="text-sm text-slate-500">
        No timeline events are available for this demonstration shipment.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="relative border-l-2 border-brand-yellow/50 pl-4">
          <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-yellow" />
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-brand-navy">{event.title}</p>
            <ShipmentStatusBadge status={event.status} />
          </div>
          <p className="mt-1 text-sm text-slate-600">{event.description}</p>
          <p className="mt-1 text-xs text-slate-500">
            {event.location} · {new Date(event.timestamp).toLocaleString()}
          </p>
        </li>
      ))}
    </ol>
  );
}
