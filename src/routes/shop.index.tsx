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
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800">
        <img
          src={shopHero}
          alt="Electric moving van loaded with recyclable crates"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/70 to-slate-900/90" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-emerald-400 uppercase shadow-xs backdrop-blur-xs">
              <Leaf className="h-3 w-3 text-emerald-400" /> Built for the circular economy
            </span>
            <h1 className="mt-5 font-display text-4xl text-balance leading-[1.05] font-bold tracking-tight text-white md:text-6xl">
              Premium eco moving & logistics supplies and consumables.
              <span className="block text-emerald-400 mt-1">Engineered for reuse.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              Purchase or Rent premium eco-friendly Moving and Logistics Supplies & Consumables.
              Access a wide range of recyclable and sustainable packaging materials designed to make
              every move more efficient, reliable, and reusable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-5 md:grid-cols-3">
          {[
            { k: "100%", v: "Recyclable materials" },
            { k: "400+", v: "Reuses per crate" },
            { k: "21% VAT", v: "Included on every receipt" },
          ].map((s) => (
            <div key={s.v} className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold text-emerald-600">{s.k}</span>
              <span className="text-sm font-medium text-slate-600">{s.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filter and Control Bar */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs md:grid-cols-[1fr_auto_auto] md:items-center">
          <label className="relative block">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search crates, packaging, accessories…"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition"
            />
          </label>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <button
              onClick={() => setEcoOnly((v) => !v)}
              className={cn(
                "h-11 rounded-xl border px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5",
                ecoOnly
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Leaf className="h-3.5 w-3.5" /> Eco only
            </button>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 font-medium focus:border-emerald-500 focus:bg-white focus:outline-none transition cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[{ id: "all", label: "All products" }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition cursor-pointer",
                category === c.id
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product List Grid */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <p className="font-display text-lg font-semibold text-slate-900">
              No products match your filters.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try clearing search or category to see everything we stock.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* B2B Procurement Section */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 md:text-2xl">
                Can't find what you're looking for?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Are you a small, medium, or large business organisation seeking procurement and
                supply of any range of supplies and consumables? SUPERSONIC DYNAMIC SERVICES B.V is
                a trusted, efficient partner that handles procurement through delivery to your
                business location. Reach out with your request via{" "}
                <a
                  href="mailto:info@supersonicdynamicservices.nl"
                  className="text-emerald-600 font-medium underline underline-offset-2 hover:text-emerald-700"
                >
                  info@supersonicdynamicservices.nl
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+31684336600"
                  className="text-emerald-600 font-medium underline underline-offset-2 hover:text-emerald-700"
                >
                  +31 06 84 336 600
                </a>{" "}
                and we'll handle it to the best standard.
              </p>
            </div>
            <a
              href="mailto:info@supersonicdynamicservices.nl"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Request procurement
            </a>
          </div>
        </div>
      </section>

      {/* Bulk Savings Promo Box */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8 shadow-xs md:p-12">
          <div className="absolute top-0 right-0 h-48 w-48 -translate-y-1/4 translate-x-1/4 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-emerald-700 uppercase shadow-xs">
                Bulk savings
              </span>
              <h2 className="mt-4 font-display text-2xl leading-tight font-bold text-slate-900 md:text-3xl">
                Rent 20+ ALC crates and pay just €1 per crate, per day.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                Automatic bulk pricing at checkout. Free pickup at the end of your rental,
                everywhere in the Netherlands.
              </p>
            </div>
            <Link
              to="/shop/$slug"
              params={{ slug: "alc-recyclable-moving-crate" }}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Configure crates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
