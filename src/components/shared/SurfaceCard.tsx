import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
  bordered?: "primary" | "none";
  padded?: boolean;
  coloredBorder?: boolean;
};

export function SurfaceCard({
  children,
  coloredBorder = false,
  className,
  bordered = "none",
  padded = true,
  ...rest
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "rounded-2xl bg-surface",
        bordered === "primary" ? "border border-primary/60" : "border border-white/5",
        coloredBorder && 'border-l-3 border-l-primary',
        padded && "p-6 md:p-8",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
