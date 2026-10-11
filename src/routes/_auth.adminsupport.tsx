import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LifeBuoy,
  Search,
  X,
  Inbox,
  CheckCircle2,
  Clock,
  Mail,
  User,
  Loader2,
  CheckCheck,
  ChevronRight,
} from "lucide-react";
import { supportApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { cn } from "@/lib/utils";
import type { TicketDetail } from "@/lib/api-types";

export const Route = createFileRoute("/_auth/adminsupport")({
  component: AdminSupportPage,
  validateSearch: (search: Record<string, unknown>) => ({
    ticket: typeof search.ticket === "string" ? search.ticket : undefined,
  }),
});

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminSupportPage() {
  const queryClient = useQueryClient();
  const { ticket: ticketParam } = useSearch({ from: "/_auth/adminsupport" });

  const [tab, setTab] = useState<"open" | "resolved" | "all">("open");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(
    ticketParam ? Number(ticketParam) : null,
  );

  useEffect(() => {
    if (ticketParam) setSelectedId(Number(ticketParam));
  }, [ticketParam]);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["support", "tickets", "admin"],
    queryFn: () => supportApi.listTickets(),
    refetchInterval: 20_000,
  });

  const { data: selected, isLoading: loadingSelected } = useQuery({
    queryKey: ["support", "ticket", selectedId],
    queryFn: () => supportApi.getTicket(selectedId as number),
    enabled: selectedId != null,
  });

  const closeTicket = useMutation({
    mutationFn: (id: number) => supportApi.closeTicket(id),
    onSuccess: () => {
      toast.success("Ticket closed.");
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support", "ticket"] });
    },
    onError: (err: unknown) => {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(detail || "Couldn't close the ticket. Please try again.");
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
        t.email.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.message.toLowerCase().includes(q),
    );
  }, [tickets, tab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCount = tickets.filter((t) => !t.is_resolved).length;
  const resolvedCount = tickets.filter((t) => t.is_resolved).length;

  return (
    <div className="w-full text-foreground/80 select-none pb-12">
      <Breadcrumbs items={[{ label: "Support" }]} />

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground/70">Support Tickets</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Review incoming customer requests and close them once resolved.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-white/6 bg-surface px-3 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-md sm:self-auto">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          {isLoading ? "Syncing..." : `${openCount} open`}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-5 lg:grid-cols-3">
        {[
          { title: "TOTAL TICKETS", value: tickets.length, icon: LifeBuoy, tone: "text-[#E2A54A]" },
          { title: "OPEN", value: openCount, icon: Clock, tone: "text-amber-400" },
          { title: "RESOLVED", value: resolvedCount, icon: CheckCircle2, tone: "text-emerald-400" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="flex h-32 flex-col justify-between rounded-xs border border-white/6 bg-surface p-5 backdrop-blur-md"
            >
              <div className="flex w-full items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">
                  {c.title}
                </span>
                <div className={cn("rounded-xs border border-white/6 bg-white/2 p-1.5", c.tone)}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className={cn("font-mono text-3xl font-bold tracking-tight", c.tone)}>
                {c.value}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-fit items-center gap-1.5 overflow-x-auto rounded-xs border border-white/6 bg-surface p-1 text-xs font-medium text-foreground/70 backdrop-blur-md">
          {(["open", "resolved", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={cn(
                "rounded-xs px-3 py-1 uppercase transition-colors",
                tab === t
                  ? "border border-[#E2A54A]/10 bg-[#E2A54A]/10 font-semibold text-[#E2A54A]"
                  : "hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xs border border-white/6 bg-surface px-3 py-2 lg:w-72">
          <Search className="h-3.5 w-3.5 shrink-0 text-foreground/60" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by ID, email, subject..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-foreground/50"
          />
        </div>
      </div>

      <div className={cn("flex flex-col items-start gap-6 lg:flex-row")}>
        <div
          className={cn("w-full transition-all duration-300", selected ? "lg:w-2/3" : "lg:w-full")}
        >
          {isLoading ? (
            <div className="rounded-xs border border-white/6 bg-surface py-16 text-center text-sm text-foreground/60 backdrop-blur-md">
              Loading tickets...
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xs border border-white/6 bg-surface py-16 text-center backdrop-blur-md">
              <div className="rounded-xs border border-white/6 bg-white/2 p-2.5 text-foreground/60">
                <Inbox className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-foreground/70">No tickets found</p>
              <p className="max-w-xs text-xs text-foreground/60">
                {tickets.length === 0
                  ? "Customer support requests will appear here."
                  : "Try another filter or search term."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginated.map((t: TicketDetail) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "block w-full rounded-xs border p-4 text-left backdrop-blur-md transition",
                    selectedId === t.id
                      ? "border-[#E2A54A]/30 bg-[#E2A54A]/5"
                      : "border-white/6 bg-surface hover:border-white/12 hover:bg-white/2",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
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
                          <CheckCheck className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#E2A54A]">
                            #SR-{t.id}
                          </span>
                          <span className="truncate text-xs text-foreground/60">{t.email}</span>
                        </div>
                        <p className="mt-1 truncate text-sm font-semibold text-foreground/80">
                          {t.subject}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-foreground/50">
                          {t.message}
                        </p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 items-center gap-2 text-[11px] text-foreground/50 sm:flex">
                      {formatDate(t.created_at)}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>

        {selectedId != null && (
          <div className="sticky top-6 w-full self-start overflow-hidden rounded-xs border border-white/8 bg-surface shadow-2xl backdrop-blur-md lg:w-1/3">
            <div className="flex items-center justify-between border-b border-white/6 px-5 py-4">
              <div>
                <span className="font-mono text-[10px] text-foreground/50">
                  Ticket #SR-{selectedId}
                </span>
                <h2 className="text-sm font-semibold text-foreground/80">Ticket Details</h2>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-xs p-1.5 text-foreground/60 transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loadingSelected || !selected ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-foreground/60">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : (
              <div className="space-y-5 p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xs border px-2.5 py-1 text-[10px] font-bold uppercase",
                      selected.is_resolved
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-amber-500/20 bg-amber-500/10 text-amber-400",
                    )}
                  >
                    {selected.is_resolved ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {selected.is_resolved ? "Resolved" : "Open"}
                  </span>
                  <span className="text-[11px] text-foreground/50">
                    {formatDate(selected.created_at)}
                  </span>
                </div>

                <h3 className="text-base font-bold leading-snug text-foreground/90">
                  {selected.subject}
                </h3>

                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground/50">
                    From
                  </span>
                  <div className="flex items-center gap-2 rounded-xs border border-white/6 bg-white/2 px-3.5 py-2.5 text-xs">
                    <User className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
                    <span className="truncate text-foreground/80">{selected.email}</span>
                    {selected.customer_id != null && (
                      <span className="ml-auto shrink-0 font-mono text-[10px] text-foreground/50">
                        ID {selected.customer_id}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground/50">
                    Message
                  </span>
                  <div className="min-h-24 whitespace-pre-wrap rounded-xs border border-white/6 bg-white/2 p-4 text-xs leading-relaxed text-foreground/80">
                    {selected.message}
                  </div>
                </div>

                {selected.is_resolved && selected.resolved_at && (
                  <p className="text-[11px] text-emerald-400">
                    Resolved on {formatDate(selected.resolved_at)}
                  </p>
                )}

                {!selected.is_resolved && (
                  <button
                    onClick={() => closeTicket.mutate(selected.id)}
                    disabled={closeTicket.isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xs border border-emerald-500/20 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    {closeTicket.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCheck className="h-3.5 w-3.5" />
                    )}
                    Close ticket
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
