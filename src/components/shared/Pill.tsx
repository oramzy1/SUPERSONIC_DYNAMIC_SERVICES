import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "cyan" | "muted";

export function Pill({
  children,
  variant = "cyan",
  className,
  dot,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  dot?: boolean;
}) {
  const styles: Record<Variant, string> = {
    primary: "border-primary/50 text-primary",
    cyan: "border-[#6FE5FF]/50 text-[#6FE5FF]",
    muted: "border-white/10 text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-transparent px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
        styles[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
