// src/routes/_auth.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminDashboardSidebar } from "@/components/admin/AdminDashboardSidebar";
import { AdminDashboardTopbar } from "@/components/admin/AdminDashboardTopbar";
import { useState } from "react";
import { NotificationsSheet } from "@/components/shared/NotificationsSheet";
import { NotificationToastWatcher } from "@/components/shared/NotificationsToastWatcher";
import { NotificationsStack } from "@/components/shared/NotificationsStack";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [notifSheetOpen, setNotifSheetOpen] = useState(false);


  return (
    <AdminAuthGuard>
      {/* OUTER SHELL: locks viewport perfectly, handles all device screens safely */}
      <div className="flex h-screen w-full overflow-hidden bg-[#0B0F17]">

        <AdminDashboardSidebar />
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

          {/* TOPBAR: Re-aligned with proper safe toggling bindings */}
          <AdminDashboardTopbar
            onMenuToggle={() => window.dispatchEvent(new Event("toggle-admin-sidebar"))}
            onNotificationsClick={() => setNotifSheetOpen(true)}
          />

          {/* CONTENT AREA: Bounded viewport window box */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

        </div>
      </div>
      <NotificationsSheet open={notifSheetOpen} onClose={() => setNotifSheetOpen(false)} role="admin" />
      <NotificationToastWatcher role="admin" />
      <NotificationsStack role="admin" onOpenSheet={() => setNotifSheetOpen(true)} />
    
    </AdminAuthGuard>
  );
}