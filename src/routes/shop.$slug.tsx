import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  Heart,
  Leaf,
  Maximize2,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Badges } from "@/components/shop/Badges";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCart } from "@/lib/shop/cart";
import { computeLineTotal, formatEUR } from "@/lib/shop/format";
import { getProduct, PRODUCTS } from "@/lib/shop/products";
import type { ProductColor } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.product
      ? [
          {
            title: `${loaderData.product.name} - Supersonic Shop`,
          },
          {
            name: "description",
            content: loaderData.product.shortDescription,
          },
          {
            property: "og:title",
            content: `${loaderData.product.name} - Supersonic Shop`,
          },
          {
            property: "og:description",
            content: loaderData.product.shortDescription,
          },
          { property: "og:image", content: loaderData.product.images[0] },
        ]
      : [],
  }),
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <Link to="/shop" className="mt-6 inline-block text-primary">
        Back to shop
      </Link>
    </div>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData() as {
    product: NonNullable<ReturnType<typeof getProduct>>;
  };
  const { addItem, toggleSaved, isSaved } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState<ProductColor | undefined>(product.colors?.[0]);
  const [quantity, setQuantity] = useState(1);
  // const [duration, setDuration] = useState<number>(product.rentalDurations?.[0] ?? 1);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const DURATION_PERIODS = [
    { id: "days", label: "Days", toDays: 1 },
    { id: "weeks", label: "Weeks", toDays: 7 },
    { id: "months", label: "Months", toDays: 30 },
  ] as const;
  type DurationPeriod = (typeof DURATION_PERIODS)[number]["id"];

  const [durationCount, setDurationCount] = useState<number>(product.rentalDurations?.[0] ?? 1);
  const [durationPeriod, setDurationPeriod] = useState<DurationPeriod>("days");
  const [durationOpen, setDurationOpen] = useState(false);
  const durationRef = useRef<HTMLDivElement>(null);

  const durationDays = useMemo(
    () => durationCount * DURATION_PERIODS.find((p) => p.id === durationPeriod)!.toDays,
    [durationCount, durationPeriod],
  );

  useEffect(() => {
    if (!durationOpen) return;
    const onClick = (e: MouseEvent) => {
      if (durationRef.current && !durationRef.current.contains(e.target as Node)) {
        setDurationOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [durationOpen]);

  const saved = isSaved(product.slug);

  const lineTotal = useMemo(
    () =>
      computeLineTotal({
        quantity,
        unitPrice: product.price,
        bulkPrice: product.bulkPrice,
        bulkThreshold: product.bulkThreshold,
        durationDays,
        rental: product.rental,
      }),
    [
      quantity,
      durationDays,
      product.price,
      product.bulkPrice,
      product.bulkThreshold,
      product.rental,
    ],
  );

  const effectiveUnit =
    product.bulkPrice != null && product.bulkThreshold != null && quantity >= product.bulkThreshold
      ? product.bulkPrice
      : product.price;

  const onMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const r = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setZoom({ active: true, x, y });
  };

  const buildCartItem = () => ({
    id: `${product.slug}|${color?.id ?? "default"}|${product.rental ? durationDays : "x"}`,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    unitPrice: product.price,
    bulkPrice: product.bulkPrice,
    bulkThreshold: product.bulkThreshold,
    unit: product.unit,
    quantity,
    rental: product.rental,
    durationDays: product.rental ? durationDays : undefined,
    color,
  });

  const onAdd = () => {
    addItem(buildCartItem());
    toast.success(`${product.name} added to cart`);
  };

  const onBuyNow = () => {
    addItem(buildCartItem());
    window.location.assign("/shop/checkout");
  };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back to shop
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div
            ref={imgRef}
            onMouseEnter={() => setZoom((z) => ({ ...z, active: true }))}
            onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
            onMouseMove={onMouseMove}
            className="group relative aspect-square overflow-hidden rounded-3xl border border-white/8 bg-surface-2"
          >
            <motion.img
              key={activeImage}
              src={product.images[activeImage]}
              alt={product.name}
              initial={{ opacity: 0.4, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className={cn(
                "h-full w-full object-cover transition-transform duration-200",
                zoom.active && "scale-150",
              )}
              style={zoom.active ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
            <button
              onClick={() => setLightbox(true)}
              aria-label="Expand image"
              className="absolute right-4 bottom-4 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-foreground opacity-0 backdrop-blur-md transition group-hover:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "aspect-square overflow-hidden rounded-xl border-2 transition",
                  activeImage === i ? "border-primary" : "border-white/8 hover:border-white/20",
                )}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            {product.categoryLabel}
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight font-bold md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3">
            <Badges badges={product.badges} />
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-primary">
              {formatEUR(effectiveUnit)}
            </span>
            <span className="text-sm text-muted-foreground">{product.unit}</span>
            {effectiveUnit < product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatEUR(product.price)}
              </span>
            )}
          </div>
          {product.bulkPrice != null && (
            <p className="mt-1 text-sm text-[#79FF5B]">
              Bulk pricing: {formatEUR(product.bulkPrice)} {product.unit} for{" "}
              {product.bulkThreshold}+ units
            </p>
          )}

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Color */}
          {product.colors && (
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Colour - {color?.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c)}
                    aria-label={c.name}
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full border-2 transition",
                      color?.id === c.id
                        ? "border-primary"
                        : "border-white/10 hover:border-white/30",
                    )}
                  >
                    <span className="h-7 w-7 rounded-full" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + duration */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Quantity
              </p>
              <div className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-surface">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
                  }
                  className="w-14 bg-transparent text-center text-sm font-semibold focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{product.stock} in stock</p>
            </div>

            {product.rental && (
              <div ref={durationRef} className="relative">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Rental duration
                </p>
                <button
                  onClick={() => setDurationOpen((o) => !o)}
                  className={cn(
                    "mt-3 flex h-11 w-full items-center justify-between rounded-full border bg-surface px-4 text-sm font-semibold transition sm:w-56",
                    durationOpen
                      ? "border-primary/40 text-primary"
                      : "border-white/10 text-foreground hover:border-white/20",
                  )}
                >
                  <span>
                    {durationCount} {DURATION_PERIODS.find((p) => p.id === durationPeriod)?.label}
                  </span>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", durationOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {durationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute z-20 mt-2 flex w-full origin-top overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-xl shadow-black/30 sm:w-56"
                    >
                      {/* Count column */}
                      <div className="flex w-1/2 flex-1 flex-col border-r border-white/8">
                        <button
                          onClick={() => setDurationCount((c) => Math.min(90, c + 1))}
                          className="grid h-9 place-items-center text-muted-foreground hover:text-foreground"
                          aria-label="Increase duration"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <input
                          value={durationCount}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            if (raw === "") {
                              setDurationCount(0);
                              return;
                            }
                            setDurationCount(Math.min(90, Number(raw)));
                          }}
                          onBlur={() => setDurationCount((c) => Math.max(1, c))}
                          onFocus={(e) => e.target.select()}
                          inputMode="numeric"
                          className="h-10 border-y border-white/8 bg-transparent text-center text-sm font-semibold focus:outline-none"
                          aria-label="Duration count"
                        />
                        <button
                          onClick={() => setDurationCount((c) => Math.max(1, c - 1))}
                          className="grid h-9 place-items-center text-muted-foreground hover:text-foreground"
                          aria-label="Decrease duration"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Period column */}
                      <div className="flex w-1/2 flex-1 flex-col">
                        {DURATION_PERIODS.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setDurationPeriod(p.id);
                              setDurationOpen(false);
                            }}
                            className={cn(
                              "flex h-9 items-center justify-center px-3 text-xs font-semibold transition",
                              durationPeriod === p.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                            )}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Live total */}
          <div className="mt-6 rounded-2xl border border-white/8 bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {quantity} × {formatEUR(effectiveUnit)}
                {product.rental
                  ? ` × ${durationCount} ${DURATION_PERIODS.find((p) => p.id === durationPeriod)?.label.toLowerCase()}${
                      durationPeriod !== "days"
                        ? ` (${durationDays} ${durationDays === 1 ? "day" : "days"})`
                        : ""
                    }`
                  : ""}
              </p>
              <p className="font-display text-xl font-bold text-primary">{formatEUR(lineTotal)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button
              onClick={onAdd}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold hover:bg-white/5"
            >
              Add to cart
            </button>
            <button
              onClick={onBuyNow}
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              Buy now
            </button>
            <button
              onClick={() => toggleSaved(product.slug)}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-full border text-xs font-semibold",
                saved
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-white/10 text-muted-foreground hover:text-foreground",
              )}
            >
              <Heart className={cn("h-4 w-4", saved && "fill-current")} />
              {saved ? "Saved" : "Save for later"}
            </button>
            <button
              onClick={onShare}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <InfoChip icon={<Truck className="h-4 w-4" />} label="Fast Delivery" />
            <InfoChip icon={<Leaf className="h-4 w-4" />} label="Carbon neutral" />
            <InfoChip icon={<ShieldCheck className="h-4 w-4" />} label="VAT invoice" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Features">
            <ul className="space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Technical specifications">
            <dl className="divide-y divide-white/8 text-sm">
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-2 gap-2 py-2.5 first:pt-0">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card title="Shipping & pickup">
            <ul className="space-y-2">
              {product.shipping.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {s}
                </li>
              ))}
              {product.pickupAvailable && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#79FF5B]" />
                  Pickup available at our business address
                </li>
              )}
            </ul>
          </Card>
          <Card title="Sustainability impact">
            <ul className="space-y-2">
              {product.sustainability.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-[#79FF5B]" /> {s}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* FAQs */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-surface">
          {product.faqs.map((f, i) => (
            <details key={i} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold">
                {f.q}
                <Plus className="h-4 w-4 text-muted-foreground transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Reviews placeholder (future-ready) */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-dashed border-white/10 bg-surface/30 p-8 text-center">
          <p className="font-display text-base font-semibold">Verified customer reviews</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Review collection rolls out with our next release. Until then, see our Trustpilot rating
            for live customer feedback.
          </p>
        </div>
      </div>

      {/* Related */}
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="font-display text-2xl font-bold">Related products</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightbox(false)}
        >
          <button
            aria-label="Close"
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="max-h-full max-w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </>
  );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-surface/40 px-3 py-2 text-xs text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-surface p-5">
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
