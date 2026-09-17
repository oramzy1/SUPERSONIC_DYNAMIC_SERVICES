import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileClock,
  CheckSquare,
  Banknote,
  Search,
  Download,
  FileSearch,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { quotesApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";

export const Route = createFileRoute("/_auth/adminquotes/")({
  component: RouteComponent,
});

const STATUS_FILTERS = ["All", "pending", "quoted", "accepted", "counter_offered", "rejected"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#E2A54A]/5 border-[#E2A54A]/20 text-[#E2A54A]",
  quoted: "bg-blue-500/5 border-blue-500/20 text-blue-400",
  accepted: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400",
  counter_offered: "bg-violet-500/5 border-violet-500/20 text-violet-400",
  rejected: "bg-rose-500/5 border-rose-500/20 text-rose-400",
};

function initials(name?: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function RouteComponent() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;


  const statusParam = filter === "All" ? undefined : filter;

  const REAL_STATUSES = STATUS_FILTERS.filter((s) => s !== "All");

const { data: requests = [], isLoading } = useQuery({
  queryKey: ["admin", "quotes", statusParam],
  queryFn: async () => {
    if (!statusParam) {
      const results = await Promise.all(
        REAL_STATUSES.map((s) => quotesApi.listRequests(s)),
      );
      return results.flat();
    }
    return quotesApi.listRequests(statusParam);
  },
});

  // Always unfiltered, powers the metric cards regardless of which tab is
  // active — same fix as the earlier metrics bug: don't derive counts from
  // a query that's already scoped to one status.
  const { data: allRequests = [] } = useQuery({
    queryKey: ["admin", "quotes", "all"],
    queryFn: () => quotesApi.listRequests(),
  });

  const pendingCount = allRequests.filter((r) => r.status === "pending").length;
  const quotedCount = allRequests.filter((r) => r.status === "quoted").length;
  const acceptedCount = allRequests.filter((r) => r.status === "accepted").length;

  const metrics: {
    title: string;
    value: string;
    subtext: string;
    icon: ComponentType<{ className?: string }>;
  }[] = [
    { title: "TOTAL PENDING", value: String(pendingCount), subtext: "Requiring immediate review", icon: FileClock },
    { title: "AWAITING CUSTOMER", value: String(quotedCount), subtext: "Quoted, pending accept/reject", icon: CheckSquare },
    { title: "APPROVED", value: String(acceptedCount), subtext: "Accepted by customers", icon: Banknote },
  ];

  const filtered = query
    ? requests.filter((r) => {
        const q = query.toLowerCase();
        return (
          String(r.id).includes(q) ||
          (r.company ?? "").toLowerCase().includes(q) ||
          (r.contact_name ?? "").toLowerCase().includes(q) ||
          r.move_type.toLowerCase().includes(q)
        );
      })
    : requests;

  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  


  return (
    <div className="w-full text-slate-300 select-none pb-12">
      <Breadcrumbs items={[{ label: "Quotes" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Quotes Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review, generate, and manage inbound logistics service requests.
          </p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/5 transition duration-150">
          <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {metrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col justify-between h-36">
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{card.title}</span>
                <div className="p-1.5 bg-white/2 rounded-lg border border-white/6 text-[#E2A54A]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-3xl font-bold text-white tracking-tight font-mono">{card.value}</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl overflow-hidden flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-white/6">
          <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-lg border border-white/6 text-xs font-medium text-slate-400 overflow-x-auto max-w-full w-fit">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setPage(1); }}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                  filter === s
                    ? "bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/10 font-semibold"
                    : "hover:text-slate-200"
                }`}
              >
                {s === "All" ? "All Quotes" : s[0].toUpperCase() + s.slice(1).replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="flex flex-1 lg:w-64 items-center gap-2 rounded-lg bg-black/20 px-3 py-1.5 border border-white/6">
            <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search ID, Company or Route..."
              className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-225 text-left border-collapse">
            <thead>
              <tr className="border-b border-white/4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                <th className="py-4 px-6">QUOTE ID</th>
                <th className="py-4 px-6">CUSTOMER</th>
                <th className="py-4 px-6">SERVICE TYPE</th>
                <th className="py-4 px-6">REQUEST DATE</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-14 px-6 text-center text-xs text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin inline-block mr-2 text-[#E2A54A]" />
                    Loading quote requests...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="p-2.5 bg-white/2 rounded-lg border border-white/6 text-slate-500 mb-1">
                        <FileSearch className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">No quote requests found</p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Requests from customers will land here for you to review and quote.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((row) => {
                  const customer = row.company || row.contact_name || row.contact_email || "Unnamed";
                  return (
                    <tr
                      key={row.id}
                      onClick={() => navigate({ to: "/adminquotes/$quoteId", params: { quoteId: String(row.id) } })}
                      className="hover:bg-white/2 transition duration-150 cursor-pointer group align-top"
                    >
                      <td className="py-3.5 px-6 font-mono font-bold text-[#E2A54A]/80 text-xs">#{row.id}</td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm">
                            {initials(row.contact_name || row.company)}
                          </div>
                          <span className="text-xs font-semibold text-slate-200">{customer}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="text-xs font-medium text-slate-400">{row.move_type}</span>
                      </td>
                      <td className="py-3.5 px-6 text-xs font-medium text-slate-400">
                        {formatDate(row.created_at)}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider uppercase ${
                            STATUS_STYLES[row.status] || "bg-white/4 text-slate-400 border-white/4"
                          }`}
                        >
                          {row.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-[#E2A54A] text-[10px] font-bold uppercase">
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/6 bg-white/1">
         <span className="text-xs text-slate-500 font-medium">
  Showing <span className="text-slate-400 font-semibold">{paginated.length}</span> of{" "}
  <span className="text-slate-400 font-semibold">{filtered.length}</span> requests
</span>
<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}