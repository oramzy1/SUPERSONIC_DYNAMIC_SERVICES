// src/components/jobs/JobParts.tsx
import type { ReactNode } from "react";
import { Check, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobResponse } from "@/lib/api-types";

export type CrewPerson = {
  id: number;
  full_name: string;
  phone?: string | null;
  profile_image_url?: string | null;
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// move_date / delivery_date are date-only strings, so pin them to local midnight
export function formatDay(d?: string | null, locale = "en-GB"): string {
  if (!d) return "-";
  return new Date(`${d}T00:00:00`).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Prefer crew_members (name/phone/avatar); fall back to crew_ids + the users list
export function resolveCrew(
  job: Pick<JobResponse, "crew_ids" | "crew_members">,
  usersById?: ReadonlyMap<
    number,
    { full_name: string; phone?: string | null; profile_image_url?: string | null }
  >,
): CrewPerson[] {
  if (job.crew_members?.length) return job.crew_members;
  return (job.crew_ids ?? []).map((id) => {
    const u = usersById?.get(id);
    return {
      id,
      full_name: u?.full_name ?? `User #${id}`,
      phone: u?.phone ?? null,
      profile_image_url: u?.profile_image_url ?? null,
    };
  });
}

/* ── badges ─────────────────────────────────────────── */
const BADGE =
  "inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider";
const TONE = {
  good: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  warn: "border-[#E2A54A]/20 bg-[#E2A54A]/10 text-[#E2A54A]",
  info: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  bad: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  neutral: "border-white/10 bg-white/6 text-foreground/70",
};
const JOB_TONE: Record<string, keyof typeof TONE> = {
  in_progress: "info",
  completed: "good",
  cancelled: "bad",
  overdue: "bad",
  pending: "warn",
  scheduled: "warn",
};
const DOC_TONE: Record<string, keyof typeof TONE> = {
  signed: "good",
  paid: "good",
  sent: "warn",
  customer_signed: "warn",
  pending: "warn",
  unpaid: "warn",
  declined: "bad",
  expired: "bad",
  overdue: "bad",
  failed: "bad",
  cancelled: "bad",
};

export function JobStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(BADGE, TONE[JOB_TONE[status] ?? "neutral"])}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function DocStatusBadge({ status, label }: { status?: string | null; label?: string }) {
  const s = status ?? "unknown";
  return (
    <span className={cn(BADGE, TONE[DOC_TONE[s] ?? "neutral"])}>
      {label ? `${label} · ` : ""}
      {s.replace(/_/g, " ")}
    </span>
  );
}

/* ── people ─────────────────────────────────────────── */
export function Avatar({ person, className }: { person: CrewPerson; className?: string }) {
  return person.profile_image_url ? (
    <img
      src={person.profile_image_url}
      alt={person.full_name}
      title={person.full_name}
      className={cn("h-7 w-7 rounded-full border border-white/10 object-cover", className)}
    />
  ) : (
    <span
      title={person.full_name}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[9px] font-bold text-foreground/80",
        className,
      )}
    >
      {initials(person.full_name)}
    </span>
  );
}

export function AvatarStack({ people, max = 3 }: { people: CrewPerson[]; max?: number }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p) => (
        <Avatar key={p.id} person={p} className="ring-2 ring-background" />
      ))}
      {extra > 0 && (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold ring-2 ring-background">
          +{extra}
        </span>
      )}
    </div>
  );
}

export function CrewList({
  people,
  renderAction,
  empty = "No crew assigned yet.",
}: {
  people: CrewPerson[];
  renderAction?: (p: CrewPerson) => ReactNode;
  empty?: string;
}) {
  if (people.length === 0) return <p className="text-xs text-foreground/60">{empty}</p>;
  return (
    <ul className="space-y-2">
      {people.map((p) => (
        <li
          key={p.id}
          className="flex items-center gap-3 rounded-xs border border-white/6 bg-background px-3 py-2"
        >
          <Avatar person={p} className="h-8 w-8" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground/80">{p.full_name}</p>
            {p.phone && (
              <a
                href={`tel:${p.phone}`}
                className="inline-flex items-center gap-1 text-[11px] text-foreground/50 hover:text-foreground/80"
              >
                <Phone className="h-3 w-3" /> {p.phone}
              </a>
            )}
          </div>
          {renderAction?.(p)}
        </li>
      ))}
    </ul>
  );
}

