// import { createFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import { MapPin, ChevronUp, ChevronDown, Search } from "lucide-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import type { QuoteResponse, QuoteRequestResponse } from "@/lib/api-types";
// import { quotesApi } from "@/lib/api";
// import { cn } from "@/lib/utils";

// export const Route = createFileRoute("/dashboard/quotes")({
//   component: QuotesPage,
// });

// function QuoteActionCell({ requestId, onToast }: { requestId: number;  onToast: (t: { type: "success" | "error"; message: string }) => void; }) {
//   const queryClient = useQueryClient();
//   const { data: quote, isLoading } = useQuery({
//     queryKey: ["quote-detail", requestId],
//     queryFn: () => quotesApi.get(requestId),
//   });
//   const [countering, setCountering] = useState(false);
// const [counterAmount, setCounterAmount] = useState("");

// const downloadPdf = async () => {
//   try {
//     const blob = await quotesApi.downloadPdf(requestId);
//     const url = URL.createObjectURL(blob);
//     window.open(url, "_blank");
//   } catch (err) {
//     onToast({ type: "error", message: mapPdfError(err) });
//   }
// };

// const counter = async () => {
//   try {
//     await quotesApi.counterOffer(requestId, { amount: counterAmount });
//     queryClient.invalidateQueries({ queryKey: ["quotes"] });
//     onToast({ type: "success", message: "Counter offer sent." });
//     setCountering(false);
//   } catch (err) {
//     onToast({ type: "error", message: "Failed to send counter offer." });
//   }
// };
//   const accept = async () => {
//     try {
//       await quotesApi.accept(requestId);
//       queryClient.invalidateQueries({ queryKey: ["quotes"] });
//       queryClient.invalidateQueries({ queryKey: ["jobs"] });
//       onToast({ type: "success", message: "Quote accepted - check the Jobs tab for tracking." });
//     } catch (err: unknown) {
//       onToast({ type: "error", message: (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to accept quote." });
//     }
//   };
//   const reject = async () => {
//     try {
//       await quotesApi.reject(requestId);
//       queryClient.invalidateQueries({ queryKey: ["quotes"] });
//       onToast({ type: "success", message: "Quote declined." });
//     } catch (err: unknown) {
//       onToast({ type: "error", message: (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to decline quote." });
//     }
//   };

//   if (isLoading) return <span className="text-xs text-muted-foreground">Loading quote…</span>;
//   if (!quote) return <span className="text-xs text-muted-foreground">-</span>;

//   return (
//     <div className="flex items-center gap-3">
//       <span className="font-semibold">€{quote.total_price}</span>
//       <span className="text-[10px] text-muted-foreground">
//         valid until {new Date(quote.valid_until).toLocaleDateString("nl-NL")}
//       </span>
//       {quote.pdf_url && (
//         <a
//           href={quote.pdf_url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-[#6FE5FF] text-xs underline"
//         >
//           PDF
//         </a>
//       )}
//       <button
//         onClick={accept}
//         className="rounded-md bg-primary/20 px-3 py-1.5 text-[10px] font-bold uppercase text-primary hover:bg-primary/30"
//       >
//         Accept
//       </button>
//       <button
//         onClick={reject}
//         className="rounded-md bg-red-500/15 px-3 py-1.5 text-[10px] font-bold uppercase text-red-400 hover:bg-red-500/25"
//       >
//         Decline
//       </button>
//     </div>
//   );
// }

// const TABS = ["All", "Pending", "Quotes", "Reviewed", "Accepted", "Expired"] as const;

// const STATUS_LABELS: Record<string, string> = {
//   pending: "Awaiting Review",
//   quoted: "Quote Ready - Action Needed",
//   accepted: "Accepted",
//   rejected: "Declined",
//   expired: "Expired",
// };

// const STATUS_STYLES: Record<string, string> = {
//   pending: "bg-[#6FE5FF]/5 border-[#6FE5FF]/20 text-[#6FE5FF]",
//   reviewed: "bg-blue-500/5 border-blue-500/20 text-blue-400",
//   accepted: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400",
//   rejected: "bg-rose-500/5 border-rose-500/20 text-rose-400",
//   expired: "bg-white/5 border-white/20 text-foreground/70",
// };

