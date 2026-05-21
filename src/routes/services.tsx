import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { CTAButton } from "@/components/shared/CTAButton";
import { RequestQuoteBanner } from "./index";
import { SERVICES } from "@/lib/services-data";

export const Route = createFileRoute("/services")({
  component: Services,
});

function Services() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
        <Pill variant="primary" dot>Supersonic Dynamic Services B.V</Pill>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">Our Service Modules</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          At SUPERSONIC DYNAMIC SERVICES, we redefine student and micro-moving with a
          seamless, technology-driven and eco-responsible approach. Our mission is simple: to
          make your move smooth, efficient, and completely stress-free.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <SurfaceCard key={s.slug} padded={false} className="overflow-hidden flex flex-col">
              <img src={s.image} alt={s.heroTitle} loading="lazy" className="h-44 w-full object-cover" />
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
                  <CTAButton variant="primary" className="w-full rounded-xl">
                    See More Details
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

