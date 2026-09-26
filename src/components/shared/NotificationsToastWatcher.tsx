import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useNotifications } from "@/hooks/useNotifications";
import { getNotificationRoute } from "@/lib/notificationRouting";

export function NotificationToastWatcher({ role }: { role: "admin" | "customer" | "crew" }) {
  const { notifications, markRead } = useNotifications();
  const navigate = useNavigate();
  const seenIds = useRef<Set<number> | null>(null);

  useEffect(() => {
    if (!notifications.length) return;
    if (seenIds.current === null) {
      seenIds.current = new Set(notifications.map((n) => n.id)); // don't toast the initial backlog
      return;
    }
    notifications
      .filter((n) => !seenIds.current!.has(n.id) && !n.is_read)
      .forEach((n) => {
        seenIds.current!.add(n.id);
        toast(n.title, {
          description: n.message ?? undefined,
          duration: 6000,
          action: {
            label: "View",
            onClick: () => {
              markRead.mutate(n.id);
              const route = getNotificationRoute(n, role);
              if (route) navigate(route as any);
            },
          },
        });
      });
  }, [notifications]);

  return null;
}