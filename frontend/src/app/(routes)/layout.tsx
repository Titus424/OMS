import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/ui/cn";
import { LogoutButton } from "@/ui/logout-button";

export default function RoutesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-[260px_1fr]">
      <aside className="hidden md:flex flex-col border-r border-black/10 dark:border-white/10 p-4 gap-2">
        <div className="text-xl font-semibold py-2">OMS</div>
        <nav className="flex flex-col gap-1">
          <Section label="Admin" />
          <NavLink href="/admin" label="Dashboard" />
          <NavLink href="/admin/orders" label="Orders" />
          <NavLink href="/admin/staff" label="Staff" />
          <NavLink href="/admin/reports" label="Reports" />
          <NavLink href="/admin/settings" label="Settings" />
          <Section label="Staff" />
          <NavLink href="/staff/orders" label="My Orders" />
        </nav>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="text-xs text-foreground/60">v0.1.0</div>
          <LogoutButton />
        </div>
      </aside>
      <main className="p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}

function Section({ label }: { label: string }) {
  return <div className="mt-4 mb-1 text-xs uppercase tracking-wider text-foreground/60">{label}</div>;
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className={cn(
        "px-3 py-2 rounded-md hover:bg-foreground/5 text-sm transition-colors"
      )}
      href={href}
    >
      {label}
    </Link>
  );
}
