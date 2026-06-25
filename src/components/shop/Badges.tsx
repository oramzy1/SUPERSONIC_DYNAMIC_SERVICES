import { BADGE_META } from "@/lib/shop/products";
import type { ProductBadge } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

export function Badges({
  badges,
  className,
}: {
  badges: ProductBadge[];
  className?: string;
}) {
  if (!badges.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((b) => {
        const meta = BADGE_META[b];
        if (!meta) return null;
        return (
          <span
            key={b}
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
              meta.className,
            )}
          >
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}