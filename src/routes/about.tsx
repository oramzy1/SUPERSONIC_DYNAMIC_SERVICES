import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Target, User } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { CTAButton } from "@/components/shared/CTAButton";
import { RequestQuoteBanner } from "./index";
import ecoVan from "@/assets/images/home-eco.jpg";
import tracking from "@/assets/images/about-tracking.jpg";
import packing from "@/assets/images/about-packing.jpg";

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
      <section className="py-14 md:py-20">
        <header className="mx-auto max-w-7xl px-6">
          <Pill variant="primary" dot>
            Supersonic Dynamic Services B.V.
          </Pill>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold md:text-6xl">
            About Supersonic Dynamic Services B.V.
          </h1>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            SUPERSONIC DYNAMIC SERVICES B.V. is the next-level game changer in the Dutch moving
            services market. We pride in leveraging on our unique value proposition of continuously
            investing in a strong commitment to driving technological innovation, environmental
            sustainability - responsible and sustainable moving solutions.
          </p>
        </header>
        <div className="w-full bg-surface py-15 my-10">
          <div className="mx-auto max-w-7xl px-6 grid gap-5 md:grid-cols-[1.4fr_0.6fr]">
            <SurfaceCard className="border-0 bg-[#1A2027]">
              <h3 className="font-display text-xl font-semibold">Our Mission</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                To be a next-level game changer in the logistics industry by integrating
                hyper-advanced communication with unyielding environmental sustainability. We bridge
                the gap between heavy-duty reliability and weightless digital intelligence.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Tech Innovation", "Eco Drive", "Client Care"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-foreground/85"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard bordered="primary" className="bg-[#D7FFC5] border-0 text-center">
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-full mx-auto">
                <Eye fill="#053900" color="#fff" className="h-5 w-5" />
              </div>
              <h3 className="font-display text-[#053900] text-xl font-semibold">Our Vision</h3>
              <p className="mt-2 text-sm text-[#053900]">
                Leading the global transition to clean, zero emissions logistics by becoming a
                mainstay of intelligent electric fleets.
              </p>
            </SurfaceCard>
          </div>
        </div>

        {/* Founders Section */}
        <section className="mt-24 mx-auto max-w-7xl px-6 overflow-hidden">
          <div className="grid gap-14 lg:grid-cols-[1.4fr_0.6fr] items-center">
            {/* LEFT CONTENT */}
            <div className="w-full">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
                Legacy of Leadership
              </p>

              <h2 className="mt-3 max-w-lg font-display text-3xl font-bold leading-[1.1] text-white md:text-[44px]">
                Founded by Mr. Nweze W. Chukwudi & Henry Obi Ndubuisi
              </h2>

              <div className="mt-4 flex gap-5">
                {/* Vertical Line */}
                <div className="w-px bg-[#5B8CFF]" />

                <div>
                  <p className="max-w-md text-[15px] leading-7 text-white/65">
                    Logistics is the heartbeat of the global economy. At Supersonic, we've
                    engineered that heartbeat to be cleaner, faster, and smarter than ever before.
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/45">
                Under the visionary leadership of Mr. Nweze W. Chukwudi & Henry Obi Ndubuisi,
                Supersonic Dynamic Services B.V. has evolved from a kinetic concept into a premier
                logistics powerhouse. Our foundation is built on the belief that speed should never
                come at the cost of our planet.
              </p>

              <Link to="/about" className="mt-5 inline-block">
                {" "}
                <CTAButton variant="primary" className="rounded">
                  {" "}
                  View Profiles{" "}
                </CTAButton>{" "}
              </Link>
            </div>

            {/* RIGHT FOUNDERS CARDS */}
            <div className="flex items-end justify-start gap-5">
              {[
                {
                  name: "Mr. Nweze W. Chukwudi",
                  role: "Founder & CEO",
                },
                {
                  name: "Mr. Henry Obi Ndubuisi",
                  role: "Co-Founder/COO",
                },
              ].map((founder) => (
                <div
                  key={founder.name}
                  className="
            relative
            flex
            h-85
            w-55
            flex-col
            justify-end
            overflow-hidden
            rounded-[24px]
            border
            border-white/10
            bg-white/6
            p-6
            backdrop-blur-xl
          "
                >
                  {/* Optional Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-b from-white/3 to-transparent" />

                  <div className="relative z-10">
                    <h4 className="max-w-37.5 text-[26px] font-semibold leading-[1.15] text-white">
                      {founder.name}
                    </h4>

                    <p className="mt-2 text-sm text-[#8EA7FF]">{founder.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantage */}
        <div className="bg-[#090F15] w-full py-10 mt-8">
          <div className="mt-20 mx-auto max-w-7xl px-6 text-center">
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
              {" "}
              The Supersonic Advantage
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              At SUPERSONIC DYNAMIC SERVICES, we redefine moving with a seamless, technology-driven,
              and eco-responsible approach that makes your move smooth, efficient, and completely
              stress-free.
            </p>
          </div>
          <div className="mt-10 mx-auto max-w-7xl px-6 space-y-10">
            {ADVANTAGES.map((a, i) => (
              <div key={a.title} className="grid items-center gap-8 md:grid-cols-2">
                {i % 2 === 0 ? (
                  <>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{a.title}</h3>
                      <p className="mt-3 text-sm text-muted-foreground">{a.body}</p>
                    </div>
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="aspect-4/3 w-full rounded-2xl object-cover"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="aspect-4/3 w-full rounded-2xl object-cover order-2 md:order-1"
                    />
                    <div className="order-1 md:order-2">
                      <h3 className="font-display text-2xl font-semibold">{a.title}</h3>
                      <p className="mt-3 text-sm text-muted-foreground">{a.body}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 mx-auto max-w-7xl px-6 text-start">
          <Pill variant="muted">Proven Excellence</Pill>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">What Our Clients Say</h2>
          <p className="mx-auto mt-3 text-sm text-muted-foreground text-start">
            Reliability, speed, and sustainability are at the core of every move. Join thousands of
            satisfied clients across the Netherlands and Europe.
          </p>
        </div>
        <div className="mt-8 grid mx-auto max-w-7xl px-6 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <SurfaceCard key={t.name}>
              <p className="text-3xl text-muted-foreground font-display">"</p>
              <p className="-mt-2 text-sm text-muted-foreground">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {t.role}
                  </p>
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
