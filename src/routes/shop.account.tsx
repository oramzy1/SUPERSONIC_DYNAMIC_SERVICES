import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { CreditCard, Heart, MapPin, Package, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/account")({
  head: () => ({ meta: [{ title: "Account - Supersonic Shop" }] }),
  component: AccountLayout,
});

const LINKS: {
  to: string;
  label: string;
  icon: typeof User;
  exact?: boolean;
}[] = [
  { to: "/shop/account", label: "Overview", icon: User, exact: true },
  { to: "/shop/account/orders", label: "Orders", icon: Package },
  { to: "/shop/account/transactions", label: "Transactions", icon: CreditCard },
  { to: "/shop/account/saved", label: "Saved items", icon: Heart },
  { to: "/shop/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/shop/account/settings", label: "Settings", icon: Settings },
];

function AccountLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">My account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your orders, invoices and preferences.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/8 text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