/* ── cards ──────────────────────────────────────────── */
export function InfoCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xs border border-white/6 bg-surface p-5", className)}>
      <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/60">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

export function RouteCard({
  from,
  to,
  moveDate,
  deliveryDate,
  locale = "en-GB",
  className,
}: {
  from?: string | null;
  to?: string | null;
  moveDate?: string | null;
  deliveryDate?: string | null;
  locale?: string;
  className?: string;
}) {
  const label = "text-[10px] uppercase tracking-wider text-foreground/50";
  return (
    <InfoCard title="Route" icon={<MapPin className="h-3.5 w-3.5" />} className={className}>
      <div className="flex gap-3">
        <div className="flex flex-col items-center pt-1">
          <span className="h-2 w-2 rounded-full border-2 border-[#E2A54A]" />
          <span className="my-1 w-px flex-1 bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-[#E2A54A]" />
        </div>
        <div className="flex-1 space-y-3 text-sm text-foreground/80">
          <div>
            <p className={label}>Pick-up</p>
            <p>{from || "-"}</p>
          </div>
          <div>
            <p className={label}>Drop-off</p>
            <p>{to || "-"}</p>
          </div>
        </div>
      </div>
      {(moveDate || deliveryDate) && (
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/6 pt-3 text-xs">
          {moveDate && (
            <div>
              <dt className={label}>Move date</dt>
              <dd className="mt-0.5 font-semibold text-foreground/80">
                {formatDay(moveDate, locale)}
              </dd>
            </div>
          )}
          {deliveryDate && (
            <div>
              <dt className={label}>Delivery date</dt>
              <dd className="mt-0.5 font-semibold text-foreground/80">
                {formatDay(deliveryDate, locale)}
              </dd>
            </div>
          )}
        </dl>
      )}
    </InfoCard>
  );
}

export const docActionClass = "text-xs font-semibold text-[#E2A54A] hover:underline";

export function DocRow({
  icon,
  title,
  status,
  action,
}: {
  icon: ReactNode;
  title: string;
  status?: string | null;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xs border border-white/6 bg-background px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-white/5 text-foreground/60">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground/80">{title}</p>
        {status !== undefined && (
          <div className="mt-1">
            <DocStatusBadge status={status} />
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

export function JobProgress({
  job,
}: {
  job: Pick<JobResponse, "status" | "contract_status" | "scheduled_start" | "crew_ids">;
}) {
  if (job.status === "cancelled") return null;
  const steps = [
    { label: "Contract signed", done: job.contract_status === "signed" },
    { label: "Scheduled", done: !!job.scheduled_start },
    { label: "Crew assigned", done: (job.crew_ids?.length ?? 0) > 0 },
    { label: "In progress", done: job.status === "in_progress" || job.status === "completed" },
    { label: "Completed", done: job.status === "completed" },
  ];
  const current = steps.findIndex((s) => !s.done);
  return (
    <ol className="mb-6 flex items-start overflow-x-auto rounded-xs border border-white/6 bg-surface p-4">
      {steps.map((s, i) => (
        <li key={s.label} className="flex min-w-24 flex-1 flex-col items-center text-center">
          <div className="flex w-full items-center">
            <span
              className={cn(
                "h-px flex-1",
                i === 0 ? "bg-transparent" : steps[i - 1].done ? "bg-[#E2A54A]/50" : "bg-white/10",
              )}
            />
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                s.done
                  ? "border-[#E2A54A] bg-[#E2A54A] text-slate-950"
                  : i === current
                    ? "border-[#E2A54A] text-[#E2A54A]"
                    : "border-white/15 text-foreground/40",
              )}
            >
              {s.done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span
              className={cn(
                "h-px flex-1",
                i === steps.length - 1
                  ? "bg-transparent"
                  : s.done
                    ? "bg-[#E2A54A]/50"
                    : "bg-white/10",
              )}
            />
          </div>
          <span
            className={cn(
              "mt-2 text-[10px] font-semibold uppercase tracking-wide",
              s.done || i === current ? "text-foreground/80" : "text-foreground/40",
            )}
          >
            {s.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
