import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import {
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  MoreVertical,
  Inbox,
  Radar,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminApi, jobsApi, quotesApi, accountApi, invoicesApi } from "@/lib/api";
import type { QuoteRequestResponse } from "@/lib/api-types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function initials(name?: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export const Route = createFileRoute("/_auth/admindashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard - Supersonic Dynamic Services" },
      { name: "description", content: "Administrative controls and live operational systems monitoring console." },
    ],
  }),
  component: RouteComponent,
});

interface MetricItem {
  title: string;
  value: string;
  icon: React.ElementType;
}

interface TrackingRow {
  id: string;
  client: string;
  origin: string;
  dest: string;
  crew: string;
  crewInitials: string;
  status: "In Progress" | "Completed" | "Scheduled" | "Delayed";
  eta: string;
}

function mapJobStatus(status: string): "In Progress" | "Completed" | "Scheduled" | "Delayed" {
  if (status === "completed") return "Completed";
  if (status === "overdue") return "Delayed";
  if (status === "in_progress") return "In Progress";
  return "Scheduled";
}

function RouteComponent() {
  const { data: dash } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.dashboard(),
    refetchInterval: 30_000,
  });

  // Full job list — needed because DashboardJob (today/upcoming/overdue
  // buckets) has no crew_ids field, and because those buckets don't
  // reliably include completed jobs for an accurate "Completed" metric.
  const { data: allJobsFull = [] } = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: () => jobsApi.list(),
    refetchInterval: 30_000,
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["admin", "quotes", "all"],
    queryFn: () => quotesApi.listRequests(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => accountApi.listUsers(),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["admin", "invoices"],
    queryFn: () => invoicesApi.list(),
  });

  const usersById = new Map(users.map((u) => [u.id, u]));
const jobsById = new Map(allJobsFull.map((j) => [j.id, j]));

const bucketJobs = [...(dash?.today_jobs ?? []), ...(dash?.upcoming_jobs ?? []), ...(dash?.overdue_jobs ?? [])];

const liveTrackingData: TrackingRow[] = bucketJobs.slice(0, 8).map((j) => {
  const fullJob = jobsById.get(j.id);
  const crewNames = (fullJob?.crew_members ?? []).map((c) => c.full_name);

  return {
    id: `JOB-${j.id}`,
    client: j.customer_name,
    origin: j.address_from ?? fullJob?.move_from ?? "-",
    dest: j.address_to ?? fullJob?.move_to ?? "-",
    crew: crewNames.length > 0 ? crewNames.join(", ") : "Unassigned",
    crewInitials: crewNames.length > 0 ? initials(crewNames[0]) : "?",
    status: mapJobStatus(j.status),
    eta: j.scheduled_start ? formatDate(j.scheduled_start) : "-",
  };
});

  const customerCount = users.filter((u) => u.role === "customer").length;

  const metrics: MetricItem[] = [
    { title: "Total Quotes", value: String(quotes.length), icon: FileText },
    { title: "Active Jobs", value: String(dash?.total_active ?? 0), icon: Truck },
    { title: "Completed", value: String(allJobsFull.filter((j) => j.status === "completed").length), icon: CheckCircle2 },
    { title: "In Progress", value: String(allJobsFull.filter((j) => j.status === "in_progress").length), icon: Clock },
    { title: "Overdue", value: String(dash?.overdue_jobs.length ?? 0), icon: AlertTriangle },
    { title: "Customers", value: String(customerCount), icon: Users },
  ];

  // Most recent quote REQUESTS (not priced quotes — GET /quotes returns
  // priced-quote-only data with no move_type/status; QuoteRequestResponse
  // from listRequests() is what actually has these fields).
  const recentQuotes: QuoteRequestResponse[] = [...quotes]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  // Revenue: sum of invoices marked paid, created in the last 30 days.
  // Heuristic — the API doesn't document a status enum, so "paid"
  // (case-insensitive) is treated as revenue.
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentPaid = invoices.filter(
    (i) => i.status.toLowerCase() === "sent" && new Date(i.created_at).getTime() >= thirtyDaysAgo,
  );
  const totalVolume = recentPaid.reduce((s, i) => s + parseFloat(i.total_amount || "0"), 0);

  const quoteStatusStyle: Record<string, string> = {
    pending: "text-[#E2A54A]",
    quoted: "text-blue-400",
    accepted: "text-emerald-400",
    counter_offered: "text-violet-400",
    rejected: "text-rose-400",
  };

  const dailyRevenue = (() => {
  const days = 14;
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    d.setHours(0, 0, 0, 0);
    return { date: d, total: 0 };
  });
  invoices.forEach((inv) => {
    if (inv.status.toLowerCase() !== "sent") return;
    const created = new Date(inv.created_at);
    created.setHours(0, 0, 0, 0);
    const bucket = buckets.find((b) => b.date.getTime() === created.getTime());
    if (bucket) bucket.total += parseFloat(inv.total_amount || "0");
  });
  return buckets;
})();

