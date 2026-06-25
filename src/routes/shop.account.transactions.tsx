import { createFileRoute } from "@tanstack/react-router";
import { Download, Receipt } from "lucide-react";
import { toast } from "sonner";
import { deriveTransactions, useCart } from "@/lib/shop/cart";
import { formatDate, formatEUR } from "@/lib/shop/format";

export const Route = createFileRoute("/shop/account/transactions")({
  component: Transactions,
});

function Transactions() {
  const { orders } = useCart();
  const txns = deriveTransactions(orders);

  if (txns.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-surface/40 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-primary">
          <Receipt className="h-5 w-5" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold">
          No transactions yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Payments and invoices will appear here once you make a purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface">
      <table className="w-full text-sm">
        <thead className="bg-surface-2 text-xs text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
            <th className="px-4 py-3 text-left font-semibold">Order</th>
            <th className="px-4 py-3 text-left font-semibold">Type</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
            <th className="px-4 py-3 text-right font-semibold">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/8">
          {txns.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(t.date)}
              </td>
              <td className="px-4 py-3 font-semibold">{t.orderNumber}</td>
              <td className="px-4 py-3 capitalize text-muted-foreground">
                {t.type}
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {t.type === "refund" ? "−" : ""}
                {formatEUR(t.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="rounded-full bg-[#79FF5B]/15 px-2 py-0.5 text-[10px] font-semibold text-[#79FF5B] uppercase">
                  {t.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => toast.success("Download started")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <Download className="h-3 w-3" /> PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}