// function formatDate(iso?: string | null): string {
//   if (!iso) return "-";
//   return new Date(iso).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", year: "numeric" });
// }

// function StatusBadge({ status }: { status: string }) {
//   return (
//     <span className={cn(
//       "inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider uppercase",
//       STATUS_STYLES[status] || "bg-white/4 text-slate-400 border-white/4",
//     )}>
//       {STATUS_LABELS[status] ?? status}
//     </span>
//   );
// }

// function QuotesPage() {
//   const [tab, setTab] = useState<(typeof TABS)[number]>("All");
//   const [query, setQuery] = useState("");
//   const [expandedId, setExpandedId] = useState<number | null>(null);
//   const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

//   const { data: requests = [], isLoading } = useQuery({
//     queryKey: ["quotes"],
//     queryFn: () => quotesApi.list(),
//   });

//     const byTab = tab === "All" ? requests : requests.filter((q) => q.status === tab.toLowerCase());
//   const filtered = query
//     ? byTab.filter((q) => {
//         const s = query.toLowerCase();
//         return (
//           String(q.id).includes(s) ||
//           q.move_type.toLowerCase().includes(s) ||
//           (q.address_from ?? "").toLowerCase().includes(s) ||
//           (q.address_to ?? "").toLowerCase().includes(s)
//         );
//       })
//     : byTab;

//   const handleAccept = async (quote: QuoteResponse) => {
//     try {
//       await quotesApi.accept(quote.id);
//       window.location.reload();
//     } catch (err) {
//       console.error("Failed to accept quote:", err);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-6xl">
//       {toast && (
//       <div className={cn(
//         "fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border",
//         toast.type === "success" ? "bg-surface border-emerald-500/30 text-emerald-400" : "bg-surface border-rose-500/30 text-rose-400",
//       )}>
//         {toast.message}
//       </div>
//     )}
//       <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
//         <div>
//           <h1 className="font-display text-3xl font-bold md:text-5xl">Quote History</h1>
//           <p className="mt-3 max-w-md text-sm text-muted-foreground">
//             Track your logistic efficiency and manage upcoming fleet deployments.
//           </p>
//         </div>
//               <div className="flex items-center gap-3">
//                  <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 border border-white/6">
//           <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search ID or route..."
//             className="bg-transparent text-xs outline-none placeholder:text-muted-foreground w-40"
//           />
//         </div>
//               </div>
//         <div className="inline-flex rounded-full bg-surface p-1">
//           {TABS.map((t) => (
//             <button
//               key={t}
//               onClick={() => setTab(t)}
//               className={cn(
//                 "rounded-full px-5 py-2 text-sm font-medium transition",
//                 tab === t
//                   ? "bg-white text-[#0E141A]"
//                   : "text-muted-foreground hover:text-foreground",
//               )}
//             >
//               {t}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded-2xl bg-surface p-5">
//           <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
//             Total Quotes
//           </p>
//           <p className="mt-4 font-display text-3xl font-bold">{requests.length}</p>
//         </div>
//         <div className="rounded-2xl bg-surface p-5">
//           <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
//             Pending
//           </p>
//           <p className="mt-4 font-display text-3xl font-bold">
//             {requests.filter((q) => q.status === "pending").length}
//           </p>
//         </div>
//         <div className="rounded-2xl bg-surface p-5">
//           <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
//             Accepted
//           </p>
//           <p className="mt-4 font-display text-3xl font-bold">
//             {requests.filter((q) => q.status === "accepted").length}
//           </p>
//         </div>
//         <div className="rounded-2xl bg-surface p-5">
//           <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
//             Avg. Estimate
//           </p>
//           <p className="mt-4 font-display text-3xl font-bold">
//             €
//             {requests.length > 0
//               ? (
//                   requests.reduce((s, q) => s + parseFloat(q.total_price), 0) / requests.length
//                 ).toFixed(0)
//               : "0"}
//           </p>
//         </div>
//       </div>

