import { useNavigate } from "@tanstack/react-router";
import { X, Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { getNotificationRoute } from "@/lib/notificationRouting";
import type { NotificationResponse } from "@/lib/api-types";

export function NotificationsSheet({
  open, onClose, role,
}: { open: boolean; onClose: () => void; role: "admin" | "customer" | "crew" }) {
  const navigate = useNavigate();
  const { notifications, unread, markRead, markAllRead } = useNotifications();

  const handleClick = (n: NotificationResponse) => {
    if (!n.is_read) markRead.mutate(n.id);
    const route = getNotificationRoute(n, role);
    onClose();
    if (route) navigate(route as any);
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-110" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-[min(380px,100vw)] bg-[#0f1113] border-l border-[#1c1e21] shadow-2xl z-120 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#1c1e21]">
          <h2 className="text-slate-200 font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#E2A54A]" /> Notifications
            {unread > 0 && <span className="text-xs text-[#E2A54A]">({unread})</span>}
          </h2>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button onClick={() => markAllRead.mutate()} className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-800/40 text-slate-400 hover:text-slate-200">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Bell className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <button key={n.id} onClick={() => handleClick(n)}
                className={`w-full text-left px-4 py-3 border-b border-[#1c1e21]/60 hover:bg-[#1c1e21]/40 transition-colors ${n.is_read ? "opacity-70" : "bg-[#E2A54A]/5"}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-sm font-semibold ${n.is_read ? "text-slate-300" : "text-white"}`}>{n.title}</span>
                  {!n.is_read && <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[#E2A54A] shrink-0" />}
                </div>
                {n.message && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.message}</p>}
                <span className="text-[10px] text-slate-600 mt-1 block">{new Date(n.created_at).toLocaleString()}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}