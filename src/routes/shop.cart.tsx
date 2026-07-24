import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/shop/cart";
import { computeLineTotal, formatEUR } from "@/lib/shop/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/cart")({
  head: () => ({
    meta: [{ title: "Cart - Supersonic Shop" }],
  }),
  component: CartPage,
});

function CartPage() {
  const {
    items,
    updateQuantity,
    updateDuration,
    removeItem,
    toggleSaved,
    totals,
    promo,
    applyPromo,
    clearPromo,
    shippingMethod,
    setShippingMethod,
  } = useCart();
  const [code, setCode] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Your cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} · prices include 21% VAT
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-surface/40 p-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add some eco-friendly supplies to get started.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-3">
            {items.map((item) => {
              const line = computeLineTotal(item);
              const effectiveUnit =
                item.bulkPrice != null &&
                item.bulkThreshold != null &&
                item.quantity >= item.bulkThreshold
                  ? item.bulkPrice
                  : item.unitPrice;
              return (
                <li
                  key={item.id}
                  className="grid grid-cols-[80px_1fr] gap-4 rounded-2xl border border-white/8 bg-surface p-4 sm:grid-cols-[112px_1fr]"
                >
                  <Link
                    to="/shop/$slug"
                    params={{ slug: item.slug }}
                    className="block aspect-square overflow-hidden rounded-xl bg-surface-2"
                  >
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-col gap-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <div className="min-w-0">
                        <Link
                          to="/shop/$slug"
                          params={{ slug: item.slug }}
                          className="font-display text-base leading-tight font-semibold hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.color?.name && `${item.color.name} · `}
                          {formatEUR(effectiveUnit)} {item.unit}
                          {effectiveUnit < item.unitPrice && (
                            <span className="ml-2 rounded-full bg-[#79FF5B]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#79FF5B]">
                              Bulk price applied
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="font-display text-base font-bold text-primary">
                        {formatEUR(line)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-white/10">
                        <button
                          aria-label="Decrease"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Increase"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {item.rental && (
                        <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                          Rental days
                          <input
                            type="number"
                            min={1}
                            value={item.durationDays ?? 1}
                            onChange={(e) =>
                              updateDuration(item.id, Math.max(1, Number(e.target.value) || 1))
                            }
                            className="h-9 w-20 rounded-lg border border-white/10 bg-surface-2 px-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                          />
                        </label>
                      )}

                      <button
                        onClick={() => {
                          toggleSaved(item.slug);
                          removeItem(item.id);
                          toast.success("Moved to saved items");
                        }}
                        className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Save for later
                      </button>
                      <button
                        aria-label="Remove"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Summary */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-surface p-5">
              <h2 className="font-display text-base font-semibold">Shipping method</h2>
              <div className="mt-3 space-y-2">
                {(
                  [
                    {
                      id: "standard",
                      label: "Standard delivery",
                      hint: "2-3 business days · Free over €75",
                      price: 7.95,
                    },
                    {
                      id: "express",
                      label: "Express delivery",
                      hint: "Next business day",
                      price: 19.95,
                    },
                    {
                      id: "pickup",
                      label: "Pickup at our business address",
                      hint: "Always free",
                      price: 0,
                    },
                  ] as const
                ).map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition",
                      shippingMethod === m.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-white/8 hover:border-white/20",
                    )}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === m.id}
                      onChange={() => setShippingMethod(m.id)}
                      className="accent-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{m.label}</p>
                      <p className="text-[11px] text-muted-foreground">{m.hint}</p>
                    </div>
                    <span className="text-xs font-semibold">
                      {m.price === 0 ? "Free" : formatEUR(m.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-surface p-5">
              <h2 className="font-display text-base font-semibold">Promo code</h2>
              <div className="mt-3 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="WELCOME10"
                  className="h-10 flex-1 rounded-lg border border-white/10 bg-surface-2 px-3 text-sm focus:border-primary/50 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const r = applyPromo(code);
                    r.ok ? toast.success(r.message) : toast.error(r.message);
                  }}
                  className="rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground"
                >
                  Apply
                </button>
              </div>
              {promo && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-[#79FF5B]/30 bg-[#79FF5B]/10 px-3 py-2 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-[#79FF5B]">
                    <Tag className="h-3 w-3" /> {promo} applied
                  </span>
                  <button
                    onClick={clearPromo}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/8 bg-surface p-5">
              <h2 className="font-display text-base font-semibold">Order summary</h2>
              <dl className="mt-3 space-y-1 text-sm">
                <Row label="Subtotal" value={formatEUR(totals.subtotal)} />
                {totals.discount > 0 && (
                  <Row label="Promo discount" value={`−${formatEUR(totals.discount)}`} accent />
                )}
                <Row
                  label="Shipping"
                  value={totals.shipping === 0 ? "Free" : formatEUR(totals.shipping)}
                />
                <Row label="VAT (21%)" value={formatEUR(totals.vat)} />
                <div className="mt-2 flex justify-between border-t border-white/8 pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatEUR(totals.total)}</span>
                </div>
              </dl>
              <Link
                to="/shop/checkout"
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              >
                Proceed to checkout
              </Link>
              <Link
                to="/shop"
                className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className={cn(accent && "text-[#79FF5B]")}>{value}</span>
    </div>
  );
}
