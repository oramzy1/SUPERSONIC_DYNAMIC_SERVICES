import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

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
    <div className="flex h-screen w-full overflow-hidden bg-[#0B0F17]">
      {/* Fixed Desktop Sidebar & Mobile Drawer */}
      <DashboardSidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Fixed Topbar */}
        <DashboardTopbar onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div> 
    </div>
  );
}