import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/shop")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Ambient background accent glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex max-w-md flex-col items-center"
      >
        {/* Dynamic Icon Wrapper */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-linear-to-b from-surface to-black/40 text-cyan-400 shadow-xl">
          <ShoppingBag className="h-6 w-6" />
        </div>

        {/* Heading Architecture */}
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Supersonic Shop
        </h1>

        {/* Subtitle Status Indicator */}
        <div className="mt-2.5 flex items-center gap-2 rounded-full border border-white/5 bg-surface/40 px-3 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/90">
            Coming Soon
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We are currently engineering an optimized procurement experience. Our inventory of
          high-performance tools will launch shortly.
        </p>

        {/* Action link back home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="group flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
