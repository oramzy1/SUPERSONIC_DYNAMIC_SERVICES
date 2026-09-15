import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarCheck, CalendarClock, CreditCard, Download, Leaf, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { accountApi, quotesApi, invoicesApi, jobsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-primary/20 text-primary border-primary/40",
    in_progress: "bg-[#3B82F6]/15 text-[#9DB4FE] border-[#3B82F6]/40",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/40",
  };
  const cls = map[status] || "bg-white/10 text-foreground border-white/10";
  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function DashboardHome() {
  const { user } = useAuth();

  const { data: quoteRequests = [] } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => quotesApi.list(),
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsApi.list(),
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => quotesApi.list(),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => invoicesApi.list(),
  });

  const pendingRequests = quoteRequests.filter((q) => q.status === "pending");
  const readyForReview = quoteRequests.filter((q) => q.status === "reviewed");
  const activeJobs = jobs.filter((j) => j.status !== "completed");
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const pendingInvoices = invoices.filter((i) => i.status === "pending");

  const STATS = [
    {
      icon: CalendarClock,
      label: "Awaiting Review",
      value: String(pendingRequests.length),
      note: "Quote requests",
    },
    {
      icon: CalendarCheck,
      label: "Ready to Respond",
      value: String(readyForReview.length),
      note: "Quotes sent to you",
    },
    { icon: Truck, label: "Active Jobs", value: String(activeJobs.length), note: "" },
    {
      icon: CreditCard,
      label: "Outstanding",
      value: `€${pendingInvoices.reduce((s, i) => s + parseFloat(i.total_amount), 0).toFixed(2)}`,
      note: `${pendingInvoices.length} pending`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        Status Report
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">
        Welcome back, {user?.full_name?.split(" ")[0] || "there"}
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl bg-surface p-5"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                  <Icon className="h-4 w-4 text-foreground/80" />
                </div>
                {s.note && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {s.note}
                  </p>
                )}
              </div>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-surface p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent Quotes</h2>
          <a
            href="/dashboard/quotes"
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6FE5FF] hover:opacity-80"
          >
            View All
          </a>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-170">
            <thead>
              <tr className="...">
                <th className="pb-4">Move Type</th>
                <th className="pb-4">Submitted</th>
                <th className="pb-4">Status</th>
                <th className="pb-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quoteRequests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    No quote requests yet.{" "}
                    <a href="/quoterequest" className="text-[#6FE5FF] hover:underline">
                      Request one now
                    </a>
                  </td>
                </tr>
              ) : (
                quoteRequests.slice(0, 5).map((q) => (
                  <tr key={q.id} className="text-sm">
                    <td className="py-5 font-medium capitalize">{q.move_type.replace("-", " ")}</td>
                    <td className="py-5 text-muted-foreground">
                      {new Date(q.created_at).toLocaleDateString("nl-NL")}
                    </td>
                    <td className="py-5">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="py-5 text-right">
                      {q.status === "reviewed" && (
                        <a
                          href="/dashboard/quotes"
                          className="text-[#6FE5FF] hover:underline text-xs font-semibold"
                        >
                          Review Quote
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
