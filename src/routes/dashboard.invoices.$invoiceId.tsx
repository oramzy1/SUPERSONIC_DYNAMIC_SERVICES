import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, CreditCard } from "lucide-react";
import { invoicesApi, mapPdfError, openBlobInNewTab } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/dashboard/invoices/$invoiceId")({
  component: InvoiceDetailPage,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", year: "numeric" });
}

function InvoiceDetailPage() {
  const { invoiceId } = Route.useParams();
  const id = Number(invoiceId);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [paying, setPaying] = useState(false);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
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

  const pay = async () => {
    setPaying(true);
    try {
      const { checkout_url } = await invoicesApi.pay(id, `${window.location.origin}/payment/success`);
      window.location.href = checkout_url;
    } catch (err) {
      setToast({ type: "error", message: "Failed to start payment. Please try again." });
      setPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs items={[{ label: "Invoices", to: "/dashboard/invoices" }, { label: `Invoice #${invoiceId}` }]} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs items={[{ label: "Invoices", to: "/dashboard/invoices" }, { label: `Invoice #${invoiceId}` }]} />
        <div className="rounded-2xl bg-surface p-8 text-center text-sm text-muted-foreground">
          Invoice not found.
          <div className="mt-3"><Link to="/dashboard/invoices" className="text-primary text-xs font-semibold hover:underline">Back to Invoices</Link></div>
        </div>
      </div>
    );
  }

  const needsPay = invoice.status.toLowerCase() === "pending" || invoice.status.toLowerCase() === "overdue" || invoice.status.toLowerCase() === "draft";

  return (
    <div className="mx-auto max-w-2xl pb-12">
      <Breadcrumbs items={[{ label: "Invoices", to: "/dashboard/invoices" }, { label: invoice.invoice_number }]} />

      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border bg-surface border-rose-500/30 text-rose-400">
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">{invoice.invoice_number}</h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{invoice.invoice_type} · {formatDate(invoice.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          {needsPay && (
            <button onClick={pay} disabled={paying}
              className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-50">
              {paying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />} Pay Now
            </button>
          )}
          <button onClick={download} disabled={downloading}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Download PDF
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-6 grid grid-cols-2 gap-4 text-sm">
        <div><p className="text-[10px] text-muted-foreground uppercase mb-1">Amount</p><p className="font-bold text-lg">€{invoice.total_amount}</p></div>
        <div><p className="text-[10px] text-muted-foreground uppercase mb-1">Status</p><p className="uppercase text-xs font-bold">{invoice.status}</p></div>
        <div><p className="text-[10px] text-muted-foreground uppercase mb-1">Type</p><p className="capitalize">{invoice.invoice_type}</p></div>
        <div><p className="text-[10px] text-muted-foreground uppercase mb-1">Created</p><p>{formatDate(invoice.created_at)}</p></div>
        {invoice.quote_number && (
          <div><p className="text-[10px] text-muted-foreground uppercase mb-1">Quote</p><p>{invoice.quote_number}</p></div>
        )}
        {invoice.job_id && (
          <div>
            <p className="text-[10px] text-muted-foreground uppercase mb-1">Job</p>
            <Link to="/dashboard/jobs/$jobId" params={{ jobId: String(invoice.job_id) }} className="text-[#6FE5FF] hover:underline">
              Job #{invoice.job_id}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}