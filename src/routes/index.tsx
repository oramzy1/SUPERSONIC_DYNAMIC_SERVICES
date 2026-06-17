import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, Zap } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { CTAButton } from "@/components/shared/CTAButton";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import heroVan from "@/assets/images/hero-van.png";
import heroBg from "@/assets/images/hero-bg.png";
import homeEco from "@/assets/images/home-eco.png";
import homePricing from "@/assets/images/home-pricing.jpg";
import homeTech from "@/assets/images/home-tech.jpg";
import homeHandling from "@/assets/images/home-handling.jpg";
import localVan from "@/assets/images/local-van.png";
import homeTeam from "@/assets/images/home-team.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const STEPS = [
  {
    n: 1,
    title: "Request a Free Quote",
    body: "To access our service, fill out our online questionnaire to upload your video, photos, written request, or schedule a virtual home visit.",
  },
  {
    n: 2,
    title: "Receive Personalized Quote",
    body: "Our team reviews your request and prepares a transparent, no-obligation quote tailored to your move and preferences.",
  },
  {
    n: 3,
    title: "Confirm & Schedule Your Move",
    body: "Accept your quote digitally and receive a convenient day, system, and resource confirmation linked to our tracking app.",
  },
  {
    n: 4,
    title: "We Handle the Move",
    body: "Our certified movers arrive fully prepared with eco precision-led safety, efficient handling, and a passion drive to make every move a top-tier experience.",
  },
  {
    n: 5,
    title: "Track, Pay & Relax",
    body: "Monitor your move progress in real time on our digital tracker, pay one-time via secure online portal, and relax knowing your move is in safe hands.",
  },
  {
    n: 6,
    title: "Move Completed Successfully",
    body: "Once your move is complete, we send your customer satisfaction report - and thank you, your business helps us build a sustainable, cleaner future.",
  },
];

