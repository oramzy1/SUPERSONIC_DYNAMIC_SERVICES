import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Package, Receipt } from "lucide-react";
import { useCart, deriveTransactions } from "@/lib/shop/cart";
import { formatDate, formatEUR } from "@/lib/shop/format";

export const Route = createFileRoute("/shop/account/")({
  component: Overview,
});

function Overview() {
  const { orders, saved } = useCart();
  const txns = deriveTransactions(orders);
  const lastOrder = orders[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={<Package className="h-4 w-4" />} label="Orders" value={orders.length} />
        <Stat icon={<Receipt className="h-4 w-4" />} label="Transactions" value={txns.length} />
        <Stat icon={<Heart className="h-4 w-4" />} label="Saved items" value={saved.length} />
      </div>

      <div className="rounded-2xl border border-white/8 bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent order</h2>
          <Link
            to="/shop/account/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {lastOrder ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-surface-2 p-4">
            <div>
              <p className="font-display text-sm font-semibold">
                {lastOrder.number}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(lastOrder.createdAt)} ·{" "}
                {lastOrder.items.length} items
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary uppercase">
              {lastOrder.status}
            </span>
            <p className="font-display text-base font-bold text-primary">
              {formatEUR(lastOrder.total)}
            </p>
            <Link
              to="/shop/account/orders/$id"
              params={{ id: lastOrder.id }}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold"
            >
              Details
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No orders yet. When you place one, it'll show up here.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-surface p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span className="text-xs font-semibold tracking-[0.18em] uppercase">
          {label}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}