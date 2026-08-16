import { Product, PurchaseMode } from "./types";

export function formatEUR(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function isBuyable(product: Pick<Product, "rental" | "buyPrice">) {
  return !product.rental || product.buyPrice != null;
}
export function isRentable(product: Pick<Product, "rental">) {
  return !!product.rental;
}

export function effectiveUnitPrice(item: {
  mode: PurchaseMode;
  unitPrice: number;
  bulkPrice?: number;
  bulkThreshold?: number;
  buyPrice?: number;
  buyBulkPrice?: number;
  buyBulkThreshold?: number;
  quantity: number;
}) {
  if (item.mode === "buy" && item.buyPrice != null) {
    const price = item.buyPrice;
    const bulk = item.buyBulkPrice;
    const threshold = item.buyBulkThreshold;
    return bulk != null && threshold != null && item.quantity >= threshold ? bulk : price;
  }
  // buy-only products (rental=false) and rent mode both fall back to base price fields
  const bulk = item.bulkPrice;
  const threshold = item.bulkThreshold;
  return bulk != null && threshold != null && item.quantity >= threshold
    ? bulk
    : item.unitPrice;
}

export const VAT_RATE = 0.21; // NL standard VAT

export function computeLineTotal(item: {
  mode: PurchaseMode;
  quantity: number;
  unitPrice: number;
  bulkPrice?: number;
  bulkThreshold?: number;
  buyPrice?: number;
  buyBulkPrice?: number;
  buyBulkThreshold?: number;
  durationDays?: number;
}): number {
  const unit = effectiveUnitPrice(item);
  const duration = item.mode === "rent" ? Math.max(1, item.durationDays ?? 1) : 1;
  return unit * item.quantity * duration;
}