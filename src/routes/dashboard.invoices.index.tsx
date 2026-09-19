import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, ChevronRight, FileSearch } from "lucide-react";
import { invoicesApi, mapPdfError, openBlobInNewTab } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/shared/Pagination";

export const Route = createFileRoute("/dashboard/invoices/")({
  component: InvoicesPage,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", year: "numeric" });
}

async function handlePay(invoiceId: number) {
  try {
    const { checkout_url } = await invoicesApi.pay(invoiceId, `${window.location.origin}/payment/success`);
    window.location.href = checkout_url;
  } catch (err) {
    console.error("Payment failed:", err);
  }
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
      console.error(mapPdfError(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <button onClick={download} disabled={busy} className="grid h-8 w-8 place-items-center rounded-md bg-white/5 text-muted-foreground hover:text-foreground disabled:opacity-50">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
    </button>
  );
}

function InvoicesPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
const [page, setPage] = useState(1);
const PAGE_SIZE = 15;

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => invoicesApi.list(),
  });

  const statusOptions = ["All", ...Array.from(new Set(invoices.map((i) => i.status)))];
  const visible = statusFilter === "All" ? invoices : invoices.filter((i) => i.status === statusFilter);
const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
const paginated = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const paid = invoices.filter((i) => i.status.toLowerCase() === "paid");
  const pending = invoices.filter((i) => i.status.toLowerCase() === "pending" || i.status.toLowerCase() === "overdue");

  const SUMMARY = [
    { label: "Total Outstanding", value: `€${pending.reduce((s, i) => s + parseFloat(i.total_amount), 0).toFixed(2)}`, sub: `${pending.length} pending` },
    { label: "Total Paid", value: `€${paid.reduce((s, i) => s + parseFloat(i.total_amount), 0).toFixed(2)}`, sub: `${paid.length} invoices` },
    { label: "Total Invoices", value: String(invoices.length), sub: "All time" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: "Invoices" }]} />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Financial Hub</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">Invoices</h1>
        </div>
        <div className="inline-flex flex-wrap rounded-full bg-surface p-1">
          {statusOptions.map((s) => (
            <button key={s}
onClick={() => { setStatusFilter(s); setPage(1); }}
              className={cn("rounded-full px-5 py-2 text-sm font-medium transition capitalize",
                statusFilter === s ? "bg-white text-[#0E141A]" : "text-muted-foreground hover:text-foreground")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {SUMMARY.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl bg-surface p-6">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <div className="mt-4 flex items-baseline gap-2"><p className="font-display text-3xl font-bold">{s.value}</p></div>
            <p className="mt-3 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-surface">
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <h2 className="font-display text-lg font-semibold">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">Loading invoices...</td></tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2"><FileSearch className="h-4 w-4" /> No invoices found.</div>
                  </td>
                </tr>
              ) : (
                paginated.map((inv) => {
                  const needsPay = inv.status.toLowerCase() === "pending" || inv.status.toLowerCase() === "overdue" || inv.status.toLowerCase() === "draft";
                  return (
                    <tr key={inv.id} onClick={() => navigate({ to: "/dashboard/invoices/$invoiceId", params: { invoiceId: String(inv.id) } })}
                      className="text-sm hover:bg-white/[0.02] cursor-pointer">
                      <td className="px-6 py-5 font-medium text-[#6FE5FF]">{inv.invoice_number}</td>
                      <td className="px-6 py-5 text-muted-foreground">{formatDate(inv.created_at)}</td>
                      <td className="px-6 py-5 capitalize">{inv.invoice_type}</td>
                      <td className="px-6 py-5 font-semibold">€{inv.total_amount}</td>
                      <td className="px-6 py-5">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                          inv.status.toLowerCase() === "paid" ? "bg-primary text-primary-foreground" :
                          inv.status.toLowerCase() === "overdue" ? "bg-red-500/90 text-white" :
                          inv.status.toLowerCase() === "cancelled" ? "bg-white/10 text-foreground/60" :
                          "bg-[#3B82F6] text-white")}>
                          <span className="h-1.5 w-1.5 rounded-full bg-white" /> {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {needsPay && (
                            <button onClick={() => handlePay(inv.id)}
                              className="rounded-md bg-[#3B82F6]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9DB4FE] hover:bg-[#3B82F6]/30">
                              Pay Now
                            </button>
                          )}
                          <DownloadButton invoiceId={inv.id} />
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
  <span className="text-xs text-muted-foreground">
    Showing <span className="text-foreground font-medium">{paginated.length}</span> of{" "}
    <span className="text-foreground font-medium">{invoices.length}</span> invoices
  </span>
  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
</div>
      </div>
    </div>
  );
}