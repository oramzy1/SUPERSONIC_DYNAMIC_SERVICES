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

export const VAT_RATE = 0.21; // NL standard VAT

export function computeLineTotal(item: {
  quantity: number;
  unitPrice: number;
  bulkPrice?: number;
  bulkThreshold?: number;
  durationDays?: number;
  rental: boolean;
}): number {
  const effectiveUnit =
    item.bulkPrice != null &&
    item.bulkThreshold != null &&
    item.quantity >= item.bulkThreshold
      ? item.bulkPrice
      : item.unitPrice;
  const duration = item.rental ? Math.max(1, item.durationDays ?? 1) : 1;
  return effectiveUnit * item.quantity * duration;
}