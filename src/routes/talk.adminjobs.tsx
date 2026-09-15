import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Truck,
  AlertTriangle,
  SlidersHorizontal,
  LayoutList,
  KanbanSquare,
  MoreVertical,
  Calendar,
  MapPin, 
  UserPlus,
  PackageSearch,
  X,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { adminApi, jobsApi, accountApi } from "@/lib/api";
import type { DashboardJob, ProfileResponse } from "@/lib/api-types";

export const Route = createFileRoute("/talk/adminjobs")({
  component: RouteComponent,
});

// ── Types ────────────────────────────────────────────────────────────────
// Mirrors what the backend is expected to return once it's wired up.

interface SummaryMetric {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  progress?: number;
  isAlert?: boolean;
  icon: React.ElementType;
}

interface ActiveJob {
  id: string;
  status: string;
  statusType: "transit" | "loading" | "assigned";
  client: string;
  timestamp: string;
  origin: string;
  originSub: string;
  dest: string;
  destSub: string;
  progressLabel: string;
  progressPercent: number;
  hasTruckIcon: boolean;
  lineStyle: "solid-active" | "dashed" | "dotted-dim";
  crewCount: number;
}

// ── Placeholder data (all zeroed / empty until backend is connected) ──────

const summaryMetrics: SummaryMetric[] = [
  {
    title: "JOBS TODAY",
    value: "0",
    change: "0%",
    isPositive: true,
    icon: Briefcase,
  },
  {
    title: "ACTIVE FLEET CAPACITY",
    value: "0%",
    subtext: "Utilized",
    progress: 0,
    icon: Truck,
  },
  {
    title: "CRITICAL DELAYS",
    value: "0",
    subtext: "Requires attention",
    isAlert: false,
    icon: AlertTriangle,
  },
];

const activeJobs: ActiveJob[] = [];

const driversDispatched = 0;
const driversAvailable = 0;

const JOB_STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-white/6 text-slate-400 border-white/4",
  in_progress: "bg-amber-500/10 text-[#E2A54A] border-[#E2A54A]/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  overdue: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  cancelled: "bg-white/4 text-slate-500 border-white/4",
};