const maxDaily = Math.max(1, ...dailyRevenue.map((b) => b.total));

  return (
    <div className="w-full text-slate-200 select-none pb-12">
      {/* HEADER CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Overview</h1>
          <p className="text-sm text-slate-400 mt-1">System status and live operational metrics.</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-full text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            System Operational
          </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex flex-col justify-between group hover:border-white/15 transition duration-200"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2 bg-white/2 rounded-lg border border-white/6 text-[#E2A54A]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-slate-400 tracking-wide">{item.title}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">{item.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIVE OPERATIONS TRACKING */}
      <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
          <h2 className="text-base font-semibold text-white tracking-tight">
            Live Operations Tracking
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-200 text-left border-collapse">
            <thead>
              <tr className="border-b border-white/4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                <th className="py-4 px-6">Move ID / Client</th>
                <th className="py-4 px-6">
                  Route Origin <span className="inline-block mx-1 text-slate-600">→</span> Dest
                </th>
                <th className="py-4 px-6">Crew Assigned</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2">
              {liveTrackingData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="p-2.5 bg-white/2 rounded-lg border border-white/6 text-slate-500 mb-1">
                        <Radar className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">No moves in progress yet</p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Active shipments will show up here as soon as a job is on the way.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                liveTrackingData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/2 transition duration-150">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-slate-200 text-sm">{row.id}</span>
                        <span className="text-xs text-slate-500 mt-0.5 font-medium">{row.client}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                        <span>{row.origin}</span>
                        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                        <span>{row.dest}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {row.crewInitials}
                        </div>
                        <span className="text-xs font-medium text-slate-300">{row.crew}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                          row.status === "In Progress"
                            ? "bg-[#E2A54A]/5 border-[#E2A54A]/20 text-[#E2A54A]"
                            : row.status === "Delayed"
                              ? "bg-rose-500/5 border-rose-500/20 text-rose-400"
                              : "bg-white/4 border-white/8 text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            row.status === "In Progress"
                              ? "bg-[#E2A54A]"
                              : row.status === "Delayed"
                                ? "bg-rose-400"
                                : "bg-slate-400"
                          }`}
                        />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`text-xs font-mono font-medium ${row.status === "Delayed" ? "text-rose-400 font-sans font-semibold" : "text-slate-300"}`}
                      >
                        {row.eta}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPLIT SUB-PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-white tracking-tight">Recent Quote Requests</h2>
            <button className="text-slate-500 hover:text-slate-300">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {recentQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center py-8">
              <div className="p-2.5 bg-white/2 rounded-lg border border-white/6 text-slate-500 mb-1">
                <Inbox className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-300">No quotes yet</p>
              <p className="text-xs text-slate-500 max-w-xs">
                New quote requests will appear here as customers submit them.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/2 overflow-x-auto">
              <div className="min-w-100 md:min-w-0">
                {recentQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 text-xs gap-3"
                  >
                    <span className="font-mono font-bold text-slate-400 shrink-0">#{quote.id}</span>
                    <div className="flex-1 text-slate-300 font-medium truncate">
                      {quote.company || quote.contact_name || "Unnamed"}
                    </div>
                    <div className="text-slate-500 font-medium capitalize shrink-0">
                      {quote.move_type.replace("-", " ")}
                    </div>
                    <div className={`font-bold text-right shrink-0 uppercase text-[10px] ${quoteStatusStyle[quote.status] ?? "text-slate-400"}`}>
                      {quote.status.replace("_", " ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Revenue Analytics */}
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white tracking-tight">Revenue Analytics</h2>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-500 tracking-wide">
              Paid Invoices (Last 14 Days)
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <h3 className="text-3xl font-bold text-white tracking-tight">€{totalVolume.toFixed(2)}</h3>
              <span className="text-[10px] font-bold text-slate-500 bg-white/4 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> {recentPaid.length} invoice{recentPaid.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

        <div className="h-28 w-full mt-6 flex items-end gap-1">
  {dailyRevenue.map((b, idx) => (
    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
      <div
        className="w-full bg-[#E2A54A]/70 group-hover:bg-[#E2A54A] rounded-sm transition-all"
        style={{ height: `${Math.max(2, (b.total / maxDaily) * 100)}%` }}
        title={`${b.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}: €${b.total.toFixed(2)}`}
      />
    </div>
  ))}
</div>
{recentPaid.length === 0 && (
  <p className="text-[11px] font-medium text-slate-600 text-center mt-2">No paid invoices in this window yet</p>
)}
        </div>
      </div>
    </div>
  );
}