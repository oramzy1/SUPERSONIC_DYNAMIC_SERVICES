import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { invoicesApi } from "@/lib/api";
import type { InvoiceResponse } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/shared/CTAButton";

export const Route = createFileRoute("/dashboard/invoices")({
  component: InvoicesPage,
});

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-primary text-primary-foreground",
    pending: "bg-[#3B82F6] text-white",
    overdue: "bg-red-500/90 text-white",
    cancelled: "bg-white/10 text-foreground/60",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider", map[status] || "bg-white/10 text-foreground/60")}>
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      {status}
    </span>
  );
}

function ActionCell({ invoice }: { invoice: InvoiceResponse }) {
  if (invoice.status === "pending" || invoice.status === "overdue") {
    return (
      <button
        onClick={() => handlePay(invoice.id)}
        className="rounded-md bg-[#3B82F6]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9DB4FE] hover:bg-[#3B82F6]/30"
      >
        Pay Now
      </button>
    );
  }
  if (invoice.pdf_url) {
    return (
      <a
        href={invoice.pdf_url}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-8 w-8 place-items-center rounded-md bg-white/5 text-muted-foreground hover:text-foreground"
      >
        <FileText className="h-4 w-4" />
      </a>
    );
  }
  return null;
}

async function handlePay(invoiceId: number) {
  try {
    const { checkout_url } = await invoicesApi.pay(
      invoiceId,
      `${window.location.origin}/payment/success`,
    );
    window.location.href = checkout_url;
  } catch (err) {
    console.error("Payment failed:", err);
  }
}

function InvoicesPage() {
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => invoicesApi.list(),
  });

  const paid = invoices.filter((i) => i.status === "paid");
  const pending = invoices.filter((i) => i.status === "pending" || i.status === "overdue");

  const SUMMARY = [
    { label: "Total Outstanding", value: `€${pending.reduce((s, i) => s + parseFloat(i.total_amount), 0).toFixed(2)}`, sub: `${pending.length} pending` },
    { label: "Total Paid", value: `€${paid.reduce((s, i) => s + parseFloat(i.total_amount), 0).toFixed(2)}`, sub: `${paid.length} invoices` },
    { label: "Total Invoices", value: String(invoices.length), sub: "All time" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Financial Hub</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">Invoices</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {SUMMARY.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl bg-surface p-6">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/[0.02] blur-2xl" />
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="font-display text-3xl font-bold">{s.value}</p>
            </div>
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
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">No invoices yet.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="text-sm">
                    <td className="px-6 py-5 font-medium text-[#6FE5FF]">{inv.invoice_number}</td>
                    <td className="px-6 py-5 text-muted-foreground">
                      {new Date(inv.created_at).toLocaleDateString("nl-NL")}
                    </td>
                    <td className="px-6 py-5 capitalize">{inv.invoice_type}</td>
                    <td className="px-6 py-5 font-semibold">€{inv.total_amount}</td>
                    <td className="px-6 py-5"><StatusPill status={inv.status} /></td>
                    <td className="px-6 py-5"><ActionCell invoice={inv} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}