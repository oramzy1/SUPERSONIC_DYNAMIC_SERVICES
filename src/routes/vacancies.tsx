import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Briefcase, Clock } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CTAButton } from "@/components/shared/CTAButton";
import vanHero from "@/assets/images/hero-van.jpg";

export const Route = createFileRoute("/vacancies")({
  component: Vacancies,
  head: () => ({
    meta: [
      { title: "Vacancies - Supersonic Dynamic Services B.V." },
      {
        name: "description",
        content: "Join our team at Supersonic Dynamic Services B.V. Career opportunities coming soon.",
      },
    ],
  }),
});

function Vacancies() {
  return (
    <SiteLayout marquee={false}>
      <section className="relative overflow-hidden">
        <div className="relative">
          <img src={vanHero} alt="" className="h-105 w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0E141A] via-[#0E141A]/70 to-[#0E141A]/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-12 md:px-8">
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display text-5xl font-bold md:text-7xl"
              >
                Vacancies
              </motion.h1>
              <p className="mt-3 max-w-md text-muted-foreground">
                Be part of the team redefining logistics in the Netherlands and Europe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:px-8">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Briefcase className="h-7 w-7" />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 font-display text-3xl font-bold md:text-5xl"
        >
          Positions Opening Soon
        </motion.h2>

        <p className="mt-4 max-w-lg text-muted-foreground">
          We are currently preparing exciting career opportunities across our operations. 
          Check back soon or reach out directly - we are always interested in exceptional talent.
        </p>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <Clock className="h-3.5 w-3.5" /> Coming soon
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/contact">
            <CTAButton variant="white" className="rounded-xl px-8 py-3.5 tracking-[0.2em]">
              GET IN TOUCH
            </CTAButton>
          </Link>
          <Link to="/">
            <CTAButton variant="outline" className="rounded-xl bg-surface px-8 py-3.5 tracking-[0.2em]">
              RETURN HOME
            </CTAButton>
          </Link>
        </div>

        <p className="mt-10 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Supersonic Dynamic Services B.V. - Netherlands & Europe
        </p>
      </section>
    </SiteLayout>
  );
}