import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { CTAButton } from "@/components/shared/CTAButton";
import { RequestQuoteBanner } from "./index";
import student from "@/assets/service-student.jpg";
import residential from "@/assets/service-residential.jpg";
import enterprise from "@/assets/service-enterprise.jpg";
import storage from "@/assets/service-storage.jpg";
import waste from "@/assets/service-waste.jpg";

export const Route = createFileRoute("/services")({
  component: Services,
});

const SERVICES = [
  {
    image: student,
    title: "Student & Micro Moving",
    description:
      "At SUPERSONIC DYNAMIC SERVICES, we redefine student and micro moving with a seamless, technology-driven and eco-responsible approach.",
    benefits: [
      "Transparent pricing - no hidden fees.",
      "Professional, trained and courteous movers.",
      "Secure handling of sensitive assets & equipment.",
      "Local & Long distance coverage across mother lands",
      "Fast booking & flexible scheduling",
      "Eco-responsible moving solutions (electric vans & sustainable logistics).",
    ],
  },
  {
    image: residential,
    title: "Residential Moving",
    subtitle: "(Local & Long-Distance)",
    description:
      "At SUPERSONIC DYNAMIC SERVICES, we provide comprehensive residential moving solutions across the Netherlands - designed for private individuals, family households, seniors, elderly relocations, care-home transfers, and full house clearances.",
    benefits: [
      "Transparent pricing with no hidden costs",
      "Professional, trained and courteous movers.",
      "Secure handling of sensitive assets & equipment.",
      "Local and long-distance coverage across the Netherlands",
      "Flexible scheduling tailored to your needs.",
      "Eco-responsible moving solutions (electric vans & sustainable logistics).",
    ],
  },
  {
    image: enterprise,
    title: "Enterprise & Commercial Moving",
    subtitle: "(Local & Long-Distance)",
    description:
      "SUPERSONIC DYNAMIC SERVICES is a trusted partner for small, medium, large-scale enterprise and commercial relocations across the Netherlands.",
    benefits: [
      "Dedicated move Project managers and Professional, trained and courteous movers.",
      "Detailed pre-move audits & operational planning site visit.",
      "Local and long-distance coverage across the Netherlands.",
      "Secure handling of sensitive assets & equipment.",
      "After-hours & weekend execution capabilities.",
      "Eco-responsible moving solutions (electric vans & sustainable logistics).",
    ],
  },
  {
    image: storage,
    title: "SMART STORAGE SOLUTIONS",
    subtitle: "(Secure, Flexible & Hassle-Free)",
    description:
      "At SUPERSONIC DYNAMIC SERVICES, we provide safe, flexible, and professionally managed storage solutions tailored for individuals, families, & businesses that need reliable short-term or long-term storage.",
    benefits: [
      "Secure and monitored storage facilities.",
      "Flexible storage durations to suit your needs.",
      "Professional handling and packing.",
      "Easy access and retrieval options.",
      "Integration with our moving services for seamless experiences.",
      "Transparent pricing with no hidden costs.",
    ],
  },
  {
    image: waste,
    title: "SUSTAINABLE WASTE REMOVAL SERVICES",
    subtitle: "(Fast, Responsible & Efficient)",
    description:
      "At SUPERSONIC DYNAMIC SERVICES, we provide fast, efficient, and eco-responsible waste removal services across our regions of operation — helping households and businesses clear unwanted items quickly and responsibly.",
    benefits: [
      "Fast response and same-day or scheduled pickups.",
      "Responsible waste disposal and recycling practices.",
      "Fully equipped and trained removal team.",
      "Suitable for small pickups to large-scale clearances.",
      "Transparent pricing with no hidden fees.",
      "Eco-friendly operations aligned with Dutch regulations.",
    ],
  },
];

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
          {SERVICES.map((s, i) => (
            <SurfaceCard key={i} padded={false} className="overflow-hidden flex flex-col">
              <img src={s.image} alt={s.title} loading="lazy" className="h-44 w-full object-cover" />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold">
                  {s.title}{" "}
                  {s.subtitle && <span className="text-sm text-muted-foreground">{s.subtitle}</span>}
                </h3>
                <p className="mt-3 rounded-lg bg-black/30 p-3 text-xs leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
                  Enterprise Advantage
                </p>
                <ul className="mt-2 space-y-2">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/quote" className="mt-6 block">
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
