import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  TruckElectric
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext"; 
import Logo from "../shared/Logo";
import { useNotifications } from "@/hooks/useNotifications";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/dashboard/quotes", label: "Quote History", icon: FileText },
  { to: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { to: "/dashboard/jobs", label: "Jobs", icon: TruckElectric },
] as const;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const { location } = useRouterState();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = async () => {
    await logout();
    setIsExiting(true);
    setTimeout(() => {
      navigate({ to: "/login" });
    }, 2000);
  };

  const sidebarContent = (
    <>
      <div className="flex flex-col">
        <div className="mb-10 flex items-center justify-between px-2">
         <Logo />
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
          <LogOut className="h-4 w-4" /> LOGOUT
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
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-hidden
        />
      )}

      {/* Single sidebar: fixed on desktop (always visible), slide-in drawer on mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col justify-between border-r border-white/10 bg-[#0E141A] p-5 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 md:border-white/5 md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Auto-exit loading spinner modal overlay */}
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
  onNotificationsClick: () => void;
}

export function DashboardTopbar({ onMenuOpen, onNotificationsClick }: TopbarProps) {
  const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { unread } = useNotifications();
    const [openNotifications, setOpenNotifications] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
  
    // const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
  
 useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
    const handleLogout = async () => {
      await logout();
      sessionStorage.clear();
      setOpenProfile(false);
      navigate({ to: "/" });
    };

  return (
    // <header className="fixed top-0 right-0 z-30 flex items-center gap-3 sm:gap-4 border-b border-white/5 bg-[#0E141A]/95 px-4 py-3 backdrop-blur-xl md:px-10 md:py-4 w-full md:w-[calc(100vw-16rem)] h-14 md:h-20">
      <header className="sticky top-0 z-90 w-full flex items-center justify-between border-b border-[#1c1e21] bg-[#100315]/80 px-4 sm:px-6 py-3 backdrop-blur-xl gap-3 shrink-0 box-border">
            {/* LEFT: Hamburger + Search */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Mobile menu toggle */}
              <button
                onClick={onMenuOpen}
                type="button"
                className="p-2 -ml-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors lg:hidden shrink-0 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
      
              {/* Search bar */}
              <div className="flex items-center gap-2 rounded-xl bg-[#16191c] px-3 py-2 border border-slate-800/40 flex-1 min-w-0 max-w-xs sm:max-w-md">
                <Search className="h-4 w-4 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search orders, clients, or IDs..."
                  className="w-full min-w-0 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500 font-sans"
                />
              </div>
            </div>
      
            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* NOTIFICATIONS */}
            <button
          onClick={onNotificationsClick}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E2A54A] rounded-full" />}
        </button>
      
              {/* HELP - hidden on very small screens */}
              <button
                className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors focus:outline-none"
                aria-label="Help"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
      
              {/* DIVIDER */}
              <div className="hidden sm:block h-6 w-px bg-[#1c1e21]" />
      
              {/* PROFILE */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="h-9 w-9 overflow-hidden rounded-full border border-slate-700/60 shadow-inner bg-slate-900 shrink-0 select-none cursor-pointer outline-none transition focus:border-slate-500"
                  aria-label="Profile menu"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </button>
      
                {/* Profile Dropdown */}
                {openProfile && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#0f1113] border border-[#1c1e21] rounded-xl shadow-xl z-100 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info */}
                    <div className="flex items-center gap-3 p-2 border-b border-[#1c1e21]">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                        alt="User Thumbnail"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-200 text-sm font-medium truncate capitalize">{user?.full_name || "Admin"}</p>
                        <p className="text-slate-500 text-xs truncate">{user?.email || "admin@supersonicdynamicservices.nl"}</p>
                        <span className="text-[10px] text-[#E2A54A] font-semibold mt-0.5 block capitalize">
                          {user?.role || "Admin"}
                        </span>
                      </div>
                    </div>
      
                    {/* Actions */}
                    <div className="mt-2 flex flex-col text-sm">
                      <button
                        onClick={() => setOpenProfile(false)}
                        className="text-left px-3 py-2 hover:bg-[#16191c] rounded-md text-slate-300 cursor-pointer transition-colors focus:outline-none"
                      >
                        View Profile
                      </button>
                      {/* <Link
                        to={"/adminsettings" as any}
                        onClick={() => setOpenProfile(false)}
                        className="text-left px-3 py-2 hover:bg-[#16191c] rounded-md text-slate-300 block transition-colors"
                      >
                        Account Settings
                      </Link> */}
                      <button
                        onClick={handleLogout}
                        className="text-left px-3 py-2 hover:bg-rose-500/10 text-rose-400 rounded-md mt-1 cursor-pointer font-semibold transition-colors focus:outline-none"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
  );
}