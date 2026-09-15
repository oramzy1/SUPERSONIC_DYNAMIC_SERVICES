import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { invoicesApi, mapPdfError, openBlobInNewTab } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_auth/admininvoices/$invoiceId")({
  component: InvoiceDetailPage,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function InvoiceDetailPage() {
  const { invoiceId } = Route.useParams();
  const id = Number(invoiceId);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [downloading, setDownloading] = useState(false);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["admin", "invoice", id],
    queryFn: () => invoicesApi.get(id),
  });

  const download = async () => {
    setDownloading(true);
    try {
      const blob = await invoicesApi.downloadPdf(id);
      await openBlobInNewTab(blob);
    } catch (err) {
      setToast({ type: "error", message: mapPdfError(err) });
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-slate-200">
        <Breadcrumbs items={[{ label: "Invoices", to: "/admininvoices" }, { label: `Invoice #${invoiceId}` }]} />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading invoice...
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="w-full text-slate-200">
        <Breadcrumbs items={[{ label: "Invoices", to: "/admininvoices" }, { label: `Invoice #${invoiceId}` }]} />
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-8 text-center text-sm text-slate-400">
          Invoice not found.
          <div className="mt-3">
            <Link to="/admininvoices" className="text-[#E2A54A] text-xs font-semibold hover:underline">Back to Invoices</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-200 select-none pb-12">
      <Breadcrumbs items={[{ label: "Invoices", to: "/admininvoices" }, { label: invoice.invoice_number }]} />

      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border bg-[#0c1017] border-rose-500/30 text-rose-400">
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{invoice.invoice_number}</h1>
          <p className="text-sm text-slate-400 mt-1 capitalize">{invoice.invoice_type} · {formatDate(invoice.created_at)}</p>
        </div>
        <button
          onClick={download}
          disabled={downloading}
          className="flex items-center gap-2 rounded-lg bg-[#E2A54A] px-4 py-2 text-xs font-bold text-slate-950 hover:bg-[#d4963b] disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Download PDF
        </button>
      </div>

      <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-6 grid grid-cols-2 gap-4 text-sm max-w-xl">
        <div><p className="text-[10px] text-slate-500 uppercase mb-1">Amount</p><p className="font-mono font-bold text-white text-lg">€{invoice.total_amount}</p></div>
        <div><p className="text-[10px] text-slate-500 uppercase mb-1">Status</p><p className="text-slate-200 uppercase text-xs font-bold">{invoice.status}</p></div>
        <div><p className="text-[10px] text-slate-500 uppercase mb-1">Type</p><p className="text-slate-200 capitalize">{invoice.invoice_type}</p></div>
        <div><p className="text-[10px] text-slate-500 uppercase mb-1">Created</p><p className="text-slate-200">{formatDate(invoice.created_at)}</p></div>
      </div>
    </div>
  );
}