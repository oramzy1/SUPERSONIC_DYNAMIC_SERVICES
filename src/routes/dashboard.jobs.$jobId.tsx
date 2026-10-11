import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  FileSignature,
  Receipt,
  FileText,
  Users,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { jobsApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import {
  CrewList,
  DocRow,
  InfoCard,
  JobProgress,
  JobStatusBadge,
  RouteCard,
  docActionClass,
  resolveCrew,
} from "@/components/shared/JobParts";

export const Route = createFileRoute("/dashboard/jobs/$jobId")({
  component: JobDetailPage,
});

function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const id = Number(jobId);

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
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
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${jobId}` }]}
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading job...
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${jobId}` }]}
        />
        <div className="rounded-2xl bg-surface p-8 text-center text-sm text-muted-foreground">
          Job #{jobId} wasn't found.
          <div className="mt-3">
            <Link
              to="/dashboard/jobs"
              className="text-primary text-xs font-semibold hover:underline"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const photos = (job.photos ?? []) as Array<string | { url?: string }>;
  const contractStatus = job.contract_status ?? "";
  const needsSignature = contractStatus === "sent";
  const canViewContract = ["customer_signed", "signed"].includes(contractStatus);
  const crew = resolveCrew(job);
  const hasDocs = !!(job.quote_id || job.contract_id || job.invoice_id);

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <Breadcrumbs
        items={[{ label: "Jobs", to: "/dashboard/jobs" }, { label: `Job #${job.id}` }]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold">Job #{job.id}</h1>
          <JobStatusBadge status={job.status} />
        </div>
        {job.status === "completed" && job.invoice_id && (
          <Link
            to="/dashboard/invoices/$invoiceId"
            params={{ invoiceId: String(job.invoice_id) }}
            className="flex items-center gap-1.5 rounded-xs bg-primary/15 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/25"
          >
            <Receipt className="w-3.5 h-3.5" /> View Invoice
            {job.invoice_number ? ` ${job.invoice_number}` : ""}
          </Link>
        )}
      </div>
      <p className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        {job.scheduled_start
          ? `${formatDateTime(job.scheduled_start)} - ${formatDateTime(job.scheduled_end)}`
          : "Not scheduled yet"}
        {job.quote_number ? ` · Quote ${job.quote_number}` : ""}
      </p>

      {job.status === "cancelled" && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xs border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-400">
          <XCircle className="h-4 w-4 shrink-0" /> This job was cancelled.
        </div>
      )}
      <JobProgress job={job} />

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <RouteCard
          from={job.move_from}
          to={job.move_to}
          moveDate={job.move_date}
          deliveryDate={job.delivery_date}
          locale="nl-NL"
        />
        <InfoCard title="Your Crew" icon={<Users className="h-3.5 w-3.5" />}>
          <CrewList people={crew} />
        </InfoCard>
      </div>

      {hasDocs && (
        <InfoCard title="Documents" icon={<FileText className="h-3.5 w-3.5" />} className="mb-4">
          <div className="space-y-2">
            {job.quote_id ? (
              <DocRow
                icon={<FileText className="h-4 w-4" />}
                title={job.quote_number ? `Quote ${job.quote_number}` : "Quote"}
                action={
                  <Link
                    to="/dashboard/quotes/$quoteId"
                    params={{ quoteId: String(job.quote_id) }}
                    className={docActionClass}
                  >
                    View
                  </Link>
                }
              />
            ) : null}
            {job.contract_id ? (
              <DocRow
                icon={<FileSignature className="h-4 w-4" />}
                title="Contract"
                status={job.contract_status}
                action={
                  job.contract_url && (needsSignature || canViewContract) ? (
                    <a
                      href={job.contract_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "rounded-xs px-3 py-1.5 text-xs font-bold",
                        needsSignature
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "bg-white/10 text-foreground/80 hover:bg-white/15",
                      )}
                    >
                      {needsSignature ? "Sign Contract" : "View Contract"}
                    </a>
                  ) : undefined
                }
              />
            ) : null}
            {job.invoice_id ? (
              <DocRow
                icon={<Receipt className="h-4 w-4" />}
                title={job.invoice_number ? `Invoice ${job.invoice_number}` : "Invoice"}
                status={job.invoice_status}
                action={
                  <Link
                    to="/dashboard/invoices/$invoiceId"
                    params={{ invoiceId: String(job.invoice_id) }}
                    className={docActionClass}
                  >
                    View
                  </Link>
                }
              />
            ) : null}
          </div>
        </InfoCard>
      )}

      {photos.length > 0 && (
        <div className="rounded-2xl bg-surface p-5 mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Photos from the crew
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => {
              const url = typeof p === "string" ? p : p?.url;
              return url ? (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    className="rounded-xs border border-white/10 aspect-square object-cover"
                  />
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
                <span className="flex items-center gap-2 capitalize">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {h.status.replace("_", " ")}
                </span>
                <span className="text-muted-foreground">
                  {h.timestamp
                    ? new Date(h.timestamp).toLocaleString("nl-NL")
                    : formatDateTime(h.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
