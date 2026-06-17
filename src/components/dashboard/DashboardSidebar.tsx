import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  FileText,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Receipt,
  Search,
  Settings,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/images/logo.png";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/dashboard/quotes", label: "Quote History", icon: FileText },
  { to: "/dashboard/invoices", label: "Invoices", icon: Receipt },
] as const;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = () => {
    if (onClose) onClose();
    setIsExiting(true);
    setTimeout(() => {
      navigate({ to: "/" });
    }, 2000);
  };

  const sidebarContent = (
    <>
      <div className="flex flex-col">
        <div className="mb-10 flex items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <img src={logo} alt="Supersonic" className="h-9 w-auto" />
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => {
            const active = location.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={onClose}
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

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={handleExit}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-white/5 w-full cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> EXIT
        </button>
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" /> Settings
        </Link>
        <Link
          to="/contact"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" /> Support
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR - FIXED VIEWPORT LOCK */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/5 bg-[#0E141A] p-5 md:flex fixed left-0 top-0 h-screen z-40">
        {sidebarContent}
      </aside>

      {/* MOBILE SIDEBAR MOBILE DRAWER */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex md:hidden pointer-events-none transition-all duration-300",
          isOpen ? "pointer-events-auto" : "",
        )}
      >
        <div
          onClick={onClose}
          className={cn(
            "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        />

        <aside
          className={cn(
            "relative flex w-72 max-w-[80vw] flex-col justify-between bg-[#0E141A] p-5 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out transform",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebarContent}
        </aside>
      </div>

      {/* AUTO-EXIT LOADING SPINNER MODAL OVERLAY */}
      {isExiting && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0B0F14]/90 backdrop-blur-md transition-all duration-300">
          <div className="bg-[#0F151C] border border-white/10 rounded-2xl p-6 shadow-2xl text-center space-y-4 max-w-72.5 w-full mx-6">
            <div className="relative mx-auto h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-[#8EA7FF]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white tracking-tight">Exiting Dashboard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Saving session parameters. Redirecting to home terminal view...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface TopbarProps {
  onMenuOpen: () => void;
}

export function DashboardTopbar({ onMenuOpen }: TopbarProps) {
  return (
    <header className="fixed top-0 right-0 z-30 flex items-center gap-3 sm:gap-4 border-b border-white/5 bg-[#0E141A]/95 px-4 py-3 backdrop-blur-xl md:px-10 md:py-4 w-full md:w-[calc(100vw-16rem)] h-14 md:h-20">
      {/* Mobile Menu Open Trigger */}
      <button
        onClick={onMenuOpen}
        type="button"
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground md:hidden shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Responsive Input Frame */}
      <div className="flex flex-1 items-center gap-2 rounded-full bg-surface px-3.5 py-2 md:px-4 md:py-2.5 max-w-xs sm:max-w-md md:max-w-xl">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          placeholder="Search..."
          className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <button className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:text-foreground shrink-0 ml-auto sm:ml-0">
        <Bell className="h-5 w-5" />
      </button>

      {/* User Branding Avatar Segment */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden text-right xs:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] line-clamp-1">
            Clinton Nweze
          </p>
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground line-clamp-1">
            Enterprise User
          </p>
        </div>
        <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-[#002B73] text-xs font-bold text-white tracking-wider border border-white/5">
          CN
        </div>
      </div>
    </header>
  );
}