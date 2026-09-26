import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { NotificationsSheet } from "@/components/shared/NotificationsSheet";
import { NotificationToastWatcher } from "@/components/shared/NotificationsToastWatcher";
import { NotificationsStack } from "@/components/shared/NotificationsStack";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard - Supersonic Dynamic Services" },
      { name: "description", content: "Manage your moves, quotes, and invoices." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  // Shared state to control the mobile slide-out menu drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifSheetOpen, setNotifSheetOpen] = useState(false);

  return (
     <div className="flex h-screen w-full overflow-hidden bg-[#0B0F17]">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <DashboardTopbar
          onMenuOpen={() => setSidebarOpen(true)}
          onNotificationsClick={() => setNotifSheetOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <NotificationsSheet open={notifSheetOpen} onClose={() => setNotifSheetOpen(false)} role="customer" />
      <NotificationToastWatcher role="customer" />
      <NotificationsStack role="customer" onOpenSheet={() => setNotifSheetOpen(true)} />
    </div>
  );
}