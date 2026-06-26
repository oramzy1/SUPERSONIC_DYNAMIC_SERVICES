import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Filter, Leaf, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/shop/products";
import shopHero from "@/assets/shop/shop-hero.jpg";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop - Eco Moving Supplies | Supersonic Dynamic Services" },
      {
        name: "description",
        content:
          "Premium recyclable moving crates, bubble wrap and sustainable packaging supplies. Rent or buy across the Netherlands.",
      },
    ],
  }),
  component: ShopIndex,
});

function ShopIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [ecoOnly, setEcoOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (ecoOnly && !p.badges.includes("eco")) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
        );
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [query, category, sort, ecoOnly]);

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={shopHero}
          alt="Electric moving van loaded with recyclable crates"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/40 via-background/70 to-background" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#79FF5B]/30 bg-[#79FF5B]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#79FF5B] uppercase">
              <Leaf className="h-3 w-3" /> Built for the circular economy
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
              Premium eco moving supplies.
              <span className="block text-primary">Engineered for reuse.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              Rent recyclable ALC crates, source sustainable packaging, and run every move with the
              transparency of a professional logistics operator.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 md:grid-cols-3">
          {[
            { k: "100%", v: "Recyclable materials" },
            { k: "400+", v: "Reuses per crate" },
            { k: "21% VAT", v: "Included on every receipt" },
          ].map((s) => (
            <div key={s.v} className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold text-primary">{s.k}</span>
              <span className="text-sm text-muted-foreground">{s.v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="grid gap-4 rounded-2xl border border-white/8 bg-surface p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <label className="relative block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search crates, packaging, accessories…"
              className="h-11 w-full rounded-xl border border-white/10 bg-surface-2 pr-3 pl-10 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <button
              onClick={() => setEcoOnly((v) => !v)}
              className={cn(
                "h-11 rounded-xl border px-3 text-xs font-semibold transition",
                ecoOnly
                  ? "border-[#79FF5B]/40 bg-[#79FF5B]/10 text-[#79FF5B]"
                  : "border-white/10 text-muted-foreground hover:text-foreground",
              )}
            >
              Eco only
            </button>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 rounded-xl border border-white/10 bg-surface-2 px-3 text-sm focus:border-primary/50 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[{ id: "all", label: "All products" }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition",
                category === c.id
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-white/10 text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-surface/30 p-12 text-center">
            <p className="font-display text-lg font-semibold">No products match your filters.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing search or category to see everything we stock.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-secondary/40 via-surface to-surface p-8 md:p-12">
          <div className="absolute top-0 right-0 h-40 w-40 -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                Bulk savings
              </span>
              <h2 className="mt-4 font-display text-3xl leading-tight font-bold md:text-4xl">
                Rent 20+ ALC crates and pay just €1 per crate, per day.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Automatic bulk pricing at checkout. Free pickup at the end of your rental,
                everywhere in the Netherlands.
              </p>
            </div>
            <Link
              to="/shop/$slug"
              params={{ slug: "alc-recyclable-moving-crate" }}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Configure crates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
