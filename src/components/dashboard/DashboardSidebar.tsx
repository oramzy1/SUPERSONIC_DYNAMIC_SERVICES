import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Receipt,
  Search,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/images/logo.png";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/dashboard/quotes", label: "Quote History", icon: FileText },
  { to: "/dashboard/invoices", label: "Invoices", icon: Receipt },
] as const;

export function DashboardSidebar() {
  const { location } = useRouterState();
  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/5 bg-[#0E141A] p-5 md:flex">
      <div>
        <Link to="/" className="mb-10 flex items-center gap-2 px-2">
          <img src={logo} alt="Supersonic" className="h-9 w-auto" />
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => {
            const active = location.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-[#002B73] text-white"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <button className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-white/5">
          <LogOut className="h-4 w-4" /> EXIT
        </button>
        <Link
          to="/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" /> Settings
        </Link>
        <Link
          to="/contact"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" /> Support
        </Link>
      </div>
    </aside>
  );
}

export function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/5 bg-[#0E141A]/85 px-6 py-4 backdrop-blur-xl md:px-10">
      <div className="flex flex-1 items-center gap-2 rounded-full bg-surface px-4 py-2.5 md:max-w-xl">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search Kinetic Hub..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <button className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:text-foreground">
        <Bell className="h-5 w-5" />
      </button>
      <div className="hidden items-center gap-3 md:flex">
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">Clinton Nweze</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Enterprise User
          </p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-primary to-[#002B73] text-xs font-bold text-primary-foreground">
          CN
        </div>
      </div>
    </header>
  );
}
