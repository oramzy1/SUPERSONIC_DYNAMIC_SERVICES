// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";
// import { ChevronRight, Calendar } from "lucide-react";
// import { jobsApi } from "@/lib/api";
// import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

// export const Route = createFileRoute("/dashboard/jobs/")({
//   component: JobsPage,
// });

// function JobsPage() {
//   const { data: jobs = [], isLoading } = useQuery({
//     queryKey: ["jobs"],
//     queryFn: () => jobsApi.list(),
//   });

//   return (
//     <div className="mx-auto max-w-6xl">
//       <Breadcrumbs items={[{ label: "Jobs" }]} />
//       <h1 className="font-display text-3xl font-bold md:text-5xl">Your Jobs</h1>
//       <p className="mt-3 text-sm text-muted-foreground">
//         Track scheduling and status updates for accepted jobs.
//       </p>
 
//       <div className="mt-8 space-y-3">
//         {isLoading ? (
//           <p className="text-sm text-muted-foreground">Loading jobs...</p>
//         ) : jobs.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No jobs yet - jobs appear here once you accept a quote.
//           </p>
//         ) : (
//           jobs.map((job) => (
//             <Link
//               key={job.id}
//               to="/dashboard/jobs/$jobId"
//               params={{ jobId: String(job.id) }}
//               className="flex items-center justify-between rounded-2xl bg-surface p-5 hover:bg-white/5 transition"
//             >
//               <div>
//                 <p className="font-semibold">Job #{job.id}</p>
//                 {job.scheduled_start ? (
//                   <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
//                     <Calendar className="w-3 h-3" /> {new Date(job.scheduled_start).toLocaleString("nl-NL")}
//                   </p>
//                 ) : (
//                   <p className="text-xs text-muted-foreground mt-1">Not scheduled yet</p>
//                 )}
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase">
//                   {job.status}
//                 </span>
//                 <ChevronRight className="w-4 h-4 text-muted-foreground" />
//               </div>
//             </Link>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck, CheckCircle2, Clock, Calendar, MapPin, ChevronRight, PackageSearch } from "lucide-react";
import { jobsApi } from "@/lib/api";
import type { JobResponse } from "@/lib/api-types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/jobs/")({
  component: JobsPage,
});

const PAGE_SIZE = 15;

function formatDate(iso?: string | null): string {
  if (!iso) return "Not scheduled yet";
  return new Date(iso).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function JobsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsApi.list(),
  });

  const statusOptions = ["All", ...Array.from(new Set(jobs.map((j) => j.status)))];
  const visible = statusFilter === "All" ? jobs : jobs.filter((j) => j.status === statusFilter);

  const inProgressCount = jobs.filter((j) => j.status === "in_progress").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  const metrics = [
    { title: "Total Jobs", value: String(jobs.length), icon: Truck },
    { title: "In Progress", value: String(inProgressCount), icon: Clock },
    { title: "Completed", value: String(completedCount), icon: CheckCircle2 },
  ];

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paginated = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: "Jobs" }]} />

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Your Jobs</h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Track scheduling and status updates for accepted jobs.
          </p>
        </div>
        {statusOptions.length > 1 && (
          <div className="inline-flex flex-wrap rounded-full bg-surface p-1">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition capitalize",
                  statusFilter === s
                    ? "bg-white text-[#0E141A]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s === "All" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="rounded-2xl bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {m.title}
                </p>
                <Icon className="h-4 w-4 text-[#6FE5FF]" />
              </div>
              <p className="mt-4 font-display text-3xl font-bold">{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-6 py-4">Job #</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Scheduled</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    Loading jobs...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <PackageSearch className="h-4 w-4" />
                      No jobs yet — jobs appear here once you accept a quote.
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((job: JobResponse) => (
                  <tr
                    key={job.id}
                    onClick={() => navigate({ to: "/dashboard/jobs/$jobId", params: { jobId: String(job.id) } })}
                    className="text-sm hover:bg-white/[0.02] cursor-pointer"
                  >
                    <td className="px-6 py-5 font-mono font-bold text-[#6FE5FF]/80">#{job.id}</td>
                    <td className="px-6 py-5">
                      {job.move_from || job.move_to ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
                          <MapPin className="w-2.5 h-2.5" /> {job.move_from || "-"} → {job.move_to || "-"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3 h-3" /> {formatDate(job.scheduled_start)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase">
                        {job.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to="/dashboard/jobs/$jobId"
                        params={{ jobId: String(job.id) }}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[#6FE5FF] hover:opacity-80 text-xs font-semibold"
                      >
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
          <span className="text-xs text-muted-foreground">
            Showing <span className="text-foreground font-medium">{paginated.length}</span> of{" "}
            <span className="text-foreground font-medium">{visible.length}</span> jobs
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}