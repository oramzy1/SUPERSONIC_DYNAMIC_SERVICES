import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CTAButton } from "@/components/shared/CTAButton";
import thankBg from "@/assets/thankyou-bg.jpg";

export const Route = createFileRoute("/quote/success")({
  component: Success,
});

function Success() {
  return (
    <SiteLayout marquee={false}>
      <section className="relative overflow-hidden">
        <div className="relative">
          <img src={thankBg} alt="" className="h-[420px] w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E141A] via-[#0E141A]/70 to-[#0E141A]/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-12 md:px-8">
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display text-5xl font-bold md:text-7xl"
              >
                Thankyou
              </motion.h1>
              <p className="mt-3 max-w-md text-muted-foreground">
                We have received your request for a quote, our team is working on getting back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl font-bold md:text-5xl"
        >
          Successfully Submitted
        </motion.h2>
        <p className="mt-4 text-muted-foreground">
          Your quote request <span className="text-[#6FE5FF] font-mono">#SDS-2024-X</span> has been received and is being processed by our logistics crew.
        </p>
        <Link to="/" className="mt-8">
          <CTAButton variant="outline" className="rounded-xl bg-surface px-8 py-3.5 tracking-[0.2em]">
            RETURN HOME
          </CTAButton>
        </Link>
        <p className="mt-10 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" /> Encrypted secure submission protocol active
        </p>
      </section>
    </SiteLayout>
  );
}
