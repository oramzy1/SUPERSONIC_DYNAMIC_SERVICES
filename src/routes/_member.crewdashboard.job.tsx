import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck, Clock, CheckCircle2, Calendar, ChevronRight, PackageSearch } from "lucide-react";
import { jobsApi } from "@/lib/api";
import type { JobResponse } from "@/lib/api-types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_member/crewdashboard/job")({
  component: CrewDashboard,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "Not scheduled yet";
  return new Date(iso).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CrewDashboard() {
  const [statusFilter, setStatusFilter] = useState("All");

  // See caveat above: assumes the backend scopes GET /jobs to the logged-in
  // crew member's own assignments - there's no explicit filter param for it.
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["crew", "jobs"],
    queryFn: () => jobsApi.list(),
  });

  const statusOptions = ["All", ...Array.from(new Set(jobs.map((j) => j.status)))];
  const visible = statusFilter === "All" ? jobs : jobs.filter((j) => j.status === statusFilter);
  const inProgressCount = jobs.filter((j) => j.status === "in_progress").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  const metrics = [
    { title: "MY ASSIGNMENTS", value: String(jobs.length), icon: Truck },
    { title: "IN PROGRESS", value: String(inProgressCount), icon: Clock },
    { title: "COMPLETED", value: String(completedCount), icon: CheckCircle2 },
  ];

  return (
    <div className="mx-auto max-w-5xl w-full text-slate-200 pb-12">
      <Breadcrumbs items={[{ label: "My Assignments" }]} />

      <h1 className="text-2xl font-bold tracking-tight text-white">My Assignments</h1>
      <p className="text-sm text-slate-400 mt-1 mb-6">
        Jobs assigned to you. Tap one to update status or send in photo evidence.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-4 flex flex-col justify-between h-24"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  {m.title}
                </span>
                <Icon className="w-3.5 h-3.5 text-[#E2A54A]" />
              </div>
              <span className="text-2xl font-bold font-mono text-white">{m.value}</span>
            </div>
          );
        })}
      </div>

      {statusOptions.length > 1 && (
        <div className="flex items-center gap-1.5 bg-[#0d111a]/40 border border-white/6 p-1 rounded-lg text-xs font-medium text-slate-400 overflow-x-auto w-fit mb-4">
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

      {isLoading ? (
        <p className="text-sm text-slate-500 py-10 text-center">Loading assignments...</p>
      ) : visible.length === 0 ? (
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl py-16 flex flex-col items-center gap-2 text-center">
          <PackageSearch className="w-5 h-5 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No assignments yet</p>
          <p className="text-xs text-slate-500 max-w-xs">
            Jobs will appear here once you're assigned to one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((job: JobResponse) => (
            <Link
              key={job.id}
              to="/crewdashboard/$jobId"
              params={{ jobId: String(job.id) }}
              className="flex items-center justify-between bg-[#0d111a]/40 border border-white/6 rounded-xl p-5 hover:bg-white/2 hover:border-white/12 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#E2A54A]">#{job.id}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider uppercase bg-white/6 text-slate-400 border-white/4">
                    {job.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> {formatDate(job.scheduled_start)}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
