import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { CTAButton } from "@/components/shared/CTAButton";
import { RequestQuoteBanner } from "./index";
import { SERVICES } from "@/lib/services-data";
import vanHero from "@/assets/images/hero-van.jpg";
import { motion } from "framer-motion";

export const Route = createFileRoute("/services/")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Moving & Freight Haulage Services - Supersonic Dynamic Services B.V." },
      {
        name: "description",
        content:
          "Explore our full range of moving services in the Netherlands - residential, student, enterprise, storage and waste removal. Eco-friendly, technology-powered relocation.",
      },
    ],
  }),
});

function Services() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="relative">
          <motion.img
            src={vanHero}
            alt=""
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="h-104 w-full object-cover opacity-50 md:h-136"
          />
          <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/70 to-foreground/20" />
          <div className="absolute inset-0 flex items-start">
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto w-full max-w-7xl px-6 pt-10 md:px-8 md:pt-35"
            >
              <Pill className="text-white">Supersonic Dynamic Services B.V</Pill>
              <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">
                Our Service Modules.
              </h1>
              <p className="mt-4 max-w-2xl text-white/75">
                At SUPERSONIC DYNAMIC SERVICES, our mission is simple: to make our customers'
                journey smooth, efficient, and completely stress-free. We are committed to providing
                reliable, flexible, and professional logistics solutions tailored to meet the unique
                needs of every customer.
              </p>
              <a href="#services" className="mt-6 block w-full sm:w-auto">
                <CTAButton className="bg-blue-50 text-black group rounded-lg w-full sm:w-auto px-6 py-3.5 flex items-center justify-center gap-2">
                  <span>Browse All Services</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </CTAButton>
              </a>
            </motion.div>
          </div>
        </div>

        <div
          id="services"
          className="mt-12 mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl px-6 py-10 md:px-8"
        >
          {SERVICES.map((s, i) => (
            <SurfaceCard
              key={s.slug}
              padded={false}
              className="group flex flex-col overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={s.image}
                  alt={s.heroTitle}
                  loading="lazy"
                  className="h-50 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display leading-6 text-lg font-semibold">{s.heroTitle}</h3>
                <p className="mt-4 rounded-lg border border-border border-l-4 border-l-primary bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                  {s.intro}
                </p>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
                  Enterprise Advantage
                </p>
                <ul className="mt-3 space-y-2.5">
                  {s.benefits.slice(0, 6).map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full  text-black">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group/cta mt-6 block"
                >
                  <CTAButton variant="primary" className="w-full rounded-lg">
                    See More Details
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </CTAButton>
                </Link>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>
      <RequestQuoteBanner />
    </SiteLayout>
  );
}
