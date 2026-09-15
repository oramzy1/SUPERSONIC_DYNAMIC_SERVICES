import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Calendar } from "lucide-react";
import { jobsApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/dashboard/jobs/")({
  component: JobsPage,
});

function JobsPage() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsApi.list(),
  });

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: "Jobs" }]} />
      <h1 className="font-display text-3xl font-bold md:text-5xl">Your Jobs</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Track scheduling and status updates for accepted jobs.
      </p>
 
      <div className="mt-8 space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No jobs yet - jobs appear here once you accept a quote.
          </p>
        ) : (
          jobs.map((job) => (
            <Link
              key={job.id}
              to="/dashboard/jobs/$jobId"
              params={{ jobId: String(job.id) }}
              className="flex items-center justify-between rounded-2xl bg-surface p-5 hover:bg-white/5 transition"
            >
              <div>
                <p className="font-semibold">Job #{job.id}</p>
                {job.scheduled_start ? (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3 h-3" /> {new Date(job.scheduled_start).toLocaleString("nl-NL")}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Not scheduled yet</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase">
                  {job.status}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}