//       <div className="mt-8 overflow-hidden rounded-2xl bg-surface">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[760px]">
//          <thead className="bg-white/[0.03]">
//   <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
//     <th className="px-6 py-4">Request #</th>
//     <th className="px-6 py-4">Route</th>
//     <th className="px-6 py-4">Submitted</th>
//     <th className="px-6 py-4">Status</th>
//     <th className="px-6 py-4 text-right">Action</th>
//   </tr>
// </thead>
// <tbody className="divide-y divide-white/5">
//   {isLoading ? (
//     <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">Loading...</td></tr>
//   ) : filtered.length === 0 ? (
//     <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">No quote requests found.</td></tr>
//   ) : (
//     filtered.map((q) => {
//       const expanded = expandedId === q.id;
//       return (
//         <>
//           <tr key={q.id} className="text-sm">
//             <td className="px-6 py-5 font-mono font-bold text-[#6FE5FF]/80">#{q.id}</td>
//             <td className="px-6 py-5">
//               <p className="font-medium capitalize">{q.move_type.replace("-", " ")}</p>
//               <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
//                 <MapPin className="w-2.5 h-2.5" /> {q.address_from} → {q.address_to}
//               </span>
//             </td>
//             <td className="px-6 py-5 text-muted-foreground">{formatDate(q.created_at)}</td>
//             <td className="px-6 py-5"><StatusBadge status={q.status} /></td>
//             <td className="px-6 py-5">
//               <div className="flex items-center justify-end gap-3">
//                 {q.status === "quoted" ? (
//                   <QuoteActionCell requestId={q.id} onToast={setToast} />
//                 ) : q.status === "accepted" ? (
//                   <a href="/dashboard/jobs" className="text-[#6FE5FF] hover:opacity-80 text-xs font-semibold">Track Job</a>
//                 ) : (
//                   <span className="text-xs text-muted-foreground">-</span>
//                 )}
//                 <button onClick={() => setExpandedId(expanded ? null : q.id)} className="text-muted-foreground hover:text-foreground">
//                   {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
//                 </button>
//               </div>
//             </td>
//           </tr>
//           {expanded && (
//             <tr className="bg-white/[0.02]">
//               <td colSpan={5} className="px-6 py-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
//                   <div className="space-y-1 md:col-span-2">
//                     <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Description</p>
//                     <p className="text-foreground/90 leading-relaxed">{q.description}</p>
//                     <div className="flex flex-wrap gap-3 mt-2 text-muted-foreground">
//                       <span>Move: <span className="text-foreground font-semibold">{q.move_date || "-"}</span></span>
//                       <span>Delivery: <span className="text-foreground font-semibold">{q.delivery_date || "-"}</span></span>
//                       <span>Weight: <span className="text-foreground font-semibold">{q.freight_weight || "-"}</span></span>
//                       <span>Storage: <span className="text-foreground font-semibold">{q.storage_size || "-"}</span></span>
//                     </div>
//                     {q.additional_services?.length ? (
//                       <div className="flex flex-wrap gap-1.5 mt-2">
//                         {q.additional_services.map((s, i) => (
//                           <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground text-[10px]">{s}</span>
//                         ))}
//                       </div>
//                     ) : null}
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Details</p>
//                     <p>{q.contact_name || "-"}</p>
//                     <p className="text-muted-foreground">{q.company || ""}</p>
//                     <p className="text-muted-foreground">{q.contact_email || ""}</p>
//                     {q.video_url && (
//                       <a href={q.video_url} target="_blank" rel="noopener noreferrer" className="text-[#6FE5FF] hover:underline font-semibold">
//                         View Uploaded Video
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           )}
//         </>
//       );
//     })
//   )}
// </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Search, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { QuoteRequestResponse } from "@/lib/api-types";
import { quotesApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";

export const Route = createFileRoute("/dashboard/quotes/")({
  component: QuotesPage,
});

const TABS = ["All", "Pending", "Quoted", "Accepted", "Rejected", "Expired"] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting Review",
  quoted: "Quote Ready - Action Needed",
  accepted: "Accepted",
  rejected: "Declined",
  expired: "Expired",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#6FE5FF]/5 border-[#6FE5FF]/20 text-[#6FE5FF]",
  quoted: "bg-blue-500/5 border-blue-500/20 text-blue-400",
  accepted: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400",
  rejected: "bg-rose-500/5 border-rose-500/20 text-rose-400",
  expired: "bg-white/5 border-white/20 text-foreground/70",
};

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider uppercase",
        STATUS_STYLES[status] || "bg-white/4 text-slate-400 border-white/4",
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function QuotesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [query, setQuery] = useState("");
const [page, setPage] = useState(1);
const PAGE_SIZE = 15;


  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => quotesApi.listRequests(),
  });

  const byTab = tab === "All" ? requests : requests.filter((q) => q.status === tab.toLowerCase());
  const filtered = query
    ? byTab.filter((q) => {
        const s = query.toLowerCase();
        return (
          String(q.id).includes(s) ||
          q.move_type.toLowerCase().includes(s) ||
          (q.address_from ?? "").toLowerCase().includes(s) ||
          (q.address_to ?? "").toLowerCase().includes(s)
        );
      })
    : byTab;


