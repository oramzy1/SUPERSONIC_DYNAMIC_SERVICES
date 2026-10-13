import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  FileSearch,
  Download,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { invoicesApi, mapPdfError, openBlobInNewTab } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { showErrorText } from "@/lib/toast";

export const Route = createFileRoute("/_auth/admininvoices/")({
  component: RouteComponent,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DownloadButton({ invoiceId }: { invoiceId: number }) {
  const [busy, setBusy] = useState(false);
  const download = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setBusy(true);
    try {
      const blob = await invoicesApi.downloadPdf(invoiceId);
      await openBlobInNewTab(blob);
    } catch (err) {
      showErrorText(mapPdfError(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <button
      onClick={download}
      disabled={busy}
      className="grid h-7 w-7 place-items-center rounded-md bg-white/4 text-slate-400 hover:text-foreground disabled:opacity-50"
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function RouteComponent() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const PAGE_SIZE = 15;

  // Assumes GET /invoices returns ALL invoices for an admin/staff token (the
  // same scoping ambiguity flagged for /quotes and /jobs earlier) rather
  // than only invoices belonging to the logged-in admin.
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["admin", "invoices"],
    queryFn: () => invoicesApi.list(),
  });

  const statusOptions = ["All", ...Array.from(new Set(invoices.map((i) => i.status)))];
  const filtered =
  statusFilter === "All" ? invoices : invoices.filter((i) => i.status === statusFilter);
const visible = [...filtered].sort((a, b) => {
  const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  // Tie-break on id so same-timestamp invoices keep a stable order.
  const result = diff !== 0 ? diff : a.id - b.id;
  return sortDir === "desc" ? -result : result;
});

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paginated = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const paid = invoices.filter((i) => i.status.toLowerCase() === "sent");
  const outstanding = invoices.filter((i) => i.status.toLowerCase() !== "sent");
  const failed = invoices.filter(
    (i) => i.status.toLowerCase().includes("fail") || i.status.toLowerCase().includes("cancelled"),
  );

  const sum = (list: typeof invoices) =>
    list.reduce((s, i) => s + parseFloat(i.total_amount || "0"), 0);

  const now = new Date();
  const paidThisMonth = paid.filter((i) => {
    const d = new Date(i.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const metrics = [ 
    {
      title: "TOTAL OUTSTANDING",
      value: `€${sum(outstanding).toFixed(2)}`,
      subtext: `${outstanding.length} invoices`,
      icon: Wallet,
    },
    {
      title: "REVENUE THIS MONTH",
      value: `€${sum(paidThisMonth).toFixed(2)}`,
      subtext: "Paid invoices created this month",
      icon: TrendingUp,
    },
    {
      title: "FAILED/CANCELLED PAYMENTS",
      value: String(failed.length),
      subtext: `€${sum(failed).toFixed(2)} total value`,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="w-full text-foreground/80 select-none pb-12">
      <Breadcrumbs items={[{ label: "Invoices" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Financial Tracking</h1>
          <p className="text-sm text-slate-400 mt-1">Track payments and monitor revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {metrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-surface backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col justify-between h-34"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-foreground/60 uppercase">
                  {card.title}
                </span>
                <div className="text-foreground/60">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-2xl font-bold tracking-tight font-mono text-foreground">
                  {card.value}
                </h3>
                <p className="text-[11px] font-medium text-foreground/60 mt-1">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-surface backdrop-blur-md border border-white/6 rounded-xl overflow-hidden flex flex-col mb-6">
        <div className="flex items-center justify-between gap-4 p-5 border-b border-white/6">
          <h2 className="text-sm font-bold text-foreground tracking-tight">Invoices</h2>
          <div className="flex items-center gap-3 min-w-0">
             <button
      onClick={() => {
        setSortDir((d) => (d === "desc" ? "asc" : "desc"));
        setPage(1);
      }}
      className="flex shrink-0 items-center gap-1.5 rounded-xs border border-white/6 bg-surface px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-foreground/80"
    >
      {sortDir === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUp className="h-3.5 w-3.5" />
      )}
      {sortDir === "desc" ? "Newest first" : "Oldest first"}
    </button>
            <div className="flex items-center bg-surface p-1 rounded-xs border border-white/6 text-[10px] font-bold uppercase tracking-wider text-slate-400 overflow-x-auto">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-md whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/10"
                    : "hover:text-foreground/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-175 text-left border-collapse">
            <thead>
              <tr className="border-b border-white/4 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/60">
                <th className="py-4 px-6">INVOICE #</th>
                <th className="py-4 px-6">TYPE</th>
                <th className="py-4 px-6">AMOUNT</th>
                <th className="py-4 px-6">CREATED</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">RELATED</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-14 px-6 text-center text-foreground/60">
                    Loading invoices...
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="p-2.5 bg-white/2 rounded-xs border border-white/6 text-foreground/60 mb-1">
                        <FileSearch className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">No invoices found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() =>
                      navigate({
                        to: "/admininvoices/$invoiceId",
                        params: { invoiceId: String(row.id) },
                      })
                    }
                    className="hover:bg-white/2 transition cursor-pointer"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-foreground/60">
                      {row.invoice_number}
                    </td>
                    <td className="py-4 px-6 text-slate-400 capitalize">{row.invoice_type}</td>
                    <td className="py-4 px-6 font-mono font-bold text-foreground">
                      €{row.total_amount}
                    </td>
                    <td className="py-4 px-6 text-slate-400">{formatDate(row.created_at)}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          row.status.toLowerCase() === "sent"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : row.status.toLowerCase().includes("draft")
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-amber-500/10 text-[#E2A54A]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {row.job_id && (
                        <Link
                          to="/adminjobs/$jobId"
                          params={{ jobId: String(row.job_id) }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#E2A54A] hover:underline block"
                        >
                          Job #{row.job_id}
                        </Link>
                      )}
                      {row.quote_number && (
                        <span className="block text-foreground/60">{row.quote_number}</span>
                      )}
                      {!row.job_id && !row.quote_number && "-"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DownloadButton invoiceId={row.id} />
                        <span className="inline-flex items-center gap-1 text-[#E2A54A] text-[9px] font-bold uppercase">
                          Details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/6 bg-white/1">
          <span className="text-xs text-foreground/60">
            Showing <span className="text-foreground/70 font-medium">{paginated.length}</span> of{" "}
            <span className="text-foreground/70 font-medium">{invoices.length}</span> invoices
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