const FEATURE_CARDS = [
  {
    image: homeEco,
    title: "Eco-Friendly Moving Services in Netherlands.",
    body: "Our zero-emission electric vans and reusable crate systems minimize your carbon footprint without compromising on speed.",
    tags: [
      "Low CO₂ Output",
      "Reusable Moving Crates & Cartons",
      "Sustainable Logistics Operations",
      "Efficient Route Planning",
    ],
    object: "object-cover",
  },
  {
    image: homePricing,
    title: "Transparent Pricing With No Hidden Fees.",
    body: "Clear and upfront pricing you can trust from start to finish. No surprise charges or unexpected costs during your move.",
    tags: ["Upfront Quote", "Fixed Pricing", "No Surprises", "Clear Invoices"],
    object: "object-cover",
  },
  {
    image: homeTeam,
    title: "Professional, Trained and Courteous Movers.",
    body: "Experienced movers dedicated to safe and reliable service. Our team ensures every relocation is handled professionally and respectfully.",
    tags: ["Vetted Team", "Safe Handling", "Reliable Service", "Friendly Support"],
    object: "object-cover",
  },
  {
    image: homeTech,
    title: "Technology-Powered Booking and Move Tracking.",
    body: "Book and monitor your move easily through our digital platform. Stay updated in real time from request to final delivery.",
    tags: ["Smart Booking", "Live Tracking", "Digital Updates", "Fast Receipts"],
    object: "object-cover",
  },
  {
    image: homeHandling,
    title: "Secure Handling of Sensitive Equipment and Belongings.",
    body: "Your valuables are handled carefully with maximum protection and care. We prioritize safety throughout packing, transport and delivery.",
    tags: ["Damage Protection", "Secure Packing", "Careful Transport", "Trusted Handling"],
    object: "object-cover",
  },
  {
    image: localVan,
    title: "Local and nationwide moving coverage.",
    body: "Reliable moving services across cities and regions in the Netherlands. Whether nearby or long-distance, we ensure smooth relocation support.",
    tags: ["City Expertise", "Nationwide Move", "Cross-Country Service", "Regional Coverage"],
    object: "object-cover",
  },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-linear-to-b from-[#0E141A]/85 via-[#0E141A]/80 to-[#0E141A]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:px-8 md:py-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Pill variant="primary" dot>
              Netherlands
            </Pill>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] text-foreground md:text-6xl">
              The Next-Generation <br /> Moving & Freight <br />
              <span className="text-foreground/80">Haulage Service.</span>
            </h1>
            <p className="mt-5 max-w-xl tracking-tight text-base text-muted-foreground">
              Professional moving and freight haulage services powered by precision logistics and carbon-neutral fleet -
              experience the most seamless relocation and freight haulage services in the Netherlands.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/quote">
                <CTAButton variant="primary" className="rounded-md px-6 py-3.5">
                  Request Your Free Quote
                </CTAButton>
              </Link>
              <Link to="/services">
                <CTAButton
                  variant="outline"
                  className="rounded-md px-6 bg-[#2F353C] border-[#2F353C] py-3.5"
                >
                  View All Services
                </CTAButton>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface">
              <img
                src={heroVan}
                alt="Electric delivery van"
                className="aspect-4/3 w-full object-cover"
              />
              {/* Glass card */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl glass px-4 py-4 md:bottom-7 md:left-7 md:right-auto md:w-125">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    100% Electric Fleet
                  </p>
                  <p className="text-sm font-semibold">Zero-emission certified</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <div className="mb-12 text-center">
          <Pill variant="primary">How it works</Pill>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Quick Steps On How It works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            At SUPERSONIC DYNAMIC SERVICES, we redefine moving and freight haulage with a seamless,
            technology-driven, and eco-responsible approach. Our mission is simple: to make your
            move smooth, efficient and completely stress-free.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <SurfaceCard coloredBorder key={s.n} transition={{ delay: i * 0.05, duration: 0.45 }}>
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-[#2F353C] text-white font-display text-lg font-bold">
                {s.n}
              </div>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </SurfaceCard>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-8">
        <div className="mb-10">
          <Pill variant="primary">The Supersonic Advantage</Pill>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold md:text-5xl">
            Why Choose Supersonic Dynamic Services?
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {FEATURE_CARDS.map((c, i) => (
            <SurfaceCard key={i} padded={false} className="overflow-hidden">
              <div className="relative">
                <img src={c.image} alt="" loading="lazy" className={`h-56 w-full ${c.object}`} />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-foreground/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <RequestQuoteBanner />
    </SiteLayout>
  );
}

export function RequestQuoteBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:px-8">
      <div className="rounded-3xl bg-[#ABBDF4]/90 p-6 text-[#0E141A] sm:p-8 md:p-12">
        {/* Grid adapts perfectly from single column mobile to 2 columns on desktop */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">
              Request Your Free <br className="hidden sm:inline" /> Moving Quote:
            </h3>
            <p className="mt-4 max-w-md text-sm text-[#0E141A]/80 leading-relaxed">
              Planning a move in the Netherlands? Let SUPERSONIC DYNAMIC SERVICES B.V. handle your
              relocation with professionalism and care. Request your free, no-obligation quote today
              and discover a smarter way to move.
            </p>
            <Link to="/quote" className="mt-6 block w-full sm:w-auto">
              <CTAButton
                variant="secondary"
                className="rounded-md w-full sm:w-auto px-6 py-3.5 justify-center"
              >
                Request Quote
              </CTAButton>
            </Link>
          </div>

          <div className="space-y-3 w-full">
            {/* Call Info Box */}
            <div className="flex items-center gap-4 rounded-2xl bg-[#A1B5ED] px-4 py-4 sm:px-5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white shrink-0">
                <Phone className="h-5 w-5 text-[#002B73]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0E141A]/60">
                  Call us
                </p>
                <p className="font-display text-base font-semibold sm:text-lg truncate">
                  +31 (06) 84 336 600
                </p>
              </div>
            </div>

            {/* Email Info Box - Fixed layout text-wrapping for mobile viewports */}
            <div className="flex items-center gap-4 rounded-2xl bg-[#A1B5ED] px-4 py-4 sm:px-5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white shrink-0">
                <Mail className="h-5 w-5 text-[#002B73]" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0E141A]/60">
                  Email us
                </p>
                <p className="font-display text-base font-semibold sm:text-lg break-all sm:break-normal">
                  info@supersonicdynamicservices.nl
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
