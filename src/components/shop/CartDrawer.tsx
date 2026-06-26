import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/lib/shop/cart";
import { formatEUR, computeLineTotal } from "@/lib/shop/format";
import { cn } from "@/lib/utils";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, updateQuantity, removeItem, totals } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/8 bg-surface shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">Your cart</h2>
            <span className="text-sm text-muted-foreground">
              ({totals.itemCount})
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/8 bg-surface-2 text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <p className="mt-4 font-display text-base font-semibold">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add eco-friendly supplies to get started.
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Browse shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const line = computeLineTotal(item);
                return (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-white/8 bg-surface-2 p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 truncate text-sm font-semibold">
                          {item.name}
                        </p>
                        <button
                          aria-label="Remove"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.color?.name ? `${item.color.name} · ` : ""}
                        {item.rental
                          ? `${item.durationDays}-day rental`
                          : formatEUR(item.unitPrice) + " " + item.unit}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-white/10">
                          <button
                            aria-label="Decrease"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            aria-label="Increase"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          {formatEUR(line)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="space-y-3 border-t border-white/8 bg-surface/80 px-5 py-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatEUR(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-[#79FF5B]">
                  <span>Promo discount</span>
                  <span>−{formatEUR(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {totals.shipping === 0 ? "Free" : formatEUR(totals.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (21%)</span>
                <span>{formatEUR(totals.vat)}</span>
              </div>
              <div className="flex justify-between border-t border-white/8 pt-2 text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatEUR(totals.total)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/shop/cart"
                onClick={onClose}
                className="flex-1 rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-semibold hover:bg-white/5"
              >
                View cart
              </Link>
              <Link
                to="/shop/checkout"
                onClick={onClose}
                className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Checkout
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}