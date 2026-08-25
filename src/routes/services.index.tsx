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
        <div className="relative ">
          <img src={vanHero} alt="" className="h-100 w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0E141A] via-[#0E141A]/70 to-[#0E141A]/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-12 md:px-8">
              <Pill variant="primary">Supersonic Dynamic Services B.V</Pill>
              <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">
                Our Service Modules.
              </h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                At SUPERSONIC DYNAMIC SERVICES, Our mission is simple: to make our customers journey
                smooth, efficient, and completely stress-free.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl px-6 py-10 md:px-8">
          {SERVICES.map((s) => (
            <SurfaceCard key={s.slug} padded={false} className="overflow-hidden flex flex-col">
              <img
                src={s.image}
                alt={s.heroTitle}
                loading="lazy"
                className="h-50 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold">{s.heroTitle}</h3>
                <p className="mt-3 rounded-lg bg-black/30 p-3 text-xs leading-relaxed text-muted-foreground">
                  {s.intro}
                </p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
                  Enterprise Advantage
                </p>
                <ul className="mt-2 space-y-2">
                  {s.benefits.slice(0, 6).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="mt-6 block">
                  <CTAButton variant="primary" className="w-full rounded-lg">
                    See More Details
                    <ArrowRight className="h-4 w-4" />
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