function errMsg(err: unknown): string {
  return (
    (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
    (err as Error)?.message ||
    "Request failed. Please try again."
  );
}

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
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("All");
  const [assigning, setAssigning] = useState<DashboardJob | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: dash, isLoading: dashLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.dashboard(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => accountApi.listUsers(),
  });
  const crewMembers = users.filter((u) => u.role === "crew");

  const buckets = [
    { label: "Today", jobs: dash?.today_jobs ?? [] },
    { label: "Upcoming", jobs: dash?.upcoming_jobs ?? [] },
    { label: "Overdue", jobs: dash?.overdue_jobs ?? [] },
  ];

  const seen = new Set<number>();
  const flatJobs: (DashboardJob & { bucket: string })[] = [];
  for (const b of buckets) {
    for (const j of b.jobs) {
      if (seen.has(j.id)) continue;
      seen.add(j.id);
      flatJobs.push({ ...j, bucket: b.label });
    }
  }

  const statusOptions = ["All", ...Array.from(new Set(flatJobs.map((j) => j.status)))];
  const visible =
    statusFilter === "All" ? flatJobs : flatJobs.filter((j) => j.status === statusFilter);
  const inProgressCount = flatJobs.filter((j) => j.status === "in_progress").length;
  const completedCount = flatJobs.filter((j) => j.status === "completed").length;
  const overdueCount = flatJobs.filter((j) => j.status === "overdue").length;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "in_progress" | "completed" }) =>
      jobsApi.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setToast({ type: "success", message: "Job status updated." });
    },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const scheduleMutation = useMutation({
    mutationFn: ({
      id,
      scheduled_start,
      scheduled_end,
      crew_ids,
    }: {
      id: number;
      scheduled_start: string;
      scheduled_end: string;
      crew_ids: number[];
    }) => jobsApi.schedule(id, { scheduled_start, scheduled_end, crew_ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setAssigning(null);
      setToast({ type: "success", message: "Crew assigned and job scheduled." });
    },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const summaryMetrics = [
    { title: "ACTIVE JOBS", value: String(dash?.total_active ?? flatJobs.length), icon: Briefcase },
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
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border transition-all ${
            toast.type === "success"
              ? "bg-[#0c1017] border-emerald-500/30 text-emerald-400"
              : "bg-[#0c1017] border-rose-500/30 text-rose-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Active Assignments</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and monitor live logistics operations across all fleets.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-full text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            {dashLoading ? "Syncing..." : "System Operational"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {summaryMetrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col justify-between h-32 relative"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {card.title}
                </span>
                <div
                  className={`p-1.5 bg-white/2 rounded-lg border border-white/6 ${card.tone ?? "text-[#E2A54A]"}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3
                className={`text-3xl font-bold tracking-tight font-mono ${card.tone ?? "text-white"}`}
              >
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
              {s}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl py-16 px-5 flex flex-col items-center justify-center gap-2 text-center">
          <div className="p-2.5 bg-white/2 rounded-lg border border-white/6 text-slate-500 mb-1">
            <PackageSearch className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-slate-300">No assigned jobs found</p>
          <p className="text-xs text-slate-500 max-w-xs">
            Jobs will show up here once quotes are accepted and scheduled to a crew.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {buckets.map(
            (bucket) =>
              bucket.jobs.length > 0 && (
                <div key={bucket.label} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {bucket.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/4 text-slate-400 text-[9px] font-mono">
                      {bucket.jobs.length}
                    </span>
                  </div>

                  {bucket.jobs.map((job: DashboardJob & { bucket: string }) => {
                    const busy = updateStatusMutation.isPending;
                    return (
                      <div
                        key={job.id}
                        className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white/2 transition duration-150"
                      >
                        <div className="flex flex-col min-w-52.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#E2A54A]">
                              #{job.id}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider uppercase ${
                                JOB_STATUS_STYLES[job.status] ||
                                "bg-white/6 text-slate-400 border-white/4"
                              }`}
                            >
                              <span className="w-1 h-1 rounded-full mr-1 inline-block bg-current" />
                              {job.status.replace("_", " ")}
                            </span>
                            <span className="text-[9px] font-mono text-slate-600">
                              {job.bucket}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-2 tracking-tight">
                            {job.customer_name}
                          </h4>
                          {job.scheduled_start && (
                            <span className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-slate-600" />{" "}
                              {formatDate(job.scheduled_start)}
                            </span>
                          )}
                        </div>

                        {(job.address_from || job.address_to) && (
                          <div className="flex-1 flex items-center justify-center min-w-65 px-2 py-4 lg:py-0">
                            <div className="flex items-center gap-2 text-[11px] text-slate-300 w-full max-w-120">
                              <span className="text-slate-100 font-semibold truncate">
                                {job.address_from}
                              </span>
                              <span className="text-slate-600 shrink-0 mx-1">→</span>
                              <span className="text-slate-100 font-semibold truncate">
                                {job.address_to}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3 justify-end">
                          {job.status !== "completed" && job.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: job.id,
                                  status:
                                    job.status === "in_progress" ? "completed" : "in_progress",
                                })
                              }
                              disabled={busy}
                              className="px-3 py-1.5 bg-[#E2A54A]/10 border border-[#E2A54A]/20 text-[#E2A54A] text-[10px] font-bold rounded-md hover:bg-[#E2A54A]/20 transition duration-150 disabled:opacity-50"
                            >
                              {busy ? (
                                <Loader2 className="w-3 h-3 animate-spin inline-block" />
                              ) : job.status === "in_progress" ? (
                                "Mark Completed"
                              ) : (
                                "Start Job"
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => setAssigning(job)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/2 border border-white/6 text-slate-300 text-[10px] font-bold rounded-md hover:bg-white/5 transition duration-150"
                          >
                            <UserPlus className="w-3 h-3 text-[#E2A54A]" /> Assign Crew
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Crew Members Available:
          </span>
          <span className="text-[11px] font-mono text-slate-400 font-bold">
            {crewMembers.length}
          </span>
        </div>
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            Total Assignments Tracked:
          </span>
          <span className="text-[11px] font-mono text-slate-400 font-bold">{flatJobs.length}</span>
        </div>
      </div>

      {assigning && (
        <AssignJobModal
          job={assigning}
          crewMembers={crewMembers}
          onClose={() => setAssigning(null)}
          onSubmit={(payload) => scheduleMutation.mutate(payload)}
          isSubmitting={scheduleMutation.isPending}
        />
      )}
    </div>
  );
}

interface AssignJobModalProps {
  job: DashboardJob;
  crewMembers: ProfileResponse[];
  onClose: () => void;
  onSubmit: (payload: {
    id: number;
    scheduled_start: string;
    scheduled_end: string;
    crew_ids: number[];
  }) => void;
  isSubmitting: boolean;
}

function AssignJobModal({
  job,
  crewMembers,
  onClose,
  onSubmit,
  isSubmitting,
}: AssignJobModalProps) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [crew, setCrew] = useState<number[]>([]);

  const toggleCrew = (id: number) =>
    setCrew((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) return;
    if (crew.length === 0) return;
    onSubmit({
      id: job.id,
      scheduled_start: new Date(start).toISOString(),
      scheduled_end: new Date(end).toISOString(),
      crew_ids: crew,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-[#0c1017] border border-white/10 rounded-2xl p-6 text-slate-300">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-white tracking-tight">
            Assign Crew - Job #{job.id}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-5">{job.customer_name}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Scheduled Start
              </label>
              <input
                type="datetime-local"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Scheduled End
              </label>
              <input
                type="datetime-local"
                required
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Select Crew Members ({crew.length} selected)
            </label>
            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
              {crewMembers.length === 0 ? (
                <p className="text-xs text-slate-600 py-3 text-center">
                  No crew members found. Add users with the "crew" role first.
                </p>
              ) : (
                crewMembers.map((member) => (
                  <label
                    key={member.id}
                    className={`flex items-center justify-between gap-3 cursor-pointer px-3 py-2 rounded-lg border transition ${
                      crew.includes(member.id)
                        ? "bg-[#E2A54A]/10 border-[#E2A54A]/30"
                        : "bg-[#07090e] border-[#161b22] hover:border-[#252c3a]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-xs font-medium text-slate-200">
                      <span className="w-6 h-6 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-[9px] font-bold text-slate-400">
                        {member.full_name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                      {member.full_name}
                    </span>
                    <input
                      type="checkbox"
                      checked={crew.includes(member.id)}
                      onChange={() => toggleCrew(member.id)}
                      className="accent-[#E2A54A] h-4 w-4 rounded cursor-pointer"
                    />
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/6 text-xs font-semibold text-slate-400 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || crew.length === 0 || !start || !end}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E2A54A] text-slate-950 text-xs font-bold hover:bg-[#d4963b] transition disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />} Assign & Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
