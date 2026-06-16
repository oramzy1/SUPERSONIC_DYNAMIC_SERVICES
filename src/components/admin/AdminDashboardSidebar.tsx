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

  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggleMobile = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener("toggle-admin-sidebar", handleToggleMobile);
    return () => window.removeEventListener("toggle-admin-sidebar", handleToggleMobile);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInsideDesktopMenu = desktopMenuRef.current?.contains(target);
      const clickedInsideMobileMenu = mobileMenuRef.current?.contains(target);

      if (isMenuOpen && !clickedInsideDesktopMenu && !clickedInsideMobileMenu) {
        setIsMenuOpen(false);
      }

      if (isMobileOpen && mobileSidebarRef.current && !mobileSidebarRef.current.contains(target)) {
        const targetElement = event.target as HTMLElement;
        if (!targetElement.closest(".mobile-sidebar-toggle-btn")) {
          setIsMobileOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isMobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("supersonic_admin_authed");
    localStorage.clear();
    sessionStorage.clear();

    setIsMenuOpen(false);
    setIsMobileOpen(false);

    navigate({ to: "/" });
  };

  const SidebarContent = ({ menuRef }: { menuRef: React.RefObject<HTMLDivElement | null> }) => (
    <>
      <div className="flex-1 flex flex-col min-h-0 w-full">
        <div className="mb-8 flex items-center justify-between px-6 shrink-0">
          <Link to="/admindashboard" className="flex items-center gap-2">
            <img src={logo} alt="Supersonic" className="h-8 w-auto object-contain" />
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/4 hover:text-slate-200 md:hidden focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto hidden-scrollbar w-full">
          {NAV.map((n) => {
            const active = location.pathname.startsWith(n.to);
            const Icon = n.icon;

            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition duration-200 group w-full",
                  active
                    ? "text-[#E2A54A] bg-[#E2A54A]/5 font-semibold"
                    : "text-slate-400 hover:bg-white/3 hover:text-slate-200",
                )}
              >
                {active && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-0.75 bg-[#E2A54A] rounded-r" />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active ? "text-[#E2A54A]" : "text-slate-400 group-hover:text-slate-300",
                  )}
                />
                <span className="truncate">{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        ref={menuRef}
        className="relative flex flex-col gap-4 px-3 border-t border-white/6 pt-4 shrink-0 w-full"
      >
        {isMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 z-60 flex flex-col gap-1 bg-[#0d111a] border border-white/8 backdrop-blur-xl rounded-xl p-1.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 max-w-full overflow-hidden">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/4 rounded-lg transition truncate focus:outline-none"
            >
              <User className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="truncate">View Profile</span>
            </button>

            <Link
              to={"/adminsettings" as any}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/4 rounded-lg transition truncate"
            >
              <Settings className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="truncate">Account Settings</span>
            </Link>

            <div className="h-px bg-white/6 my-1 mx-1" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition truncate focus:outline-none"
            >
              <LogOut className="h-4 w-4 shrink-0 text-rose-400/80" />
              <span className="truncate">Log Out</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "flex items-center justify-between w-full gap-2 px-3 py-2 bg-white/2 rounded-xl border border-white/6 text-left outline-none transition focus:border-white/15 hover:bg-white/4 overflow-hidden",
            isMenuOpen && "border-white/15 bg-white/4",
          )}
        >
          <div className="flex items-center gap-3 truncate min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin User"
                className="w-9 h-9 rounded-full object-cover border border-white/8"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0d111a] rounded-full" />
            </div>

            <div className="flex flex-col truncate min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate leading-tight">
                Admin User
              </span>
              <span className="text-[11px] text-slate-500 truncate leading-none mt-0.5">
                admin@aerologix.com
              </span>
            </div>
          </div>

          <span className="h-4 w-4 text-slate-500 shrink-0 pointer-events-none">
            <ChevronsUpDown className="h-4 w-4" />
          </span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. DESKTOP VIEW SIDEBAR PANEL LAYOUT */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col justify-between border-r border-white/6 bg-[#0d111a]/40 backdrop-blur-md pb-6 pt-6 relative z-40 select-none h-screen top-0">
        <SidebarContent menuRef={desktopMenuRef} />
      </aside>

      {/* 2. MOBILE VIEW SLIDEOUT SIDEBAR DRAWER PANEL LAYOUT */}
      <div
        className={cn(
          "fixed inset-0 z-100 bg-[#100315]/80 backdrop-blur-sm transition-opacity duration-300 md:hidden select-none",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed top-0 bottom-0 left-0 flex w-64 max-w-[80vw] flex-col justify-between border-r border-white/6 bg-[#0d111a] pb-6 pt-6 transition-transform duration-300 ease-in-out z-105",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          ref={mobileSidebarRef}
        >
          <SidebarContent menuRef={mobileMenuRef} />
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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/6 bg-[#0d111a]/40 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-xl gap-4 w-full box-border">
      <button
        onClick={handleOpenMobileSidebar}
        className="mobile-sidebar-toggle-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/2 border border-white/6 text-slate-400 hover:text-slate-200 md:hidden transition focus:outline-none"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/2 px-4 py-2.5 max-w-xs sm:max-w-md border border-white/4 min-w-0">
        <Search className="h-4 w-4 text-slate-500 shrink-0" />
        <input
          placeholder="Search..."
          className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500 min-w-0"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/4 focus:outline-none">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#E2A54A] rounded-full" />
        </button>

        <button className="hidden sm:grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/4 focus:outline-none">
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="hidden sm:block h-8 w-px bg-white/6 shrink-0" />

        <div className="h-9 w-9 overflow-hidden rounded-full border border-white/8 shrink-0">
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
