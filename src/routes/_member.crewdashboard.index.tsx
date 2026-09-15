import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Truck, Clock, CheckCircle2, Calendar, ChevronRight, User } from "lucide-react";
import { jobsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_member/crewdashboard/")({
  component: CrewHome,
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

function CrewHome() {
  const { user } = useAuth();

  // Same scoping assumption as the assignments list: GET /jobs is trusted to
  // return only this crew member's own jobs for a crew-role token.
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["crew", "jobs"],
    queryFn: () => jobsApi.list(),
  });

  const inProgressCount = jobs.filter((j) => j.status === "in_progress").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  const metrics = [
    { title: "TOTAL ASSIGNMENTS", value: String(jobs.length), icon: Truck },
    { title: "IN PROGRESS", value: String(inProgressCount), icon: Clock, tone: "text-[#E2A54A]" },
    { title: "COMPLETED", value: String(completedCount), icon: CheckCircle2, tone: "text-emerald-400" },
  ];

  // Up next: soonest-scheduled jobs that aren't finished/cancelled yet.
  const upNext = jobs
    .filter((j) => j.status !== "completed" && j.status !== "cancelled" && j.scheduled_start)
    .sort((a, b) => new Date(a.scheduled_start!).getTime() - new Date(b.scheduled_start!).getTime())
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl w-full text-slate-200 pb-12">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Here's what's on your plate today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-full text-xs font-medium text-emerald-400 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {isLoading ? "Syncing..." : "Up to date"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col justify-between h-32">
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{m.title}</span>
                <div className={`p-1.5 bg-white/2 rounded-lg border border-white/6 ${m.tone ?? "text-[#E2A54A]"}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className={`text-3xl font-bold tracking-tight font-mono ${m.tone ?? "text-white"}`}>{m.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl overflow-hidden flex flex-col mb-6">
        <div className="flex items-center justify-between p-5 border-b border-white/6">
          <h2 className="text-sm font-bold text-white tracking-tight">Up Next</h2>
          <Link to="/crewdashboard/job" className="text-[10px] font-bold uppercase tracking-wider text-[#E2A54A] hover:opacity-80 flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500 py-10 text-center">Loading assignments...</p>
        ) : upNext.length === 0 ? (
          <div className="py-10 px-5 text-center">
            <p className="text-sm font-medium text-slate-300">Nothing scheduled right now</p>
            <p className="text-xs text-slate-500 mt-1">New assignments will show up here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/4">
            {upNext.map((job) => (
              <Link
                key={job.id}
                to="/crewdashboard/$jobId"
                params={{ jobId: String(job.id) }}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/2 transition"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/crewdashboard/job"
          className="flex items-center gap-3 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 hover:bg-white/2 transition"
        >
          <div className="p-2 bg-white/2 rounded-lg border border-white/6 text-[#E2A54A]"><Truck className="w-4 h-4" /></div>
          <div>
            <p className="text-xs font-bold text-white">My Assignments</p>
            <p className="text-[11px] text-slate-500">See all jobs assigned to you</p>
          </div>
        </Link>
        <Link
          to="/crewdashboard/profile"
          className="flex items-center gap-3 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 hover:bg-white/2 transition"
        >
          <div className="p-2 bg-white/2 rounded-lg border border-white/6 text-[#E2A54A]"><User className="w-4 h-4" /></div>
          <div>
            <p className="text-xs font-bold text-white">Profile Settings</p>
            <p className="text-[11px] text-slate-500">Update your details and password</p>
          </div>
        </Link>
      </div>
    </div>
  );
}