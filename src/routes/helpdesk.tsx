// src/routes/helpdesk.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { showErrorText, showInfo } from "@/lib/toast";

export const Route = createFileRoute("/helpdesk")({
  component: HelpdeskGate,
});

// null = not allowed to raise tickets
function supportPathForRole(role?: string): string | null {
  if (role === "crew") return null;
  if (role && ["admin", "dispatcher", "finance"].includes(role)) return "/admin support";
  return "/dashboard/support";
}

function HelpdeskGate() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false); // StrictMode runs effects twice; this stops duplicate toasts

  useEffect(() => {
    if (isLoading || handled.current) return;
    handled.current = true;

    if (!isAuthenticated) {
      showInfo("Please sign in to submit a support ticket.");
      navigate({ to: "/login" as any, search: { redirect: "/helpdesk" } as any, replace: true });
      return;
    }

    const target = supportPathForRole(user?.role);
    if (!target) {
      showErrorText("You don't have enough permissions to submit a support ticket.");
      navigate({ to: "/crewdashboard" as any, replace: true });
      return;
    }
    navigate({ to: target as any, replace: true });
  }, [isLoading, isAuthenticated, user, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Taking you to support...
    </div>
  );
}
