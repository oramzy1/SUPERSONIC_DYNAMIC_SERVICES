import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Loader2, Wand2, XCircle, ArrowLeftRight } from "lucide-react";
import { quotesApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { GenerateQuoteModal } from "@/components/admin/GeneralQuoteModal";

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

function errMsg(err: unknown): string {
  return (
    (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
    (err as Error)?.message ||
    "Request failed. Please try again."
  );
}

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function QuoteDetailPage() {
  const { quoteId } = Route.useParams();
  const id = Number(quoteId);
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  // No GET /quotes/request/{id} endpoint exists — reuse the same unfiltered
  // list query the index page's metrics use, and find this request in it.
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["admin", "quotes", "all"],
    queryFn: () => quotesApi.listRequests(),
  });
  const row = requests.find((r) => r.id === id);

  // Pricing/counter-offer history only exists once a quote has been
  // generated — fetch it for anything past "pending" so the admin can see
  // the customer's counter amount before acting on it.
  const { data: quote } = useQuery({
    queryKey: ["admin", "quote-detail", id],
    queryFn: () => quotesApi.get(id),
    enabled: !!row && row.status !== "pending",
  });

  const generateMutation = useMutation({
    mutationFn: ({ amount, days }: { amount: string; days: number }) =>
      quotesApi.generateQuote(id, { amount, valid_until_days: days }),
    onSuccess: () => {
      setGenerating(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "quotes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "quote-detail", id] });
      setToast({ type: "success", message: "Quote sent - awaiting customer response." });
    },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const rejectMutation = useMutation({
    mutationFn: () => quotesApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "quotes"] });
      setToast({ type: "success", message: "Quote request rejected." });
    },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  if (requestsLoading) {
    return (
      <div className="w-full text-slate-300">
        <Breadcrumbs items={[{ label: "Quotes", to: "/adminquotes" }, { label: `Quote #${quoteId}` }]} />
        <p className="text-sm text-slate-500">Loading request...</p>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="w-full text-slate-300">
        <Breadcrumbs items={[{ label: "Quotes", to: "/adminquotes" }, { label: `Quote #${quoteId}` }]} />
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-8 text-center text-sm text-slate-400">
          Quote request #{quoteId} wasn't found.
          <div className="mt-3">
            <Link to="/adminquotes" className="text-[#E2A54A] text-xs font-semibold hover:underline">
              Back to Quotes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canGenerate = row.status === "pending" || row.status === "quoted" || row.status === "counter_offered";
  const canReject = canGenerate;
  const latestCounter = quote?.counter_offers?.length ? quote.counter_offers[quote.counter_offers.length - 1] : null;

  const modalTitle =
    row.status === "counter_offered" ? "Send New Quote" : row.status === "quoted" ? "Re-quote" : "Generate Quote";

  return (
    <div className="w-full text-slate-300 select-none pb-12">
      <Breadcrumbs items={[{ label: "Quotes", to: "/adminquotes" }, { label: `Quote #${row.id}` }]} />

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border transition-all ${
            toast.type === "success"
              ? "bg-[#0c1017] border-emerald-500/30 text-emerald-400"
              : "bg-[#0c1017] border-rose-500/30 text-rose-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Quote #{row.id}</h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider uppercase ${
                STATUS_STYLES[row.status] || "bg-white/4 text-slate-400 border-white/4"
              }`}
            >
              {row.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {row.move_type.replace("-", " ")} · Requested {formatDate(row.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {canReject && (
            <button
              onClick={() => rejectMutation.mutate()}
              disabled={rejectMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md hover:bg-rose-500/10 transition duration-150 disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" /> Reject
            </button>
          )}
          {canGenerate && (
            <button
              onClick={() => setGenerating(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E2A54A] text-slate-950 text-[10px] font-bold rounded-md hover:bg-[#d4963b] transition duration-150"
            >
              <Wand2 className="w-3 h-3" /> {modalTitle}
            </button>
          )}
        </div>
      </div>

      {row.status === "counter_offered" && latestCounter && (
        <div className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <ArrowLeftRight className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Customer Counter Offer</h3>
          </div>
          <p className="text-2xl font-bold font-mono text-white">€{latestCounter.amount}</p>
          <p className="text-xs text-slate-500 mt-1">
            {latestCounter.offered_by_name || `User #${latestCounter.offered_by}`} · {formatDate(latestCounter.created_at)}
          </p>
          {latestCounter.message && (
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{latestCounter.message}</p>
          )}
          {quote && (
            <p className="text-xs text-slate-500 mt-3 border-t border-white/5 pt-3">
              Your last quoted price: <span className="text-slate-300 font-semibold">€{quote.total_price}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0d111a]/40 border border-white/6 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Route</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {row.address_from} {"→"} {row.address_to}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-300 leading-relaxed">{row.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <span className="text-slate-500">Move: <span className="text-slate-300 font-semibold">{row.move_date || "-"}</span></span>
            <span className="text-slate-500">Delivery: <span className="text-slate-300 font-semibold">{row.delivery_date || "-"}</span></span>
            <span className="text-slate-500">Weight: <span className="text-slate-300 font-semibold">{row.freight_weight || "-"}</span></span>
            <span className="text-slate-500">Storage: <span className="text-slate-300 font-semibold">{row.storage_size || "-"}</span></span>
          </div>

          {row.additional_services?.length ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Additional Services</p>
              <div className="flex flex-wrap gap-1.5">
                {row.additional_services.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/4 border border-white/6 text-slate-400 text-[10px]">{s}</span>
                ))}
              </div>
            </div>
          ) : null}

          {quote?.pdf_url && (
            <div className="border-t border-white/5 pt-4">
              <a href={quote.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[#E2A54A] hover:underline text-xs font-semibold">
                View Generated Quote PDF
              </a>
            </div>
          )}
        </div>

        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-6 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Contact</p>
          <p className="text-slate-300">{row.contact_name || "-"}</p>
          <p className="text-slate-500">{row.company || ""}</p>
          <p className="text-slate-500">{row.contact_email || ""}</p>
          <p className="text-slate-500">{row.contact_phone || ""}</p>
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

      {generating && (
        <GenerateQuoteModal
          quote={row}
          busy={generateMutation.isPending}
          title={modalTitle}
          initialAmount={row.status === "counter_offered" ? latestCounter?.amount : undefined}
          onClose={() => setGenerating(false)}
          onSubmit={(amount, days) => generateMutation.mutate({ amount, days })}
        />
      )}
    </div>
  );
}