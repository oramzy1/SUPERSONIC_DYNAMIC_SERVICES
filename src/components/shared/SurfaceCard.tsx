import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
  bordered?: "primary" | "none";
  padded?: boolean;
  coloredBorder?: boolean;
  dots?: boolean
};

export function SurfaceCard({
  children,
  coloredBorder = false,
  className,
  bordered = "none",
  padded = true,
  dots=false,
  ...rest 
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "rounded-xs bg-surface text-foreground",
        bordered === "primary" ? "border border-primary/60" : "border border-border",
        coloredBorder && 'border-l-3 border-l-primary',
        padded && "p-6 md:p-8",
        className,
      )}
      {...rest}
    >
     {dots &&  <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />}
      {children}
    </motion.div>
  );
}
