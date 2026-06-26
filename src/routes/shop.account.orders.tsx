import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useCart } from "@/lib/shop/cart";
import { formatDate, formatEUR } from "@/lib/shop/format";
import type { OrderStatus } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/account/orders")({
  component: Orders,
});

const STATUS_STYLE: Record<OrderStatus, string> = {
  processing: "bg-cyan/15 text-cyan",
  confirmed: "bg-primary/15 text-primary",
  shipped: "bg-secondary/40 text-foreground",
  delivered: "bg-[#79FF5B]/15 text-[#79FF5B]",
  completed: "bg-[#79FF5B]/15 text-[#79FF5B]",
};

function Orders() {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-surface/40 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-primary">
          <Package className="h-5 w-5" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold">No orders yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your order history will appear here once you place an order.
        </p>
        <Link
          to="/shop"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <Link
          key={o.id}
          to="/shop/account/orders/$id"
          params={{ id: o.id }}
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-2xl border border-white/8 bg-surface p-5 transition hover:border-white/20 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center"
        >
          <div className="min-w-0">
            <p className="font-display text-base font-semibold">{o.number}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(o.createdAt)} · {o.items.length}{" "}
              {o.items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <span
            className={cn(
              "hidden rounded-full px-3 py-1 text-center text-[11px] font-semibold uppercase sm:inline-block",
              STATUS_STYLE[o.status],
            )}
          >
            {o.status}
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {o.paymentStatus === "paid" ? "Paid" : o.paymentStatus}
          </span>
          <span className="font-display text-base font-bold text-primary">
            {formatEUR(o.total)}
          </span>
        </Link>
      ))}
    </div>
  );
}