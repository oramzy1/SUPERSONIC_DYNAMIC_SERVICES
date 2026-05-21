import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Target } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { CTAButton } from "@/components/shared/CTAButton";
import { RequestQuoteBanner } from "./index";
import ecoVan from "@/assets/home-eco.jpg";
import tracking from "@/assets/about-tracking.jpg";
import packing from "@/assets/about-packing.jpg";

export const Route = createFileRoute("/about")({
  component: About,
});

const ADVANTAGES = [
  {
    image: ecoVan,
    title: "Eco-Friendly Fleet",
    body: "Our primary strength lies in our 100% electric delivery infrastructure. By leveraging the latest European EV technology, we reduce urban emissions in the Netherlands with even fully precision and minimal noise pollution, ensuring a cleaner future for every neighbourhood we serve.",
  },
  {
    image: tracking,
    title: "Advanced Tracking",
    body: "Precision is non-negotiable. Our AI-driven kinetic tracking system services real-time telemetry for every shipment. Using IoT sensors embedded in our packaging, we monitor temperature, humidity, and location with millimetre accuracy across the goods supply chain.",
  },
  {
    image: packing,
    title: "Professional Packing",
    body: "We have innovative load packaging through circular design. Our renowned, heavy-duty reusable crates eliminate the need for single-use plastics and cardboard. Every item is packed with engineered precision to create a zero damage while minimizing maximum operational losses.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Moving was such a stressful thing, but Supersonic made it easy. Their team was professional, courteous and ensured every box was visible. Highly recommend to anyone looking for a reliable mover.",
    name: "Marie van den Berg",
    role: "Family Move • Utrecht",
  },
  {
    quote:
      "Honestly one of the most professional client services I've worked with. Quick to respond and follow-ups were spot-on and very thorough. Exceptional service.",
    name: "Marc Joorbema",
    role: "Business Owner • Amsterdam",
  },
  {
    quote:
      "Excellent experience from start to finish. The pricing was transparent, the team was friendly and respectful. They handled all my belongings with care. Highly recommend.",
    name: "Luca Meyer",
    role: "Student • Rotterdam",
  },
];

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
        <Pill variant="primary" dot>Supersonic Dynamic Services B.V.</Pill>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold md:text-6xl">
          About Supersonic Dynamic Services B.V.
        </h1>
        <p className="mt-5 max-w-3xl text-muted-foreground">
          SUPERSONIC DYNAMIC SERVICES B.V. is the next-level game changer in the Dutch moving services market. We pride in leveraging on our unique value proposition of continuously investing in a strong commitment to driving technological innovation, environmental sustainability — responsible and sustainable moving solutions.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <SurfaceCard>
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold">Our Mission</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              To be a next-level game changer in the logistics industry by integrating hyper-advanced communication with unyielding environmental sustainability. We bridge the gap between heavy-duty reliability and weightless digital intelligence.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Tech Innovation", "Eco Drive", "Client Care"].map((t) => (
                <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-foreground/85">{t}</span>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard bordered="primary" className="bg-primary/10">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold">Our Vision</h3>
            <p className="mt-2 text-sm text-foreground/85">
              Leading the global transition to clean, zero emissions logistics by becoming a mainstay of intelligent electric fleets.
            </p>
          </SurfaceCard>
        </div>

        {/* Founders */}
        <div className="mt-16">
          <Pill variant="primary" dot>Legacy of Leadership</Pill>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold md:text-4xl">
            Founded by Mr. Nweze W. Chukwudi & Henry Obi Ndubuisi
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <SurfaceCard className="lg:col-span-1">
              <p className="text-sm text-muted-foreground">
                Logistics is the heart-beat of the global economy. At Supersonic, we've engineered that heartbeat to be cleaner, faster, and smarter than ever before.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Under the visionary leadership of Mr. Nweze W. Chukwudi & Henry Obi Ndubuisi, Supersonic Dynamic Services B.V. has evolved from a kinetic concept into a centric logistics powerhouse. Our foundation is built on the belief that speed should never come at the cost of our planet.
              </p>
              <Link to="/about" className="mt-5 inline-block">
                <CTAButton variant="primary" className="rounded-xl">View Profiles</CTAButton>
              </Link>
            </SurfaceCard>
            {[
              { name: "Mr. Nweze W. Chukwudi", role: "Founder & CEO" },
              { name: "Mr. Henry Obi Ndubuisi", role: "Co-Founder/COO" },
            ].map((f) => (
              <SurfaceCard key={f.name} className="flex h-full flex-col justify-end">
                <div className="mt-32">
                  <h4 className="font-display text-lg font-semibold">{f.name}</h4>
                  <p className="text-xs text-muted-foreground">{f.role}</p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>

        {/* Advantage */}
        <div className="mt-20 text-center">
          <Pill variant="primary" dot>The Supersonic Advantage</Pill>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">What We Deliver</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            At SUPERSONIC DYNAMIC SERVICES, we redefine moving with a seamless, technology-driven, and eco-responsible approach that makes your move smooth, efficient, and completely stress-free.
          </p>
        </div>
        <div className="mt-10 space-y-10">
          {ADVANTAGES.map((a, i) => (
            <div key={a.title} className="grid items-center gap-8 md:grid-cols-2">
              {i % 2 === 0 ? (
                <>
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{a.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{a.body}</p>
                  </div>
                  <img src={a.image} alt={a.title} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                </>
              ) : (
                <>
                  <img src={a.image} alt={a.title} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover order-2 md:order-1" />
                  <div className="order-1 md:order-2">
                    <h3 className="font-display text-2xl font-semibold">{a.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{a.body}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-20 text-center">
          <Pill variant="primary" dot>Proven Excellence</Pill>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">What Our Clients Say</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Reliability, speed, and sustainability are at the core of every move. Join thousands of satisfied clients across the Netherlands.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <SurfaceCard key={t.name}>
              <p className="text-3xl text-primary font-display">"</p>
              <p className="-mt-2 text-sm text-muted-foreground">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/20" />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{t.role}</p>
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
