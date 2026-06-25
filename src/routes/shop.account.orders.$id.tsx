import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronLeft, Download, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/shop/cart";
import { computeLineTotal, formatDate, formatEUR } from "@/lib/shop/format";
import type { OrderStatus } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/account/orders/$id")({
  component: OrderDetail,
  notFoundComponent: () => (
    <div className="rounded-2xl border border-white/8 bg-surface p-8 text-center">
      <p className="font-display text-lg font-semibold">Order not found</p>
      <Link
        to="/shop/account/orders"
        className="mt-4 inline-block text-sm text-primary"
      >
        Back to orders
      </Link>
    </div>
  ),
});

const STATUS_FLOW: OrderStatus[] = [
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "completed",
];

function OrderDetail() {
  const { id } = Route.useParams();
  const { orders, addItem } = useCart();
  const order = orders.find((o) => o.id === id);
  if (!order) throw notFound();
  const currentIdx = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      <Link
        to="/shop/account/orders"
        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> All orders
      </Link>

      <div className="rounded-2xl border border-white/8 bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Order
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">
              {order.number}
            </h2>
            <p className="text-xs text-muted-foreground">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => toast.success("Invoice downloaded (PDF)")}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/5"
            >
              <Download className="h-3.5 w-3.5" /> Invoice
            </button>
            <button
              onClick={() => {
                order.items.forEach((i) => addItem({ ...i }));
                toast.success("Items added to your cart");
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Reorder
            </button>
          </div>
        </div>

        {/* Tracker */}
        <ol className="mt-6 grid gap-2 sm:grid-cols-5">
          {STATUS_FLOW.map((s, i) => {
            const done = i <= currentIdx;
            return (
              <li
                key={s}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase",
                  done
                    ? "border-[#79FF5B]/40 bg-[#79FF5B]/10 text-[#79FF5B]"
                    : "border-white/8 text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full",
                    done ? "bg-[#79FF5B] text-background" : "bg-white/10",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                {s}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-surface p-5">
          <h3 className="font-display text-base font-semibold">Delivery</h3>
          <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <span>
              {order.address.fullName}
              <br />
              {order.address.line1}
              {order.address.line2 && `, ${order.address.line2}`}
              <br />
              {order.address.postcode} {order.address.city},{" "}
              {order.address.country}
            </span>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Method: {order.shippingMethod}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-surface p-5">
          <h3 className="font-display text-base font-semibold">Payment</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {order.paymentMethod} · {order.paymentStatus}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Receipt sent to {order.email}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-surface p-5">
        <h3 className="font-display text-base font-semibold">Items</h3>
        <ul className="mt-3 divide-y divide-white/8">
          {order.items.map((i) => (
            <li
              key={i.id}
              className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-3"
            >
              <img
                src={i.image}
                alt=""
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{i.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Qty {i.quantity}
                  {i.rental && ` · ${i.durationDays}d rental`}
                  {i.color?.name && ` · ${i.color.name}`}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatEUR(computeLineTotal(i))}
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-white/8 pt-3 text-sm">
          <Row label="Subtotal" value={formatEUR(order.subtotal)} />
          {order.discount > 0 && (
            <Row label="Discount" value={`−${formatEUR(order.discount)}`} accent />
          )}
          <Row
            label="Shipping"
            value={order.shipping === 0 ? "Free" : formatEUR(order.shipping)}
          />
          <Row label="VAT (21%)" value={formatEUR(order.vat)} />
          <div className="mt-2 flex justify-between border-t border-white/8 pt-2 text-base font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatEUR(order.total)}</span>
          </div>
        </dl>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className={cn(accent && "text-[#79FF5B]")}>{value}</span>
    </div>
  );
}