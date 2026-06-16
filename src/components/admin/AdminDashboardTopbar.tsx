import { useEffect, useRef, useState } from "react";
import { Bell, HelpCircle, Search, X, Menu } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

interface TopbarProps {
  onMenuToggle: () => void;
}

export function AdminDashboardTopbar({ onMenuToggle }: TopbarProps) {
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setOpenNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("supersonic_admin_authed");
    localStorage.clear();
    sessionStorage.clear();
    setOpenProfile(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-90 w-full flex items-center justify-between border-b border-[#1c1e21] bg-[#100315]/80 px-4 sm:px-6 py-3 backdrop-blur-xl gap-3 shrink-0 box-border">
      {/* LEFT: Hamburger + Search */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
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
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setOpenNotifications(!openNotifications)}
            className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E2A54A] rounded-full" />
          </button>

          {/* Backdrop */}
          {openNotifications && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-9"
              onClick={() => setOpenNotifications(false)}
            />
          )}

          {/* Slide-in drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-[min(320px,100vw)] bg-[#0f1113] border-l border-[#1c1e21] shadow-2xl z-110 transform transition-transform duration-300 ease-in-out ${
              openNotifications ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#1c1e21]">
              <h2 className="text-slate-200 font-medium">Notifications</h2>
              <button
                onClick={() => setOpenNotifications(false)}
                className="p-1 rounded-md hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-[80%] text-center px-6 select-none">
              <Bell className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No notifications yet</p>
              <p className="text-slate-600 text-xs mt-1">User updates will appear here</p>
            </div>
          </div>
        </div>

        {/* HELP — hidden on very small screens */}
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
                  <p className="text-slate-200 text-sm font-medium truncate">Admin User</p>
                  <p className="text-slate-500 text-xs truncate">admin@supersonic.com</p>
                  <span className="text-[10px] text-[#E2A54A] font-semibold mt-0.5 block">
                    Super Admin
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
                <Link
                  to={"/adminsettings" as any}
                  onClick={() => setOpenProfile(false)}
                  className="text-left px-3 py-2 hover:bg-[#16191c] rounded-md text-slate-300 block transition-colors"
                >
                  Account Settings
                </Link>
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

export const ProtectedAdminTopbar = (props: TopbarProps) => (
  <AdminAuthGuard>
    <AdminDashboardTopbar {...props} />
  </AdminAuthGuard>
);
