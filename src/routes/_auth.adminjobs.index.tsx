import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Users,
  PackageSearch,
  ChevronRight,
} from "lucide-react";
import { adminApi, jobsApi, accountApi } from "@/lib/api";
import type { JobResponse, DashboardJob, ProfileResponse } from "@/lib/api-types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_auth/adminjobs/")({
  component: RouteComponent,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function RouteComponent() {
  const [statusFilter, setStatusFilter] = useState("All");

  // Full, real job list - no more relying on dashboard buckets for the primary list.
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: () => jobsApi.list(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => accountApi.listUsers(),
  });

  // Dashboard buckets are the ONLY place customer_name/address currently exist.
  // We merge them in by job id, purely as an enrichment - jobs outside
  // today/upcoming/overdue just won't have this info until the backend adds
  // it directly to JobResponse.
  const { data: dash } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.dashboard(),
  });

  const dashboardById = new Map<number, DashboardJob>();
  for (const bucket of [dash?.today_jobs, dash?.upcoming_jobs, dash?.overdue_jobs]) {
    for (const j of bucket ?? []) dashboardById.set(j.id, j);
  }

  const usersById = new Map<number, ProfileResponse>(users.map((u) => [u.id, u]));

  const statusOptions = ["All", ...Array.from(new Set(jobs.map((j) => j.status)))];
  const visible = statusFilter === "All" ? jobs : jobs.filter((j) => j.status === statusFilter);

  // Metrics always come from the FULL unfiltered list, not `visible` -
  // otherwise switching tabs makes the cards look "broken" the same way
  // the quotes dashboard did.
  const inProgressCount = jobs.filter((j) => j.status === "in_progress").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;
  const overdueCount = jobs.filter((j) => j.status === "overdue").length;
  const crewCount = users.filter((u) => u.role === "crew").length;

  const summaryMetrics = [
    { title: "TOTAL JOBS", value: String(jobs.length), icon: Briefcase, tone: "text-[#E2A54A]" },
    { title: "IN PROGRESS", value: String(inProgressCount), icon: Truck, tone: "text-[#E2A54A]" },
    {
      title: "COMPLETED",
      value: String(completedCount),
      icon: CheckCircle2,
      tone: "text-emerald-400",
    },
    { title: "OVERDUE", value: String(overdueCount), icon: Clock, tone: "text-rose-400" },
  ];

  return (
    <div className="w-full text-slate-200 select-none pb-12">
      <Breadcrumbs items={[{ label: "Jobs" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Active Assignments</h1>
          <p className="text-sm text-slate-400 mt-1">
            All jobs created from accepted quotes. Click a row to view, assign, or reassign crew.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-full text-xs font-medium text-emerald-400 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {jobsLoading ? "Syncing..." : "System Operational"}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {summaryMetrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col justify-between h-32"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {card.title}
                </span>
                <div className={`p-1.5 bg-white/2 rounded-lg border border-white/6 ${card.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className={`text-3xl font-bold tracking-tight font-mono ${card.tone}`}>
                {card.value}
              </h3>
            </div>
          );
        })}
      </div>

      {statusOptions.length > 1 && (
        <div className="flex items-center gap-1.5 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 p-1 rounded-lg text-xs font-medium text-slate-400 overflow-x-auto w-fit mb-4">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors uppercase ${
                statusFilter === s
                  ? "bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/10 font-semibold"
                  : "hover:text-slate-200"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      {jobsLoading ? (
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl py-16 px-5 text-center text-sm text-slate-500">
          Loading jobs...
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl py-16 px-5 flex flex-col items-center justify-center gap-2 text-center">
          <div className="p-2.5 bg-white/2 rounded-lg border border-white/6 text-slate-500 mb-1">
            <PackageSearch className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-slate-300">No jobs found</p>
          <p className="text-xs text-slate-500 max-w-xs">
            Jobs appear here once a customer accepts a quote.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((job: JobResponse) => {
            const dashInfo = dashboardById.get(job.id);
            const crewNames = (job.crew_ids ?? [])
              .map((id) => usersById.get(id)?.full_name)
              .filter(Boolean) as string[];

            return (
              <Link
                key={job.id}
                to="/adminjobs/$jobId"
                params={{ jobId: String(job.id) }}
                className="block bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 hover:bg-white/2 hover:border-white/12 transition duration-150"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex flex-col min-w-52.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#E2A54A]">#{job.id}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider uppercase bg-white/6 text-slate-400 border-white/4">
                        {job.status.replace("_", " ")}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2 tracking-tight">
                      {dashInfo?.customer_name || "Customer info unavailable"}
                    </h4>
                    {job.scheduled_start && (
                      <span className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-600" />{" "}
                        {formatDate(job.scheduled_start)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex items-center justify-center min-w-65 px-2 py-4 lg:py-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-300 w-full max-w-120">
                      <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                      <span className="text-slate-100 font-semibold truncate">
                        {dashInfo?.address_from || "-"}
                      </span>
                      <span className="text-slate-600 shrink-0 mx-1">→</span>
                      <span className="text-slate-100 font-semibold truncate">
                        {dashInfo?.address_to || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-600" />
                      {crewNames.length > 0 ? crewNames.join(", ") : "Unassigned"}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-500" /> Crew Members Available:
          </span>
          <span className="text-[11px] font-mono text-slate-400 font-bold">{crewCount}</span>
        </div>
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> Total Assignments Tracked:
          </span>
          <span className="text-[11px] font-mono text-slate-400 font-bold">{jobs.length}</span>
        </div>
      </div>
    </div>
  );
}
