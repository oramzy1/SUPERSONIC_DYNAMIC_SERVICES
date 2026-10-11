import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Loader2,
  Wand2,
  XCircle,
  ArrowLeftRight,
  CheckCircle2,
  Truck,
  FileSignature,
  Receipt,
} from "lucide-react";
import { accountApi, quotesApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { GenerateQuoteModal } from "@/components/admin/GeneralQuoteModal";
import { QuoteLineItem } from "@/lib/api-types";
import { showError, showSuccess } from "@/lib/toast";

export const Route = createFileRoute("/_auth/adminquotes/$quoteId")({
  component: QuoteDetailPage,
});

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#E2A54A]/5 border-[#E2A54A]/20 text-[#E2A54A]",
  quoted: "bg-blue-500/5 border-blue-500/20 text-blue-400",
  accepted: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400",
  counter_offered: "bg-violet-500/5 border-violet-500/20 text-violet-400",
  rejected: "bg-rose-500/5 border-rose-500/20 text-rose-400",
};

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function QuoteDetailPage() {
  const { quoteId } = Route.useParams();
  const id = Number(quoteId);
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["admin", "quotes", "all"],
    queryFn: () => quotesApi.listAllRequests(),
  });
  const row = requests.find((r) => r.id === id);

  // Fetch unconditionally now - previously gated on `row` existing, which
  // meant a request/quote id mismatch (they may be different id spaces per
  // the spec) silently hid a real quote instead of showing it.
  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ["admin", "quote-detail", id],
    queryFn: () => quotesApi.get(id),
    retry: false,
  });

  const { data: me } = useQuery({
    queryKey: ["account", "me"],
    queryFn: () => accountApi.getProfile(),
    staleTime: 5 * 60_000,
  });

  const generateMutation = useMutation({
    mutationFn: ({
      amount,
      days,
      lineItems,
    }: {
      amount: string;
      days: number;
      lineItems?: QuoteLineItem[];
    }) => quotesApi.generateQuote(id, { amount, valid_until_days: days, line_items: lineItems }),
    onSuccess: () => {
      setGenerating(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "quotes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "quote-detail", id] });
      showSuccess("Quote sent - awaiting customer response.");
    },
    onError: (err) => showError(err, "Failed to send quote."),
  });

  const rejectMutation = useMutation({
    mutationFn: () => quotesApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "quotes"] });
      showSuccess("Quote request rejected.");
    },
    onError: (err) => showError(err, "Failed to reject quote."),
  });

  const acceptMutation = useMutation({
    mutationFn: () => quotesApi.accept(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "quotes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "quote-detail", id] });
      showSuccess(
        `Counter offer accepted - contract #${res.contract_id} (${res.contract_status}).`,
      );
    },
    onError: (err) => showError(err, "Failed to accept counter offer."),
  });

  if (requestsLoading || quoteLoading) {
    return (
      <div className="w-full text-foreground/70">
        <Breadcrumbs
          items={[{ label: "Quotes", to: "/adminquotes" }, { label: `Quote #${quoteId}` }]}
        />
        <p className="text-sm text-foreground/80">Loading request...</p>
      </div>
    );
  }

  if (!row && !quote) {
    return (
      <div className="w-full text-foreground/80">
        <Breadcrumbs
          items={[{ label: "Quotes", to: "/adminquotes" }, { label: `Quote #${quoteId}` }]}
        />
        <div className="bg-surface border border-white/6 rounded-xs p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E2A54A]/10 border border-[#E2A54A]/20">
            <span className="text-[#E2A54A] text-lg">!</span>
          </div>
          <h2 className="text-sm font-semibold text-foreground/80">Quote Not Found</h2>
          <p className="mt-2 text-sm text-foreground/70 max-w-md mx-auto">
            No quote request or generated quote exists with this ID.
          </p>
          <div className="mt-5">
            <Link
              to="/adminquotes"
              className="inline-flex items-center justify-center rounded-xs bg-[#E2A54A]/10 border border-[#E2A54A]/20 px-4 py-2 text-xs font-semibold text-[#E2A54A] hover:bg-[#E2A54A]/20 transition"
            >
              Back to Quotes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = row?.status ?? quote?.status ?? "";
  const latestCounter = quote?.counter_offers?.length
    ? quote.counter_offers[quote.counter_offers.length - 1]
    : null;

  // The admin only acts when the last move wasn't theirs.
  const awaitingAdmin =
    status === "counter_offered" && !!latestCounter && latestCounter.offered_by !== me?.id;

  const canGenerate = status === "pending" || awaitingAdmin; // first price only
  const canAccept = awaitingAdmin;
  const canReject = status === "pending" || status === "quoted" || awaitingAdmin;
  const modalTitle =
    status === "counter_offered"
      ? "Send New Offer"
      : status === "quoted"
        ? "Re-quote"
        : "Generate Quote";

  return (
    <div className="w-full text-foreground/80 select-none pb-12">
      <Breadcrumbs items={[{ label: "Quotes", to: "/adminquotes" }, { label: `Quote #${id}` }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">Quote #{id}</h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-xs border text-[9px] font-bold tracking-wider uppercase ${STATUS_STYLES[status] || "bg-white/4 text-slate-400 border-white/4"}`}
            >
              {status.replace("_", " ")}
            </span>
          </div>
          {row && (
            <p className="text-sm text-foreground/60 mt-1">
              {row.move_type.replace("-", " ")} · Requested {formatDate(row.created_at)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* {canAccept && (
            <button
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-xs hover:bg-emerald-500/10 transition duration-150 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3 h-3" /> Accept €{latestCounter?.amount}
            </button>
          )} */}
          {canReject && (
            <button
              onClick={() => rejectMutation.mutate()}
              disabled={rejectMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-xs hover:bg-rose-500/10 transition duration-150 disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" /> Reject
            </button>
          )}
          {canGenerate && (
            <button
              onClick={() => setGenerating(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E2A54A] text-slate-950 text-[10px] font-bold rounded-xs hover:bg-[#d4963b] transition duration-150"
            >
              <Wand2 className="w-3 h-3" /> {modalTitle}
            </button>
          )}
        </div>
      </div>

      {status === "accepted" && quote && (
        <div className="mb-6 rounded-xs border border-emerald-500/20 bg-surface p-5 space-y-3">
          <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Quote accepted
          </p>
          <div className="flex flex-wrap gap-3">
            {quote.job_id && (
              <Link
                to="/adminjobs/$jobId"
                params={{ jobId: String(quote.job_id) }}
                className="flex items-center gap-1.5 text-xs font-bold text-foreground/70 bg-white/10 hover:bg-white/15 rounded-xs px-3 py-2"
              >
                <Truck className="w-3.5 h-3.5" /> View Job #{quote.job_id}
              </Link>
            )}
            {quote.contract_id && (
              <Link
                to="/admincontracts/$contractId"
                params={{ contractId: String(quote.contract_id) }}
                className="flex items-center gap-1.5 text-xs font-bold text-foreground/70 bg-white/10 hover:bg-white/15 rounded-xs px-3 py-2"
              >
                <FileSignature className="w-3.5 h-3.5" /> Contract (
                {(quote.contract_status ?? "sent").replace("_", " ")})
              </Link>
            )}
            {quote.invoice_id && (
              <Link
                to="/admininvoices/$invoiceId"
                params={{ invoiceId: String(quote.invoice_id) }}
                className="flex items-center gap-1.5 text-xs font-bold text-foreground/70 bg-white/10 hover:bg-white/15 rounded-xs px-3 py-2"
              >
                <Receipt className="w-3.5 h-3.5" /> Invoice {quote.invoice_number ?? ""}
              </Link>
            )}
          </div>
        </div>
      )}

      {status === "counter_offered" && latestCounter && (
        <div className="mb-6 rounded-xs border border-violet-500/20 bg-violet-500/5 p-5">
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <ArrowLeftRight className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              {latestCounter.offered_by === me?.id
                ? "Your Counter Offer - awaiting customer"
                : "Customer Counter Offer"}
            </h3>
          </div>
          <p className="text-2xl font-bold font-mono text-white">€{latestCounter.amount}</p>
          <p className="text-xs text-foreground/60 mt-1">
            {latestCounter.offered_by_name || `User #${latestCounter.offered_by}`} ·{" "}
            {formatDate(latestCounter.created_at)}
          </p>
          {latestCounter.message && (
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{latestCounter.message}</p>
          )}
          {latestCounter.offered_by !== me?.id && quote && (
            <p className="text-xs text-foreground/60 mt-3 border-t border-white/5 pt-3">
              Your last quoted price:{" "}
              <span className="text-slate-300 font-semibold">€{quote.total_price}</span>
            </p>
          )}
          {awaitingAdmin && (
            <p className="text-xs text-violet-300/80 mt-3 border-t border-violet-500/10 pt-3">
              {quote?.line_items?.length
                ? "Revise the line items to reflect your new price. Quotes sent to customers should carry a breakdown."
                : "Your last quote had no line items. Add a breakdown to your new offer so the customer can see what the price covers."}
            </p>
          )}
        </div>
      )}

      {quote?.line_items?.length ? (
        <div className="mb-6 bg-surface border border-white/6 rounded-xs p-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 mb-3">
            {status === "counter_offered" ? "Your Last Quote" : "Quote Breakdown"}
          </p>
          <div className="divide-y divide-white/5">
            {quote.line_items.map((li, i) => (
              <div key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="text-foreground/70">{li.description}</span>
                <span className="font-mono text-foreground/80">€{li.amount}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 mt-1 border-t border-white/6 text-sm font-bold">
            <span>Total</span>
            <span className="font-mono">€{quote.total_price}</span>
          </div>
        </div>
      ) : null}

      {row && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-surface border border-white/6 rounded-xs p-6 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                Route
              </p>
              <p className="flex items-center gap-1.5 text-sm text-foreground/70">
                <MapPin className="w-3.5 h-3.5 text-foreground/70" /> {row.address_from} {"→"}{" "}
                {row.address_to}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                Description
              </p>
              <p className="text-sm text-foreground/60 italic leading-relaxed">{row.description}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="text-foreground/80">
                Move:{" "}
                <span className="text-foreground/60 font-semibold">{row.move_date || "-"}</span>
              </span>
              {row.delivery_date && (
                <span className="text-foreground/80">
                  Delivery:{" "}
                  <span className="text-foreground/60 font-semibold">
                    {row.delivery_date || "-"}
                  </span>
                </span>
              )}
              {row.freight_weight && (
                <span className="text-foreground/80">
                  Weight:{" "}
                  <span className="text-foreground/60 font-semibold">
                    {row.freight_weight || "-"}
                  </span>
                </span>
              )}
              {row.storage_size && (
                <span className="text-foreground/80">
                  Storage:{" "}
                  <span className="text-foreground/60 font-semibold">
                    {row.storage_size || "-"}
                  </span>
                </span>
              )}
            </div>
            {row.additional_services?.length ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                  Additional Services
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {row.additional_services.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-xs bg-white/4 border border-white/6 text-slate-400 text-[10px]"
                    >
                      {s.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {quote?.pdf_url && (
              <div className="border-t border-white/5 pt-4">
                <a
                  href={quote.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E2A54A] hover:underline text-xs font-semibold"
                >
                  View Generated Quote PDF
                </a>
              </div>
            )}
          </div>

          <div className="bg-surface border border-white/6 rounded-xs p-6 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/80 mb-2">
              Contact
            </p>
            <p className="text-foreground/60">{row.contact_name || "-"}</p>
            <p className="text-foreground/60">{row.company || ""}</p>
            <p className="text-foreground/60">{row.contact_email || ""}</p>
            <p className="text-foreground/60">{row.contact_phone || ""}</p>
            {row.video_url && (
              <a
                href={row.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E2A54A] hover:underline font-semibold text-sm mt-2 inline-block"
              >
                View Video Walkthrough
              </a>
            )}
          </div>
        </div>
      )}

      {!row && quote && (
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xs p-6 text-sm text-foreground/60">
          This quote's originating request details aren't available - showing pricing only. Quote{" "}
          {quote.quote_number}: €{quote.total_price}, valid until {formatDate(quote.valid_until)}.
        </div>
      )}

      {generating && row && (
        <GenerateQuoteModal
          quote={row}
          busy={generateMutation.isPending}
          title={modalTitle}
          initialAmount={status === "counter_offered" ? latestCounter?.amount : undefined}
          initialLineItems={status === "counter_offered" ? quote?.line_items : undefined}
          onClose={() => setGenerating(false)}
          onSubmit={(amount, days, lineItems) =>
            generateMutation.mutate({ amount, days, lineItems })
          }
        />
      )}
    </div>
  );
}
