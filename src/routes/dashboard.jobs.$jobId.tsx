// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";
// import { Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react";
// import { jobsApi } from "@/lib/api";
// import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

// export const Route = createFileRoute("/dashboard/jobs/$jobId")({
//   component: JobDetailPage,
// });

// function formatDate(iso?: string | null): string {
//   if (!iso) return "-";
//   return new Date(iso).toLocaleString("nl-NL", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function JobDetailPage() {
//   const { jobId } = Route.useParams();
//   const id = Number(jobId);

//   // No GET /jobs/{id} on the backend - reuse the shared list query (same key
//   // as the index page) and find this job in it.
//   const { data: jobs = [], isLoading } = useQuery({
//     queryKey: ["jobs"],
//     queryFn: () => jobsApi.list(),
//   });
//   const job = jobs.find((j) => j.id === id);

//   const { data: tracking } = useQuery({
//     queryKey: ["job-track", job?.tracking_token],
//     queryFn: () => jobsApi.track(job!.tracking_token),
//     enabled: !!job?.tracking_token,
//   });

//   if (isLoading) {
//     return (
//       <div className="mx-auto max-w-3xl">
//         <Breadcrumbs
//           items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${jobId}` }]}
//         />
//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <Loader2 className="w-4 h-4 animate-spin" /> Loading job...
//         </div>
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="mx-auto max-w-3xl">
//         <Breadcrumbs
//           items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${jobId}` }]}
//         />
//         <div className="rounded-2xl bg-surface p-8 text-center text-sm text-muted-foreground">
//           Job #{jobId} wasn't found.
//           <div className="mt-3">
//             <Link
//               to="/dashboard/jobs"
//               className="text-primary text-xs font-semibold hover:underline"
//             >
//               Back to Jobs
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const photos = (job.photos ?? []) as Array<string | { url?: string }>;

//   return (
//     <div className="mx-auto max-w-3xl pb-12">
//       <Breadcrumbs
//         items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${job.id}` }]}
//       />

//       <div className="flex items-center gap-3 mb-1">
//         <h1 className="font-display text-2xl font-bold">Job #{job.id}</h1>
//         <span className="rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase">
//           {job.status}
//         </span>
//       </div>
//       <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5">
//         <Calendar className="w-3.5 h-3.5" /> {formatDate(job.scheduled_start)} -{" "}
//         {formatDate(job.scheduled_end)}
//       </p>

//       {photos.length > 0 && (
//         <div className="rounded-2xl bg-surface p-5 mb-4">
//           <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
//             Photos from the crew
//           </h3>
//           <div className="grid grid-cols-3 gap-2">
//             {photos.map((p, i) => {
//               const url = typeof p === "string" ? p : p?.url;
//               return url ? (
//                 <a key={i} href={url} target="_blank" rel="noopener noreferrer">
//                   <img
//                     src={url}
//                     className="rounded-md border border-white/10 aspect-square object-cover"
//                   />
//                 </a>
//               ) : null;
//             })}
//           </div>
//         </div>
//       )}

//       {tracking?.history && tracking.history.length > 0 && (
//         <div className="rounded-2xl bg-surface p-5">
//           <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
//             <Clock className="w-3.5 h-3.5" /> Status Timeline
//           </h3>
//           <div className="space-y-2">
//             {tracking.history.map((h, i) => (
//               <div key={i} className="flex items-center justify-between text-xs">
//                 <span className="flex items-center gap-2 capitalize">
//                   <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {h.status.replace("_", " ")}
//                 </span>
//                 <span className="text-muted-foreground">
//                   {h.timestamp
//                     ? new Date(h.timestamp).toLocaleString("nl-NL")
//                     : formatDate(h.created_at)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CheckCircle2, Loader2, FileSignature, Receipt } from "lucide-react";
import { jobsApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/dashboard/jobs/$jobId")({
  component: JobDetailPage,
});

function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("nl-NL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const id = Number(jobId);

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.get(id),
  });

  const { data: tracking } = useQuery({
    queryKey: ["job-track", job?.tracking_token],
    queryFn: () => jobsApi.track(job!.tracking_token),
    enabled: !!job?.tracking_token,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${jobId}` }]} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading job...</div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${jobId}` }]} />
        <div className="rounded-2xl bg-surface p-8 text-center text-sm text-muted-foreground">
          Job #{jobId} wasn't found.
          <div className="mt-3"><Link to="/dashboard/jobs" className="text-primary text-xs font-semibold hover:underline">Back to Jobs</Link></div>
        </div>
      </div>
    );
  }

  const photos = (job.photos ?? []) as Array<string | { url?: string }>;
  const contractSigned = job.contract_status === "signed";

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <Breadcrumbs items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${job.id}` }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold">Job #{job.id}</h1>
          <span className="rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase">{job.status}</span>
        </div>
        {job.status === "completed" && job.invoice_id && (
          <Link
            to="/dashboard/invoices/$invoiceId"
            params={{ invoiceId: String(job.invoice_id) }}
            className="flex items-center gap-1.5 rounded-lg bg-primary/15 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/25"
          >
            <Receipt className="w-3.5 h-3.5" /> View Invoice{job.invoice_number ? ` ${job.invoice_number}` : ""}
          </Link>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" /> {formatDateTime(job.scheduled_start)} — {formatDateTime(job.scheduled_end)}
      </p>

      {job.contract_id && (
        <div className="rounded-2xl bg-surface p-5 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <FileSignature className="w-3.5 h-3.5" /> Contract
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm capitalize">{(job.contract_status ?? "unknown").replace("_", " ")}</span>
            {job.contract_url && (
              <a
                href={job.contract_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-bold rounded-lg px-4 py-2 ${
                  contractSigned ? "bg-white/10 text-foreground/80 hover:bg-white/15" : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {contractSigned ? "View Contract" : "Sign Contract"}
              </a>
            )}
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="rounded-2xl bg-surface p-5 mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Photos from the crew</h3>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => {
              const url = typeof p === "string" ? p : p?.url;
              return url ? (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img src={url} className="rounded-md border border-white/10 aspect-square object-cover" />
                </a>
              ) : null;
            })}
          </div>
        </div>
      )}

      {tracking?.history && tracking.history.length > 0 && (
        <div className="rounded-2xl bg-surface p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Status Timeline
          </h3>
          <div className="space-y-2">
            {tracking.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 capitalize"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> {h.status.replace("_", " ")}</span>
                <span className="text-muted-foreground">{h.timestamp ? new Date(h.timestamp).toLocaleString("nl-NL") : formatDateTime(h.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}