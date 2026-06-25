import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badges } from "./Badges";
import { useCart } from "@/lib/shop/cart";
import { formatEUR } from "@/lib/shop/format";
import type { Product } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, toggleSaved, isSaved } = useCart();
  const saved = isSaved(product.slug);

  const onQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultColor = product.colors?.[0];
    const defaultDuration = product.rental
      ? (product.rentalDurations?.[0] ?? 1)
      : undefined;
    addItem({
      id: `${product.slug}|${defaultColor?.id ?? "default"}|${defaultDuration ?? "x"}`,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      unitPrice: product.price,
      bulkPrice: product.bulkPrice,
      bulkThreshold: product.bulkThreshold,
      unit: product.unit,
      quantity: 1,
      rental: product.rental,
      durationDays: defaultDuration,
      color: defaultColor,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden rounded-2xl border border-white/8 bg-surface transition hover:border-white/20"
      >
        <div className="relative aspect-square overflow-hidden bg-surface-2">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <Badges badges={product.badges.slice(0, 2)} />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleSaved(product.slug);
              }}
              aria-label={saved ? "Remove from saved" : "Save for later"}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border border-white/10 backdrop-blur-md transition",
                saved
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/40 text-foreground hover:bg-black/60",
              )}
            >
              <Heart
                className={cn("h-4 w-4", saved && "fill-current")}
                strokeWidth={2}
              />
            </button>
          </div>
          <button
            type="button"
            onClick={onQuickAdd}
            aria-label={`Quick add ${product.name}`}
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground opacity-0 shadow-lg transition group-hover:opacity-100"
          >
            <Plus className="h-3.5 w-3.5" /> Quick add
          </button>
        </div>
        <div className="space-y-2 p-5">
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            {product.categoryLabel}
          </p>
          <h3 className="font-display text-lg leading-tight font-semibold">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>
          <div className="flex items-end justify-between pt-2">
            <div>
              <p className="font-display text-xl font-bold text-primary">
                {formatEUR(product.price)}
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  {product.unit}
                </span>
              </p>
              {product.bulkPrice != null && (
                <p className="text-[11px] text-[#79FF5B]">
                  {formatEUR(product.bulkPrice)} {product.unit} for{" "}
                  {product.bulkThreshold}+
                </p>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">
              In stock
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}