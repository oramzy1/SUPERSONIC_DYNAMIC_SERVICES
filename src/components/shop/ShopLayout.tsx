import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Leaf, Mail, MapPin, Phone, ShoppingBag, User, ArrowLeft } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useCart } from "@/lib/shop/cart";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";
import { Footer } from "../layout/Footer";
import logo from "@/assets/images/logo.png";

const NAV: { label: string; to: string }[] = [
  { label: "Shop", to: "/shop" },
  { label: "Account", to: "/shop/account" },
  { label: "Orders", to: "/shop/account/orders" },
  { label: "Saved", to: "/shop/account/saved" },
];

export function ShopLayout({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { totals } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Announcement bar */}
      <div className="border-b border-white/8 bg-black/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[11px]">
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Leaf className="h-3 w-3 text-[#79FF5B]" />
            <span className="hidden sm:inline">
              Carbon-neutral delivery across the Netherlands ·
            </span>{" "}
            Delivery to all cities in the provinces of Limburg, North Brabant, Utrecht, and North Holland.
          </p>
          <p className="hidden text-muted-foreground md:block">
            Supersonic Dynamic Services B.V. · Rotterdam, NL
          </p>
        </div>
      </div>

      {/* Header */}  
      <header className="sticky top-0 z-40 border-b border-white/8 bg-background/75 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 md:flex md:justify-between md:px-6">
          {/* LOGO */}
        <Link
  to="/"
  className="group relative flex h-10 shrink-0 items-center"
>
  {/* Logo - visible by default, fades/shrinks out on hover */}
  <img
    src={logo}
    alt="Supersonic Dynamic Services"
    className="h-10 w-auto rounded-md opacity-100 transition-all duration-300 ease-out group-hover:scale-90 group-hover:opacity-0"
  />

  {/* Arrow + text - hidden by default, fades/grows in on hover, same slot */}
  <span className="absolute inset-0 flex items-center gap-2 opacity-0 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100">
    <ArrowLeft className="h-4 w-4 text-foreground" />
    <span className="whitespace-nowrap text-sm font-medium text-foreground">
      Return Home
    </span>
  </span>
</Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active =
  n.to === "/shop"
    ? pathname === "/shop"
    : n.to === "/shop/account"
      ? pathname === "/shop/account"
      : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              to="/shop/account/saved"
              aria-label="Saved items"
              className="hidden h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground sm:grid"
            >
              <Heart className="h-4 w-4" />
            </Link>
            <Link
              to="/shop/account"
              aria-label="Account"
              className="hidden h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground sm:grid"
            >
              <User className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative inline-flex h-10 items-center gap-2 rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary-foreground/10 px-1 text-[11px] font-bold">
                {totals.itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/8 px-4 py-2 md:hidden">
          {NAV.map((n) => {
            const active =
              n.to === "/shop"
                ? pathname === "/shop"
                : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition",
                  active
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
     <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}