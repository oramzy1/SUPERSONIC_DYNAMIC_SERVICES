import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LifeBuoy,
  Plus,
  Send,
  Loader2,
  Inbox,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { supportApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { cn } from "@/lib/utils";
import type { TicketDetail } from "@/lib/api-types";

export const Route = createFileRoute("/dashboard/support")({
  component: CustomerSupportPage,
  head: () => ({ meta: [{ title: "Support - Supersonic Dynamic Services" }] }),
});

const PAGE_SIZE = 8;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CustomerSupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"all" | "open" | "resolved">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["support", "tickets", "customer"],
    queryFn: () => supportApi.listMyTickets(),
  });

  const createTicket = useMutation({
    mutationFn: () =>
      supportApi.createTicket({
        email: user?.email ?? "",
        subject: subject.trim(),
        message: message.trim(),
      }),
    onSuccess: () => {
      toast.success("Ticket submitted - our team will get back to you shortly.");
      setSubject("");
      setMessage("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
    },
    onError: (err: unknown) => {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(detail || "Couldn't submit your ticket. Please try again.");
    },
  });

  const filtered = useMemo(() => {
    const byTab =
      tab === "all"
        ? tickets
        : tickets.filter((t) => (tab === "resolved" ? t.is_resolved : !t.is_resolved));
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter(
      (t) =>
        String(t.id).includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.message.toLowerCase().includes(q),
    );
  }, [tickets, tab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCount = tickets.filter((t) => !t.is_resolved).length;
  const resolvedCount = tickets.filter((t) => t.is_resolved).length;
  const canSubmit = subject.trim().length >= 3 && message.trim().length >= 10;

  const metrics = [
    { title: "Total Tickets", value: tickets.length, icon: LifeBuoy, tone: "text-[#E2A54A]" },
    { title: "Open", value: openCount, icon: Clock, tone: "text-amber-400" },
    { title: "Resolved", value: resolvedCount, icon: CheckCircle2, tone: "text-emerald-400" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: "Support" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Support Center</h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Submit a request and track its status. Our team replies as quickly as possible.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-xs bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 self-start sm:self-auto"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "New Ticket"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) createTicket.mutate();
          }}
          className="mt-6 rounded-2xl border border-white/6 bg-surface p-5 sm:p-6 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground/80">
            <MessageSquare className="h-4 w-4 text-[#E2A54A]" /> Submit a support request
          </h3>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground/60">
                Subject
              </span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Update delivery address"
                className="w-full rounded-xs border border-white/6 bg-background px-3 py-3 text-xs text-foreground outline-none transition focus:border-[#E2A54A]/60"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground/60">
                How can we help?
              </span>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide details about your issue or question…"
                className="w-full resize-none rounded-xs border border-white/6 bg-background px-3 py-3 text-xs text-foreground outline-none transition focus:border-[#E2A54A]/60"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-muted-foreground">
                Replies are sent to {user?.email || "your account email"}.
              </span>
              <button
                type="submit"
                disabled={!canSubmit || createTicket.isPending}
                className="inline-flex items-center gap-2 rounded-xs bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createTicket.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {createTicket.isPending ? "Sending…" : "Submit Request"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="rounded-2xl bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {m.title}
                </p>
                <Icon className={cn("h-4 w-4", m.tone)} />
              </div>
              <p className="mt-4 font-display text-3xl font-bold">{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 rounded-xs border border-white/6 bg-surface px-3 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search tickets..."
            className="w-52 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="inline-flex flex-wrap rounded-full bg-surface p-1">
          {(["all", "open", "resolved"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium capitalize transition",
                tab === t ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <div className="rounded-2xl bg-surface py-16 text-center text-sm text-muted-foreground">
            Loading tickets...
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-surface py-16 text-center">
            <div className="rounded-xs border border-white/6 bg-white/2 p-2.5 text-muted-foreground">
              <Inbox className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-foreground/70">No tickets found</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              {tickets.length === 0
                ? "Submit your first request and it will appear here."
                : "Try a different filter or search term."}
            </p>
          </div>
        ) : (
          paginated.map((t: TicketDetail) => {
            const expanded = expandedId === t.id;
            return (
              <div
                key={t.id}
                className="overflow-hidden rounded-xs border border-white/6 bg-surface"
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : t.id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-white/2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xs border",
                        t.is_resolved
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/20 bg-amber-500/10 text-amber-400",
                      )}
                    >
                      {t.is_resolved ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#E2A54A]">
                          #SR-{t.id}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider",
                            t.is_resolved
                              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                              : "border-amber-500/20 bg-amber-500/5 text-amber-400",
                          )}
                        >
                          {t.is_resolved ? "Resolved" : "Open"}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm font-semibold text-foreground/80">
                        {t.subject}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDate(t.created_at)}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      expanded && "rotate-180",
                    )}
                  />
                </button>
                {expanded && (
                  <div className="border-t border-white/6 p-4">
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/80">
                      {t.message}
                    </p>
                    {t.is_resolved && t.resolved_at && (
                      <p className="mt-3 text-[11px] text-emerald-400">
                        Resolved on {formatDate(t.resolved_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
