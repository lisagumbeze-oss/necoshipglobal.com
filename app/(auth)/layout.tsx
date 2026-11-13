import { RoleSwitcher } from "@/components/auth/role-switcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const showDevChrome = process.env.NODE_ENV !== "production";

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-navy to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-3">
        {showDevChrome ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-slate-200/60 bg-white/10 px-3 py-2 text-sm text-slate-100 backdrop-blur">
            <span className="text-xs">Development session tools (hidden in production).</span>
            <RoleSwitcher variant="dark" />
          </div>
        ) : null}
        <div className="rounded-card bg-white p-2 md:p-6">{children}</div>
      </div>
    </div>
  );
}
