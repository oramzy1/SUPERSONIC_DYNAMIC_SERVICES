import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "white";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_8px_30px_-10px_rgba(121,255,91,0.2)]",
  secondary:
    "bg-[#002B73] text-white hover:bg-[#003a99]",
  outline:
    "border border-white/15 bg-transparent text-foreground hover:bg-white/5",
  ghost: "bg-transparent text-foreground hover:bg-white/5",
  white: "bg-white text-[#0E141A] hover:bg-white/90",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function CTAButton({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
