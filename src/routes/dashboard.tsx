import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardSidebar, DashboardTopbar } from "@/components/dashboard/DashboardSidebar";

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

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Fixed Desktop Sidebar & Mobile Drawer */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden md:pl-64">
        {/* Fixed Topbar */}
        <DashboardTopbar onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 px-6 pb-8 pt-18 md:px-10 md:pb-10 md:pt-25 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}