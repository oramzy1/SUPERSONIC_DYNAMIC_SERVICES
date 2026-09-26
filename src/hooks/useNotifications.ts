import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const uid = user?.id;

  const listQuery = useQuery({
    queryKey: ["notifications", "list", uid],
    queryFn: () => notificationsApi.list({ limit: 50 }),
    enabled: !!uid,
    refetchInterval: 20_000,
  });

  const unreadQuery = useQuery({
    queryKey: ["notifications", "unread", uid],
    queryFn: () => notificationsApi.unreadCount(),
    enabled: !!uid,
    refetchInterval: 20_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications", "list", uid] });
    queryClient.invalidateQueries({ queryKey: ["notifications", "unread", uid] });
  };

  const markRead = useMutation({ mutationFn: (id: number) => notificationsApi.markRead(id), onSuccess: invalidate });
  const markAllRead = useMutation({ mutationFn: () => notificationsApi.markAllRead(), onSuccess: invalidate });

  return {
    notifications: listQuery.data?.items ?? [],
    unread: unreadQuery.data?.unread ?? 0,
    isLoading: listQuery.isLoading,
    markRead,
    markAllRead,
  };
}