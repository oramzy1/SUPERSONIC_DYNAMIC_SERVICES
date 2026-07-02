import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Calendar, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/quotesuccess")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">
        {/* Success badge */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/25">
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
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full border border-primary/25">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Request received
          </span>
        </motion.div>

        {/* Headline + sub-copy */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
            Your quote is on its way
          </h1>
          <p className="max-w-sm mx-auto text-sm text-slate-400 leading-relaxed">
            Thank you for choosing Supersonic. We've received your shipment details and started
            preparing your quote.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="mx-auto mt-8 mb-8 h-px w-24 bg-white/10"
        />

        {/* What happens next panel */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6 text-left shadow-xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-5">
            What happens next
          </p>

          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white leading-snug">
                  Review within 2 hours
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Our logistics coordinators will review your details and plan the most efficient
                  route for your shipment.
                </p>
              </div>
            </div>

            {/* Connector line */}
            <div className="ml-4 w-px h-4 bg-white/10" />

            {/* Step 2 */}
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white leading-snug">
                  Your proposal, sent by email
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  A clear, flat-rate quote matched to your preferred dates will be sent straight to
                  your inbox.
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
            Return home
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            Explore services <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Eco assurance footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 inline-flex items-center gap-2 text-[11px] text-slate-500 font-medium"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-primary/60" />
          <span>Carbon-neutral fleet, guaranteed</span>
        </motion.div>
      </div>
    </div>
  );
}
