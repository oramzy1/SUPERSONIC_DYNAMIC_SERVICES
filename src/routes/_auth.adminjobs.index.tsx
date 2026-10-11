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
  Search,
} from "lucide-react";
import { adminApi, jobsApi, accountApi } from "@/lib/api";
import type { JobResponse, DashboardJob, ProfileResponse } from "@/lib/api-types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import {
  AvatarStack,
  DocStatusBadge,
  JobStatusBadge,
  formatDay,
  resolveCrew,
} from "@/components/shared/JobParts";

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

function RouteComponent() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

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
  const q = query.trim().toLowerCase();
  const byStatus = statusFilter === "All" ? jobs : jobs.filter((j) => j.status === statusFilter);
  const visible = q
    ? byStatus.filter((j) =>
        [
          String(j.id),
          j.customer_contact?.full_name,
          j.customer_contact?.company,
          j.quote_number,
          j.move_from,
          j.move_to,
        ].some((v) => v?.toLowerCase().includes(q)),
      )
    : byStatus;
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paginated = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
    <div className="w-full text-foreground/80 select-none pb-12">
      <Breadcrumbs items={[{ label: "Jobs" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground/70">
            Active Assignments
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            All jobs created from accepted quotes. Click a row to view, assign, or reassign crew.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface backdrop-blur-md border border-white/6 rounded-full text-xs font-medium text-emerald-400 self-start sm:self-auto">
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
              className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-5 flex flex-col justify-between h-32"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-foreground/60 uppercase">
                  {card.title}
                </span>
                <div className={`p-1.5 bg-white/2 rounded-xs border border-white/6 ${card.tone}`}>
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {statusOptions.length > 1 && (
          <div className="flex items-center gap-1.5 bg-surface backdrop-blur-md border border-white/6 p-1 rounded-xs text-xs font-medium text-foreground/70 overflow-x-auto w-fit">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-xs whitespace-nowrap transition-colors uppercase ${
                  statusFilter === s
                    ? "bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/10 font-semibold"
                    : "hover:text-foreground"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-xs border border-white/6 bg-surface px-3 py-1.5 sm:ml-auto sm:w-64">
          <Search className="h-3.5 w-3.5 shrink-0 text-foreground/60" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search customer, quote, route..."
            className="w-full bg-transparent text-xs text-foreground/70 outline-none placeholder:text-foreground/50"
          />
        </div>
      </div>

      {jobsLoading ? (
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xs py-16 px-5 text-center text-sm text-foreground/60">
          Loading jobs...
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xs py-16 px-5 flex flex-col items-center justify-center gap-2 text-center">
          <div className="p-2.5 bg-white/2 rounded-xs border border-white/6 text-foreground/60 mb-1">
            <PackageSearch className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-foreground/70">No jobs found</p>
          <p className="text-xs text-foreground/60 max-w-xs">
            Jobs appear here once a customer accepts a quote.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginated.map((job: JobResponse) => {
            const crew = resolveCrew(job, usersById);
            const customer = job.customer_contact;
            return (
              <Link
                key={job.id}
                to="/adminjobs/$jobId"
                params={{ jobId: String(job.id) }}
                className="block rounded-xs border border-white/6 bg-surface p-5 transition duration-150 hover:border-white/12 hover:bg-white/2"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="min-w-0 lg:w-64">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#E2A54A]">#{job.id}</span>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <h4 className="mt-2 truncate text-sm font-bold text-foreground/80">
                      {customer?.full_name || "Customer info unavailable"}
                    </h4>
                    <p className="truncate text-xs text-foreground/50">
                      {[customer?.company, job.quote_number && `Quote ${job.quote_number}`]
                        .filter(Boolean)
                        .join(" · ") || "-"}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate font-semibold">{job.move_from || "-"}</span>
                      <span className="shrink-0">→</span>
                      <span className="truncate font-semibold">{job.move_to || "-"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-foreground/50">
                      {job.move_date && (
                        <span className="flex items-center gap-1.5">
                          <Truck className="h-3 w-3" /> Move: {formatDay(job.move_date)}
                        </span>
                      )}
                      {job.delivery_date && (
                        <span className="flex items-center gap-1.5">
                          <Truck className="h-3 w-3" /> Delivery: {formatDay(job.delivery_date)}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {job.scheduled_start
                          ? `Scheduled: ${formatDate(job.scheduled_start)} - ${formatDate(job.scheduled_end)}`
                          : "Not scheduled"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 lg:justify-end">
                    <div className="flex flex-col items-end gap-1">
                      {job.contract_id ? (
                        <DocStatusBadge label="Contract" status={job.contract_status} />
                      ) : (
                        <span className="text-[10px] font-semibold uppercase text-rose-400">
                          No contract
                        </span>
                      )}
                      {job.invoice_id ? (
                        <DocStatusBadge label="Invoice" status={job.invoice_status} />
                      ) : null}
                    </div>
                    {crew.length > 0 ? (
                      <AvatarStack people={crew} />
                    ) : (
                      <span className="text-xs text-foreground/50">Unassigned</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-foreground/60" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-4 flex items-center justify-between text-xs text-foreground/60 font-medium">
          <span className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-foreground/60" /> Crew Members Available:
          </span>
          <span className="text-[11px] font-mono text-foreground/60 font-bold">{crewCount}</span>
        </div>
        <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-4 flex items-center justify-between text-xs text-foreground/60 font-medium">
          <span className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-foreground/60" /> Total Assignments Tracked:
          </span>
          <span className="text-[11px] font-mono text-foreground/60 font-bold">{jobs.length}</span>
        </div>
      </div>
    </div>
  );
}
