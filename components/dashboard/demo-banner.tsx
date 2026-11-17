import { DEMO_DATA_NOTICE } from "@/lib/demo/customer-fixtures";

export function DemoDataBanner({
  className = "",
  notice = DEMO_DATA_NOTICE
}: {
  className?: string;
  notice?: string;
}) {
  return (
    <div
      role="status"
      className={`rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950 sm:text-sm ${className}`}
    >
      {notice}
    </div>
  );
}
