import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Layers } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { getNotificationRoute } from "@/lib/notificationRouting";
import type { NotificationResponse } from "@/lib/api-types";

const MAX_CASCADE = 8;
const SWIPE_THRESHOLD = 100;

export function NotificationsStack({
  role,
  onOpenSheet,
}: {
  role: "admin" | "customer" | "crew";
  onOpenSheet: () => void;
}) {
  const { user } = useAuth();
  const { notifications, markRead } = useNotifications();
  const navigate = useNavigate();
  const [cards, setCards] = useState<NotificationResponse[]>([]);
  const [overflowDismissed, setOverflowDismissed] = useState(false);
  const [shown, setShown] = useState(false);

  const sessionKey = user ? `sds_notif_stack_seen_${user.id}` : null;

  useEffect(() => {
    if (!user || !sessionKey || shown) return;
    if (sessionStorage.getItem(sessionKey)) return;
    const unread = notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;
    setCards(unread.slice(0, MAX_CASCADE));
    setShown(true);
    sessionStorage.setItem(sessionKey, "1");
  }, [notifications, user, sessionKey, shown]);

  const totalUnread = notifications.filter((n) => !n.is_read).length;
  const overflow = totalUnread > MAX_CASCADE + 1;

  const dismissCard = (id: number) => setCards((prev) => prev.filter((c) => c.id !== id));

  const handleCardOpen = (n: NotificationResponse) => {
    markRead.mutate(n.id);
    dismissCard(n.id);
    const route = getNotificationRoute(n, role);
    if (route) navigate(route as any);
  };

  if (overflow) {
    if (overflowDismissed) return null;
    return (
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) setOverflowDismissed(true);
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed bottom-6 right-6 z-140 w-72 cursor-grab active:cursor-grabbing rounded-2xl border border-[#E2A54A]/30 bg-[#0f1113] shadow-2xl p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-[#E2A54A]">
            <Layers className="h-4 w-4" />
            <span className="text-sm font-bold">{totalUnread} new notifications</span>
          </div>
          <button onClick={() => setOverflowDismissed(true)} className="text-slate-500 hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Too many to preview individually. Swipe away or view all.</p>
        <button
          onClick={() => { setOverflowDismissed(true); onOpenSheet(); }}
          className="mt-3 w-full rounded-lg bg-[#E2A54A] text-slate-950 text-xs font-bold py-2"
        >
          View all
        </button>
      </motion.div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-140 flex flex-col-reverse gap-2">
      <AnimatePresence>
        {cards.map((n, i) => (
          <motion.div
            key={n.id}
            layout
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) dismissCard(n.id);
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
            exit={{ opacity: 0, x: 300, transition: { duration: 0.15 } }}
            onClick={() => handleCardOpen(n)}
            className="w-72 cursor-grab active:cursor-grabbing rounded-xl border border-white/10 bg-[#0f1113] shadow-xl p-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-[#E2A54A]">
                <Bell className="h-3.5 w-3.5" />
                <span className="text-xs font-bold text-white line-clamp-1">{n.title}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); dismissCard(n.id); }}
                className="text-slate-500 hover:text-slate-300 shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {n.message && <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.message}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}