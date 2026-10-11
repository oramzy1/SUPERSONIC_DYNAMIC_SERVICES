import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  UserCog,
  Loader2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Clock,
  FileSignature,
  Receipt,
  ShieldAlert,
  Truck,
  ArrowDown,
  StickyNote,
  Mail,
  User,
  Phone,
  FileText,
  Users,
} from "lucide-react";
import { jobsApi, accountApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { showError, showSuccess } from "@/lib/toast";
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

export const Route = createFileRoute("/_auth/adminjobs/$jobId")({
  component: JobDetailPage,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function toLocalInputValue(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const id = Number(jobId);
  const queryClient = useQueryClient();

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "job", id],
    queryFn: () => jobsApi.get(id),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => accountApi.listUsers(),
  });
  const crewMembers = users.filter((u) => u.role === "crew");
  const usersById = new Map(users.map((u) => [u.id, u]));

  const { data: tracking } = useQuery({
    queryKey: ["job-tracking", job?.tracking_token],
    queryFn: () => jobsApi.track(job!.tracking_token),
    enabled: !!job?.tracking_token,
  });

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [crew, setCrew] = useState<number[]>([]);
  const [dispatcherId, setDispatcherId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [formInitialized, setFormInitialized] = useState(false);

  if (job && !formInitialized) {
    setStart(toLocalInputValue(job.scheduled_start));
    setEnd(toLocalInputValue(job.scheduled_end));
    setCrew(job.crew_ids ?? []);
    setDispatcherId(job.dispatcher_id ?? "");
    setNotes(job.notes ?? "");
    setFormInitialized(true);
  }

  const toggleCrew = (uid: number) =>
    setCrew((prev) => (prev.includes(uid) ? prev.filter((c) => c !== uid) : [...prev, uid]));

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "job", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    if (job?.tracking_token)
      queryClient.invalidateQueries({ queryKey: ["job-tracking", job.tracking_token] });
  };

  const scheduleMutation = useMutation({
    mutationFn: () =>
      jobsApi.schedule(id, {
        scheduled_start: new Date(start).toISOString(),
        scheduled_end: new Date(end).toISOString(),
        crew_ids: crew,
      }),
    onSuccess: () => {
      invalidateAll();
      showSuccess("Schedule and crew updated.");
    },
    onError: (err) => showError(err, "Failed to update schedule."),
  });

  const reassignMutation = useMutation({
    mutationFn: () =>
      jobsApi.assignCrew(id, {
        crew_ids: crew,
        dispatcher_id: dispatcherId === "" ? undefined : dispatcherId,
      }),
    onSuccess: () => {
      invalidateAll();
      showSuccess("Crew reassigned.");
    },
    onError: (err) => showError(err, "Failed to reassign crew."),
  });

  const unassignMutation = useMutation({
    mutationFn: (uid: number) => jobsApi.unassign(id, { user_id: uid }),
    onSuccess: () => {
      invalidateAll();
      showSuccess("Crew member removed from job.");
    },
    onError: (err) => showError(err, "Failed to remove crew member."),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: "in_progress" | "completed") => jobsApi.updateStatus(id, { status }),
    onSuccess: () => {
      invalidateAll();
      showSuccess("Job status updated.");
    },
    onError: (err) => showError(err, "Failed to update job status."),
  });

  const cancelMutation = useMutation({
    mutationFn: () => jobsApi.cancel(id),
    onSuccess: () => {
      invalidateAll();
      showSuccess("Job cancelled.");
    },
    onError: (err) => showError(err, "Failed to cancel job."),
  });

  const notesMutation = useMutation({
    mutationFn: () => jobsApi.updateNotes(id, notes.trim()),
    onSuccess: () => {
      invalidateAll();
      showSuccess("Notes saved.");
    },
    onError: (err) => showError(err, "Failed to save notes."),
  });

  if (isLoading) {
    return (
      <div className="w-full text-foreground/80">
        <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${jobId}` }]} />
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading job...
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="w-full text-foreground/80">
        <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${jobId}` }]} />
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xs p-8 text-center text-sm text-foreground/60">
          Job #{jobId} wasn't found.
          <div className="mt-3">
            <Link to="/adminjobs" className="text-[#E2A54A] text-xs font-semibold hover:underline">
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSchedulingFirstTime = !job.scheduled_start;
  const contractSigned = job.contract_status === "signed";
  const anyMutationBusy =
    scheduleMutation.isPending ||
    reassignMutation.isPending ||
    unassignMutation.isPending ||
    updateStatusMutation.isPending ||
    cancelMutation.isPending;
  const assignedCrew = resolveCrew(job, usersById);
  const notesDirty = notes !== (job.notes ?? "");
  const hasDocs = !!(job.quote_id || job.contract_id || job.invoice_id);

  return (
    <div className="w-full text-foreground/80 select-none pb-12">
      <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${job.id}` }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">Job #{job.id}</h1>
            <JobProgress job={job} />
          </div>
          <p className="text-sm text-foreground/50 mt-1">
            {job.customer_contact?.full_name || "Customer info unavailable"}
            {job.quote_number ? ` · Quote ${job.quote_number}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {job.status === "completed" && job.invoice_id && (
            <Link
              to="/admininvoices/$invoiceId"
              params={{ invoiceId: String(job.invoice_id) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E2A54A]/10 border border-[#E2A54A]/20 text-[#E2A54A] text-[10px] font-bold rounded-xs hover:bg-[#E2A54A]/20 transition"
            >
              <Receipt className="w-3 h-3" /> View Invoice
              {job.invoice_number ? ` ${job.invoice_number}` : ""}
            </Link>
          )}
          {job.status !== "completed" && job.status !== "cancelled" && (
            <button
              onClick={() =>
                updateStatusMutation.mutate(
                  job.status === "in_progress" ? "completed" : "in_progress",
                )
              }
              disabled={anyMutationBusy || (job.status !== "in_progress" && !contractSigned)}
              title={
                job.status !== "in_progress" && !contractSigned
                  ? "Both parties must sign the contract before this job can start."
                  : undefined
              }
              className="px-3 py-1.5 bg-black/80 border border-black/20 text-white text-[10px] font-bold rounded-xs hover:bg-black/50 transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {job.status === "in_progress" ? "Mark Completed" : "Start Job"}
            </button>
          )}
          {job.status !== "completed" && job.status !== "cancelled" && (
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={anyMutationBusy}
              className="flex items-center gap-1 px-3 py-1.5 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-xs hover:bg-rose-500/10 transition duration-150 disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" /> Cancel Job
            </button>
          )}
        </div>
      </div>

      {job.contract_id && !contractSigned && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xs border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-400">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Crew assignment and job start are locked until both parties have signed the contract
            (currently: {(job.contract_status ?? "unknown").replace("_", " ")}).
          </span>
        </div>
      )}
      {!job.contract_id && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xs border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-400">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            No contract is linked to this job yet - crew assignment is locked until one exists and
            is fully signed.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {/* <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60">Route</h3>
            <div className="flex items-start gap-2 text-sm text-foreground/80">
              <MapPin className="w-3.5 h-3.5 text-foreground/80 mt-0.5 shrink-0" />
              <div>
                <p>{job.move_from || "-"}</p>
                <ArrowDown size={10} />
                <p>{job.move_to || "-"}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60">
              Schedule
            </h3>
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Calendar className="w-3.5 h-3.5 text-foreground/80" />{" "}
              {formatDate(job.scheduled_start)} - {formatDate(job.scheduled_end)}
            </div>
          </div>

          <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
              <FileSignature className="w-3.5 h-3.5" /> Contract
            </h3>
            {job.contract_id ? (
              <>
                <p className="text-sm text-foreground/80 capitalize">
                  {(job.contract_status ?? "unknown").replace("_", " ")}
                </p>
                <div className="flex flex-col gap-1.5 pt-1">
                  <Link
                    to="/admincontracts/$contractId"
                    params={{ contractId: String(job.contract_id) }}
                    className="text-xs font-semibold text-[#E2A54A] hover:underline"
                  >
                    Review Signature
                  </Link>
                  {job.contract_url && (
                    <a
                      href={job.contract_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-foreground/60 hover:text-slate-300 hover:underline"
                    >
                      Open signing page
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-foreground/80">No contract yet.</p>
            )}
          </div>

          <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60">
              Currently Assigned
            </h3>
            <div className="space-y-2">
              {(job.crew_ids ?? []).length === 0 && (
                <p className="text-xs text-foreground/80">No crew assigned yet.</p>
              )}
              {(job.crew_ids ?? []).map((uid: any) => (
                <div
                  key={uid}
                  className="flex items-center justify-between rounded-xs border border-white/6 bg-background px-3 py-2"
                >
                  <span className="text-xs font-medium text-foreground/80 ">
                    {usersById.get(uid)?.full_name || `User #${uid}`}
                  </span>
                  <button
                    onClick={() => unassignMutation.mutate(uid)}
                    disabled={anyMutationBusy}
                    className="text-[10px] font-bold text-rose-400 hover:underline disabled:opacity-50"
                  >
                    Unassign
                  </button>
                </div>
              ))}
              {job.dispatcher_id && (
                <div className="flex items-center justify-between rounded-xs border border-white/6 bg-surface px-3 py-2">
                  <span className="text-xs font-medium text-foreground">
                    {usersById.get(job.dispatcher_id)?.full_name || `User #${job.dispatcher_id}`}{" "}
                    <span className="text-foreground/80">(dispatcher)</span>
                  </span>
                </div>
              )}
            </div>
          </div> */}

          <InfoCard title="Customer" icon={<User className="h-3.5 w-3.5" />}>
            {job.customer_contact ? (
              <div className="space-y-1.5 text-sm">
                <p className="font-semibold text-foreground/80">{job.customer_contact.full_name}</p>
                {job.customer_contact.company && (
                  <p className="text-xs text-foreground/60">{job.customer_contact.company}</p>
                )}
                {job.customer_contact.email && (
                  <a
                    href={`mailto:${job.customer_contact.email}`}
                    className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground/80"
                  >
                    <Mail className="h-3 w-3" /> {job.customer_contact.email}
                  </a>
                )}
                {job.customer_contact.phone && (
                  <a
                    href={`tel:${job.customer_contact.phone}`}
                    className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground/80"
                  >
                    <Phone className="h-3 w-3" /> {job.customer_contact.phone}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-foreground/60">Customer info unavailable.</p>
            )}
          </InfoCard>

          <RouteCard
            from={job.move_from}
            to={job.move_to}
            moveDate={job.move_date}
            deliveryDate={job.delivery_date}
          />

          <InfoCard title="Schedule" icon={<Calendar className="h-3.5 w-3.5" />}>
            {job.scheduled_start ? (
              <div className="space-y-1 text-sm text-foreground/70">
                <p>{formatDate(job.scheduled_start)}</p>
                <p className="text-xs text-foreground/50">until {formatDate(job.scheduled_end)}</p>
              </div>
            ) : (
              <p className="text-xs text-foreground/60">Not scheduled yet.</p>
            )}
          </InfoCard>

          {hasDocs && (
            <InfoCard title="Documents" icon={<FileText className="h-3.5 w-3.5" />}>
              <div className="space-y-2">
                {job.quote_id ? (
                  <DocRow
                    icon={<FileText className="h-4 w-4" />}
                    title={job.quote_number ? `Quote ${job.quote_number}` : "Quote"}
                    action={
                      <Link
                        to="/adminquotes/$quoteId"
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
                      <div className="flex flex-col items-end gap-1">
                        <Link
                          to="/admincontracts/$contractId"
                          params={{ contractId: String(job.contract_id) }}
                          className={docActionClass}
                        >
                          Review
                        </Link>
                        {job.contract_url && (
                          <a
                            href={job.contract_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-foreground/50 hover:underline"
                          >
                            Signing page
                          </a>
                        )}
                      </div>
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
                        to="/admininvoices/$invoiceId"
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

          <InfoCard
            title={`Crew (${assignedCrew.length})`}
            icon={<Users className="h-3.5 w-3.5" />}
          >
            <CrewList
              people={assignedCrew}
              renderAction={(p) => (
                <button
                  onClick={() => unassignMutation.mutate(p.id)}
                  disabled={anyMutationBusy}
                  className="text-[10px] font-bold text-rose-400 hover:underline disabled:opacity-50"
                >
                  Unassign
                </button>
              )}
            />
            {job.dispatcher_id ? (
              <p className="mt-3 border-t border-white/6 pt-3 text-xs text-foreground/60">
                Dispatcher:{" "}
                <span className="font-semibold text-foreground/80">
                  {usersById.get(job.dispatcher_id)?.full_name || `User #${job.dispatcher_id}`}
                </span>
              </p>
            ) : null}
          </InfoCard>

          <InfoCard title="Notes" icon={<StickyNote className="h-3.5 w-3.5" />}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Access codes, parking, special handling..."
              className="w-full select-text resize-none rounded-xs border border-white/6 bg-background px-3 py-2 text-xs text-foreground/80 outline-none focus:border-[#E2A54A]/50"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-foreground/40">{notes.length}/2000</span>
              <button
                onClick={() => notesMutation.mutate()}
                disabled={!notesDirty || notesMutation.isPending}
                className="flex items-center gap-1.5 rounded-xs border border-[#E2A54A]/20 bg-[#E2A54A]/10 px-3 py-1.5 text-[10px] font-bold text-[#E2A54A] hover:bg-[#E2A54A]/20 disabled:opacity-40"
              >
                {notesMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />} Save notes
              </button>
            </div>
          </InfoCard>

          {job.photos && job.photos.length > 0 && (
            <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Job Photos
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {job.photos.map((p: any, i: any) => {
                  const url = typeof p === "string" ? p : (p as { url?: string })?.url;
                  return url ? (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={url}
                        className="rounded-xs border border-white/6 aspect-square object-cover"
                      />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {tracking?.history && tracking.history.length > 0 && (
            <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xs p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Status Timeline
              </h3>
              <div className="space-y-2">
                {tracking.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-foreground/80 font-medium">{h.status.replace("_", " ")}</p>
                      <p className="text-foreground/60">{formatDate(h.created_at)}</p>
                      {h.notes && <p className="text-foreground/60 mt-0.5">{h.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div
            className={`bg-surface backdrop-blur-md border border-white/6 rounded-xs p-6 ${!contractSigned ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <UserCog className="w-4 h-4 text-[#E2A54A]" />
              <h3 className="text-sm font-bold text-foreground/70">
                {isSchedulingFirstTime ? "Schedule & Assign Crew" : "Reassign Crew"}
              </h3>
            </div>
            <p className="text-xs text-foreground/60 mb-5">
              {!contractSigned
                ? "Locked until both parties have signed the contract."
                : isSchedulingFirstTime
                  ? "This job hasn't been scheduled yet - set a start/end time and assign crew."
                  : "Change crew or dispatcher without altering the existing schedule, or update the schedule below."}
            </p>

            <fieldset disabled={!contractSigned} className="contents">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                    Scheduled Start
                  </label>
                  <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full bg-background rounded-xs px-3 py-2 text-xs text-foreground/70 focus:outline-none focus:border-[#E2A54A]/60 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                    Scheduled End
                  </label>
                  <input
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full bg-background rounded-xs px-3 py-2 text-xs text-foreground/70 focus:outline-none focus:border-[#E2A54A]/60 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* <div className="space-y-2 mb-5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">
                  Dispatcher
                </label>
                <select
                  value={dispatcherId}
                  onChange={(e) => setDispatcherId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-[#07090e] border border-[#161b22] rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60 disabled:opacity-50"
                >
                  <option value="">No dispatcher</option>
                  {dispatchers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name}
                    </option>
                  ))}
                </select>
              </div> */}

              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                  Crew Members ({crew.length} selected)
                </label>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {crewMembers.length === 0 ? (
                    <p className="text-xs text-foreground/60 py-3 text-center">
                      No crew members found. Add users with the "crew" role first.
                    </p>
                  ) : (
                    crewMembers.map((member) => (
                      <label
                        key={member.id}
                        className={`flex items-center justify-between gap-3 cursor-pointer px-3 py-2 rounded-xs border transition ${
                          crew.includes(member.id)
                            ? "bg-surface/50  border-[#E2A54A]/30"
                            : "bg-background/50 border-background hover:border-[#252c3a]"
                        }`}
                      >
                        <span
                          className={`flex items-center gap-2.5 text-xs font-medium text-foreground/80 ${crew.includes(member.id) ? "opacity-50" : "opacity-100"}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-[9px] font-bold ${crew.includes(member.id) ? "opacity-50" : "opacity-100"} text-foreground/80`}
                          >
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
            </fieldset>

            <div className="flex justify-end gap-3">
              {!isSchedulingFirstTime && (
                <button
                  onClick={() => reassignMutation.mutate()}
                  disabled={anyMutationBusy || !contractSigned}
                  className="flex items-center gap-2 px-4 py-2 rounded-xs border border-white/10 text-foreground/80 text-xs font-bold hover:bg-white/5 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reassignMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />} Save
                  Crew Only
                </button>
              )}
              <button
                onClick={() => scheduleMutation.mutate()}
                disabled={anyMutationBusy || !start || !end || !contractSigned}
                className="flex items-center gap-2 px-4 py-2 rounded-xs bg-[#E2A54A] text-slate-950 text-xs font-bold hover:bg-[#d4963b] transition disabled:opacity-50"
              >
                {scheduleMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                {isSchedulingFirstTime ? "Schedule & Assign" : "Update Schedule & Crew"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
