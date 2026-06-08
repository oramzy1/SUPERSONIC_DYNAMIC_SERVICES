import React, { useState, useRef, useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router"; 
import {
  Bell,
  FileText,
  HelpCircle,
  LayoutGrid,
  Briefcase,
  Users,
  Receipt,
  Wrench,
  MapPin,
  BarChart3,
  Search,
  Settings,
  LogOut,
  User,
  ChevronsUpDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/images/logo.png";

const NAV = [
  { to: "/admindashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/adminquotes", label: "Quotes", icon: FileText },
  { to: "/adminjobs", label: "Jobs", icon: Briefcase },
  { to: "/admincustomers", label: "Customers", icon: Users },
  { to: "/admininvoices", label: "Invoices", icon: Receipt },
  { to: "/adminservices", label: "Services", icon: Wrench },
  { to: "/admintracking", label: "Tracking", icon: MapPin },
  { to: "/adminanalytics", label: "Analytics", icon: BarChart3 },
  { to: "/adminnotifications", label: "Notifications", icon: Bell },
  { to: "/adminsettings", label: "Settings", icon: Settings },
] as const;

export function AdminDashboardSidebar() {
  const { location } = useRouterState();
  const navigate = useNavigate(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);

  // Synchronize mobile visibility via native safe cross-component window listeners
  useEffect(() => {
    const handleToggleMobile = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener("toggle-admin-sidebar", handleToggleMobile);
    return () => window.removeEventListener("toggle-admin-sidebar", handleToggleMobile);
  }, []);

  // Close dropups & drawers if user changes views
  useEffect(() => {
    setIsMobileOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle click outside hooks safely
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        isMobileOpen &&
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target as Node)
      ) {
        // Only close if we didn't click the menu trigger button directly
        const target = event.target as HTMLElement;
        if (!target.closest(".mobile-sidebar-toggle-btn")) {
          setIsMobileOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("supersonic_admin_authed");
    window.dispatchEvent(new Event("storage"));
    navigate({ to: "/" });
  };

  // Reusable core nav elements to maintain exact identity styling mapping
  const SidebarContent = () => (
    <>
      <div>
        <div className="mb-8 flex items-center justify-between px-6">
          <Link to="/admindashboard" className="flex items-center gap-2">
            <img src={logo} alt="Supersonic" className="h-8 w-auto object-contain" />
          </Link>
          {/* Close menu button visible only on mobile wrappers */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((n) => {
            const active = location.pathname.startsWith(n.to);
            const Icon = n.icon;

            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition duration-200 group",
                  active
                    ? "text-[#E2A54A] bg-[#E2A54A]/5 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-200",
                )}
              >
                {active && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-0.75 bg-[#E2A54A] rounded-r" />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active ? "text-[#E2A54A]" : "text-slate-400 group-hover:text-slate-300",
                  )}
                />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        ref={menuRef}
        className="relative flex flex-col gap-4 px-3 border-t border-[#1c1e21] pt-4"
      >
        {isMenuOpen && (
          <div className="absolute bottom-18 left-3 right-3 z-50 flex flex-col gap-1 bg-[#16191c] border border-slate-800 rounded-xl p-1.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition"
            >
              <User className="h-4 w-4 text-slate-500" />
              View Profile
            </button>

            <Link
              to="/adminsettings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              Account Settings
            </Link>

            <div className="h-px bg-slate-800/60 my-1 mx-1" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            >
              <LogOut className="h-4 w-4 text-rose-400/80" />
              Log Out
            </button>
          </div>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "flex items-center justify-between w-full gap-2 px-3 py-2 bg-slate-900/20 rounded-xl border border-slate-800/40 text-left outline-none transition focus:border-slate-700 hover:bg-slate-800/20",
            isMenuOpen && "border-slate-700 bg-slate-800/20",
          )}
        >
          <div className="flex items-center gap-3 truncate">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin User"
                className="w-9 h-9 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111315] rounded-full" />
            </div>

            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-200 truncate leading-tight">
                Admin User
              </span>
              <span className="text-[11px] text-slate-500 truncate leading-none mt-0.5">
                admin@aerologix.com
              </span>
            </div>
          </div>

          <ChevronsUpDown className="h-4 w-4 text-slate-500 shrink-0" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. DESKTOP VIEW SIDEBAR PANEL LAYOUT */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-[#1c1e21] bg-[#111315] pb-6 pt-6 md:flex select-none">
        <SidebarContent />
      </aside>

      {/* 2. MOBILE VIEW SLIDEOUT SIDEBAR DRAWER PANEL LAYOUT */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden select-none",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          ref={mobileSidebarRef}
          className={cn(
            "absolute top-0 bottom-0 left-0 flex w-64 flex-col justify-between border-r border-[#1c1e21] bg-[#111315] pb-6 pt-6 transition-transform duration-300 ease-in-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent />
        </div>
      </div>
    </>
  );
}

export function AdminDashboardTopbar() {
  const handleOpenMobileSidebar = () => {
    window.dispatchEvent(new Event("toggle-admin-sidebar"));
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#1c1e21] bg-[#111315]/85 px-4 sm:px-8 py-4 backdrop-blur-xl gap-4">
      
      {/* Mobile Hamburger Trigger Toggle Button */}
      <button
        onClick={handleOpenMobileSidebar}
        className="mobile-sidebar-toggle-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#16191c] border border-slate-800/40 text-slate-400 hover:text-slate-200 md:hidden transition"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search Input Box Layout */}
      <div className="flex flex-1 items-center gap-3 rounded-xl bg-[#16191c] px-4 py-2.5 max-w-md border border-slate-800/20">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          placeholder="Search orders, clients, or IDs..."
          className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Right Core Action Tools Overlay Options */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#E2A54A] rounded-full" />
        </button>

        <button className="hidden sm:grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="hidden sm:block h-8 w-px bg-[#1c1e21]" />

        {/* Header User Corner Profile Icon Token */}
        <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-700 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Profile Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}