import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Calendar, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/quotesuccess")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-background selection:bg-primary/30">
      <div className="w-full max-w-lg text-center">
        {/* Animated Success Badge */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl scale-150 animate-pulse" />
            {/* Mid ring */}
            <div className="absolute -inset-1.5 rounded-full border border-primary/20" />
            {/* Icon container */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
              <CheckCircle2 className="h-9 w-9 text-primary stroke-[1.5]" />
            </div>
          </motion.div>
        </div>

        {/* Status pill */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Request Received
          </span>
        </motion.div>

        {/* Headline + sub-copy */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-foreground leading-[1.1]">
            We've Got You Covered!
          </h1>
          <p className="max-w-sm mx-auto text-sm text-muted-foreground leading-relaxed">
            Thank you for choosing Supersonic. Your moving and freight haulage configurations have
            been securely processed by our logistics engine.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="mx-auto mt-8 mb-8 h-px w-24 bg-linear-to-r from-transparent via-white/10 to-transparent"
        />

        {/* What Happens Next panel */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="rounded-2xl border border-white/5 bg-surface p-5 sm:p-6 text-left shadow-2xl"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-5">
            What Happens Next?
          </p>

          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-foreground leading-snug">
                  Expert Review Within 2 Hours
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Our logistics coordinators in the Netherlands will assess your parameters to
                  construct the most efficient dynamic routing.
                </p>
              </div>
            </div>

            {/* Connector line */}
            <div className="ml-4 w-px h-4 bg-white/8" />

            {/* Step 2 */}
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-foreground leading-snug">
                  Custom Proposal Inbox Delivery
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  A comprehensive, transparent flat-rate digital quotation matched with your desired
                  calendar window will be emailed directly to you.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
          className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Return Home
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-muted-foreground hover:bg-white/8 hover:text-foreground transition-all"
          >
            Explore Services <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Eco assurance footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 inline-flex items-center gap-2 text-[11px] text-muted-foreground/60 font-medium"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/70" />
          <span>Carbon-Neutral Fleet Logistics Guarantee</span>
        </motion.div>
      </div>
    </div>
  );
}
