import { useEffect, useRef, useState } from "react";
import { Bell, HelpCircle, Search, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function AdminDashboardTopbar() {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setOpenNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#1c1e21] bg-[#111315]/80 px-8 py-4 backdrop-blur-xl">
        {/* LEFT SIDE */}
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-[#16191c] px-4 py-2.5 max-w-md border border-slate-800/40">
          <Search className="h-4 w-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search orders, clients, or IDs..."
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500 font-sans"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* NOTIFICATION */}
          <div ref={notifRef} className="relative z-40">
            <button
              onClick={() => setOpenNotifications(!openNotifications)}
              className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E2A54A] rounded-full" />
            </button>

            {/* RIGHT SLIDE NOTIFICATION PANEL */}
            <div
              className={`fixed top-0 right-0 h-full w-80 bg-[#0f1113] border-l border-[#1c1e21] shadow-2xl z-50 transform transition-transform duration-300
              ${openNotifications ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex items-center justify-between p-4 border-b border-[#1c1e21]">
                <h2 className="text-slate-200 font-medium">Notifications</h2>
                <button onClick={() => setOpenNotifications(false)}>
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              {/* EMPTY STATE */}
              <div className="flex flex-col items-center justify-center h-[80%] text-center px-6">
                <Bell className="h-10 w-10 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">No notifications yet</p>
                <p className="text-slate-600 text-xs mt-1">User updates will appear here</p>
              </div>
            </div>
          </div>

          {/* HELP */}
          <button className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>

          <div className="h-6 w-px bg-[#1c1e21]" />

          {/* PROFILE - Elevated z-index layer explicitly forces this wrapper above all layout segments */}
          <div ref={profileRef} className="relative z-50">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="h-9 w-9 overflow-hidden rounded-full border border-slate-700/60 shadow-inner bg-slate-900 shrink-0 select-none cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </button>

            {/* PROFILE DROPDOWN */}
            {openProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-[#0f1113] border border-[#1c1e21] rounded-xl shadow-xl z-50 p-3">
                {/* USER INFO */}
                <div className="flex items-center gap-3 p-2 border-b border-[#1c1e21]">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    className="h-10 w-10 rounded-full"
                    alt="User Thumbnail"
                  />
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Admin User</p>
                    <p className="text-slate-500 text-xs">admin@supersonic.com</p>
                    <span className="text-[10px] text-[#E2A54A]">Super Admin</span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-2 flex flex-col text-sm">
                  <button
                    onClick={() => setOpenProfile(false)}
                    className="text-left px-3 py-2 hover:bg-[#16191c] rounded-md text-slate-300 cursor-pointer"
                  >
                    View Profile
                  </button>

                  <Link
                    to="/adminsettings"
                    onClick={() => setOpenProfile(false)}
                    className="text-left px-3 py-2 hover:bg-[#16191c] rounded-md text-slate-300 block"
                  >
                    Account Settings
                  </Link>

                  <button className="text-left px-3 py-2 hover:bg-red-500/10 text-red-400 rounded-md mt-1 cursor-pointer">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
