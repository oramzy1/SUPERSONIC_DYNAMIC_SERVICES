import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CTAButton } from "@/components/shared/CTAButton";
import thankBg from "@/assets/images/thankyou-bg.jpg";

export const Route = createFileRoute()({
  component: Success,
});

function Success() {
  return (
    <SiteLayout marquee={false}>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0E141A]">
        <div className="relative w-full h-104 md:h-120">
          <img 
            src={thankBg} 
            alt="Thank you relocation background" 
            className="h-full w-full object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0E141A] via-[#0E141A]/70 to-[#0E141A]/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-12 md:px-8">
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display text-5xl font-bold md:text-7xl text-white"
              >
                Thank you
              </motion.h1>
              <p className="mt-3 max-w-md text-slate-400 text-sm sm:text-base leading-relaxed">
                We have received your request for a quote. Our team is already optimizing your layout configurations and will contact you shortly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIRMATION CORE STATUS */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:px-8 relative">
        {/* Subtle decorative backing glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-(--primary)/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--primary)/10 border border-(--primary)/20 text-primary"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl font-bold md:text-5xl text-white tracking-tight"
        >
          Successfully Submitted
        </motion.h2>
        
        <p className="mt-4 text-slate-400 max-w-md text-sm sm:text-base leading-relaxed">
          Your system ticket <span className="text-primary bg-(--primary)/10 border border-(--primary)/20 font-mono px-2 py-0.5 rounded text-xs mx-1">#SDS-2026-X</span> has been cataloged and loaded into our primary dispatch workspace.
        </p>

        <div className="mt-8 z-10">
          <Link to="/">
            <CTAButton
              variant="outline"
              className="rounded-xl bg-[#0F151C] border-white/10 hover:border-(--primary)/40 px-8 py-3.5 tracking-[0.2em] text-white text-xs font-bold transition"
            >
              RETURN HOME
            </CTAButton>
          </Link>
        </div>

        <p className="mt-12 inline-flex items-center gap-2 text-xs text-slate-500 font-mono">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure protocol pipeline active
        </p>
      </section>
    </SiteLayout>
  );
}