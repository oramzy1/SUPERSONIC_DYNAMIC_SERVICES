import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardSidebar, DashboardTopbar } from "@/components/dashboard/DashboardSidebar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Supersonic Dynamic Services" },
      { name: "description", content: "Manage your moves, quotes, and invoices." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
