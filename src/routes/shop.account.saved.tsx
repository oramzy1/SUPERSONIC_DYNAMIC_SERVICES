import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCart } from "@/lib/shop/cart";
import { getProduct } from "@/lib/shop/products";

export const Route = createFileRoute("/shop/account/saved")({
  component: Saved,
});

function Saved() {
  const { saved } = useCart();
  const products = saved
    .map((s) => getProduct(s.slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-surface/40 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-primary">
          <Heart className="h-5 w-5" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold">
          No saved items yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap the heart on any product to save it for later.
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
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}