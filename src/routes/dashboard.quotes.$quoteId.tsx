import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Download, Loader2, CheckCircle2 } from "lucide-react";
import { quotesApi, mapPdfError, openBlobInNewTab } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/quotes/$quoteId")({
  component: QuoteDetailPage,
});

const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting Review",
  quoted: "Quote Ready - Action Needed",
  accepted: "Accepted",
  rejected: "Declined",
  expired: "Expired",
};

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function QuoteDetailPage() {
  const { quoteId } = Route.useParams();
  const id = Number(quoteId);
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [busy, setBusy] = useState<"accept" | "reject" | "counter" | "pdf" | null>(null);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  // No GET /quotes/request/{id} - reuse the shared list query (same key as
  // the index page) and find this request in it for descriptive fields.
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => quotesApi.listRequests(),
  });
  const request = requests.find((r) => r.id === id);

  // Pricing only exists once a quote has been generated.
  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ["quote-detail", id],
    queryFn: () => quotesApi.get(id),
    enabled: !!request && request.status !== "pending",
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["quotes"] });
    queryClient.invalidateQueries({ queryKey: ["quote-detail", id] });
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
  };

  const accept = async () => {
    setBusy("accept");
    try {
      await quotesApi.accept(id);
      refresh();
      setToast({ type: "success", message: "Quote accepted - check the Jobs tab for tracking." });
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: (err as any)?.response?.data?.detail || "Failed to accept quote.",
      });
    } finally {
      setBusy(null);
    }
  };

  const reject = async () => {
    setBusy("reject");
    try {
      await quotesApi.reject(id);
      refresh();
      setToast({ type: "success", message: "Quote declined." });
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: (err as any)?.response?.data?.detail || "Failed to decline quote.",
      });
    } finally {
      setBusy(null);
    }
  };

  const sendCounter = async () => {
    if (!counterAmount) {
      setToast({ type: "error", message: "Enter a counter amount first." });
      return;
    }
    setBusy("counter");
    try {
      await quotesApi.counterOffer(id, {
        amount: counterAmount,
        message: counterMessage || undefined,
      });
      refresh();
      setToast({ type: "success", message: "Counter offer sent." });
      setCounterOpen(false);
      setCounterAmount("");
      setCounterMessage("");
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: (err as any)?.response?.data?.detail || "Failed to send counter offer.",
      });
    } finally {
      setBusy(null);
    }
  };

  const downloadPdf = async () => {
    setBusy("pdf");
    try {
      const blob = await quotesApi.downloadPdf(id);
      await openBlobInNewTab(blob);
    } catch (err) {
      setToast({ type: "error", message: mapPdfError(err) });
    } finally {
      setBusy(null);
    }
  };

  if (requestsLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[{ label: "Quotes", to: "/dashboard/quotes" }, { label: `Request #${quoteId}` }]}
        />
        <p className="text-sm text-muted-foreground">Loading request...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[{ label: "Quotes", to: "/dashboard/quotes" }, { label: `Request #${quoteId}` }]}
        />
        <div className="rounded-2xl bg-surface p-8 text-center text-sm text-muted-foreground">
          Request #{quoteId} wasn't found.
          <div className="mt-3">
            <Link
              to="/dashboard/quotes"
              className="text-primary text-xs font-semibold hover:underline"
            >
              Back to Quotes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <Breadcrumbs
        items={[{ label: "Quotes", to: "/dashboard/quotes" }, { label: `Request #${request.id}` }]}
      />

      {toast && (
        <div
          className={cn(
            "fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border",
            toast.type === "success"
              ? "bg-surface border-emerald-500/30 text-emerald-400"
              : "bg-surface border-rose-500/30 text-rose-400",
          )}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-3 mb-1">
        <h1 className="font-display text-2xl font-bold">Request #{request.id}</h1>
        <span className="rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase">
          {STATUS_LABELS[request.status] ?? request.status}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6 capitalize">
        {request.move_type.replace("-", " ")}
      </p>

      {request.status === "quoted" && (
        <div className="rounded-2xl bg-surface p-6 mb-4 border border-blue-500/20">
          {quoteLoading ? (
            <p className="text-xs text-muted-foreground">Loading your quote...</p>
          ) : quote ? (
            <>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-3xl font-display font-bold">€{quote.total_price}</span>
                <span className="text-xs text-muted-foreground">
                  valid until {new Date(quote.valid_until).toLocaleDateString("nl-NL")}
                </span>
              </div>
              {quote.counter_offers?.length > 0 && (
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground border-t border-white/5 pt-3">
                  <p className="font-semibold text-foreground/80">Negotiation history</p>
                  {quote.counter_offers.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span>
                        {c.offered_by_name || `User #${c.offered_by}`}: €{c.amount}
                      </span>
                      <span>{formatDate(c.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={downloadPdf}
                  disabled={busy === "pdf"}
                  className="flex items-center gap-1.5 rounded-md bg-white/5 px-4 py-2 text-xs font-bold uppercase text-foreground/80 hover:bg-white/10 disabled:opacity-50"
                >
                  {busy === "pdf" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  Download Quote
                </button>
                <button
                  onClick={accept}
                  disabled={busy !== null}
                  className="rounded-md bg-primary/20 px-4 py-2 text-xs font-bold uppercase text-primary hover:bg-primary/30 disabled:opacity-50"
                >
                  {busy === "accept" ? "Accepting…" : "Accept"}
                </button>
                <button
                  onClick={() => setCounterOpen((v) => !v)}
                  disabled={busy !== null}
                  className="rounded-md bg-blue-500/15 px-4 py-2 text-xs font-bold uppercase text-blue-400 hover:bg-blue-500/25 disabled:opacity-50"
                >
                  Counter Offer
                </button>
                <button
                  onClick={reject}
                  disabled={busy !== null}
                  className="rounded-md bg-red-500/15 px-4 py-2 text-xs font-bold uppercase text-red-400 hover:bg-red-500/25 disabled:opacity-50"
                >
                  {busy === "reject" ? "Declining…" : "Decline"}
                </button>
              </div>

              {counterOpen && (
                <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Your counter amount (€)
                  </label>
                  <input
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    placeholder="e.g. 950"
                    className="mb-3 w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/25"
                  />
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Message (optional)
                  </label>
                  <textarea
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    rows={2}
                    className="mb-3 w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/25"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setCounterOpen(false)}
                      className="rounded-md px-4 py-2 text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendCounter}
                      disabled={busy === "counter"}
                      className="rounded-md bg-blue-500/20 px-4 py-2 text-xs font-bold uppercase text-blue-400 hover:bg-blue-500/30 disabled:opacity-50"
                    >
                      {busy === "counter" ? "Sending…" : "Send Counter"}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Pricing isn't available yet.</p>
          )}
        </div>
      )}

      {request.status === "accepted" && (
        <div className="rounded-2xl bg-surface p-6 mb-4 border border-emerald-500/20 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Quote accepted
          </span>
          <Link
            to="/dashboard/jobs"
            className="text-[#6FE5FF] hover:opacity-80 text-xs font-semibold"
          >
            Track your job →
          </Link>
        </div>
      )}

      <div className="rounded-2xl bg-surface p-6 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Route
          </p>
          <p className="flex items-center gap-1.5 text-sm">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {request.address_from} →{" "}
            {request.address_to}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Description
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">{request.description}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            Move: <span className="text-foreground font-semibold">{request.move_date || "-"}</span>
          </span>
          <span>
            Delivery:{" "}
            <span className="text-foreground font-semibold">{request.delivery_date || "-"}</span>
          </span>
          <span>
            Weight:{" "}
            <span className="text-foreground font-semibold">{request.freight_weight || "-"}</span>
          </span>
          <span>
            Storage:{" "}
            <span className="text-foreground font-semibold">{request.storage_size || "-"}</span>
          </span>
        </div>

        {request.additional_services?.length ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Additional Services
            </p>
            <div className="flex flex-wrap gap-1.5">
              {request.additional_services.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground text-[10px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="border-t border-white/5 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Your Details
          </p>
          <p className="text-sm">{request.contact_name || "-"}</p>
          <p className="text-sm text-muted-foreground">{request.company || ""}</p>
          <p className="text-sm text-muted-foreground">{request.contact_email || ""}</p>
          <p className="text-sm text-muted-foreground">{request.contact_phone || ""}</p>
          {request.video_url && (
            <a
              href={request.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6FE5FF] hover:underline font-semibold text-sm mt-1 inline-block"
            >
              View Uploaded Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