const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: "Quotes" }]} />

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-white text-3xl font-bold md:text-5xl">Quote History</h1>
          <p className="mt-3 max-w-md text-sm text-white">
            Track your logistic efficiency and manage upcoming fleet deployments.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 border border-white/6">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            value={query}
onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search ID or route..."
            className="bg-transparent text-xs outline-none placeholder:text-muted-foreground w-40"
          />
        </div>
        <div className="inline-flex flex-wrap rounded-full bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition",
                tab === t
                  ? "bg-primary text-[#ffffff]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Total Quotes
          </p>
          <p className="mt-4 font-display text-3xl font-bold">{requests.length}</p>
        </div>
        <div className="rounded-2xl bg-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Awaiting Your Action
          </p>
          <p className="mt-4 font-display text-3xl font-bold">
            {requests.filter((q) => q.status === "quoted").length}
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Accepted
          </p>
          <p className="mt-4 font-display text-3xl font-bold">
            {requests.filter((q) => q.status === "accepted").length}
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Pending Review
          </p>
          <p className="mt-4 font-display text-3xl font-bold">
            {requests.filter((q) => q.status === "pending").length}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-6 py-4">Request #</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No quote requests found.
                  </td>
                </tr>
              ) : (
                paginated.map((q: QuoteRequestResponse) => (
                  <tr key={q.id} className="text-sm hover:bg-white/[0.02]">
                    <td className="px-6 py-5 font-mono font-bold text-[#6FE5FF]/80">
                      <Link
                        to="/dashboard/quotes/$quoteId"
                        params={{ quoteId: String(q.id) }}
                        className="block"
                      >
                        #{q.id}
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        to="/dashboard/quotes/$quoteId"
                        params={{ quoteId: String(q.id) }}
                        className="block"
                      >
                        <p className="font-medium capitalize">{q.move_type.replace("-", " ")}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                          <MapPin className="w-2.5 h-2.5" /> {q.address_from} → {q.address_to}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-muted-foreground">
                      <Link
                        to="/dashboard/quotes/$quoteId"
                        params={{ quoteId: String(q.id) }}
                        className="block"
                      >
                        {formatDate(q.created_at)}
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        to="/dashboard/quotes/$quoteId"
                        params={{ quoteId: String(q.id) }}
                        className="block"
                      >
                        <StatusBadge status={q.status} />
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to="/dashboard/quotes/$quoteId"
                        params={{ quoteId: String(q.id) }}
                        className="inline-flex items-center gap-1 text-[#6FE5FF] hover:opacity-80 text-xs font-semibold"
                      >
                        {q.status === "quoted" ? "Review Quote" : "View Details"}{" "}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
  <span className="text-xs text-muted-foreground">
    Showing <span className="text-foreground font-medium">{paginated.length}</span> of{" "}
    <span className="text-foreground font-medium">{filtered.length}</span> requests
  </span>
  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
</div>
      </div>
    </div>
  );
}
