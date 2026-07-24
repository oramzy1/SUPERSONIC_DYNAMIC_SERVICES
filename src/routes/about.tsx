import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, User, X, Landmark, GraduationCap } from "lucide-react";
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
  head: () => ({
    meta: [
      { title: "About - Supersonic Dynamic Services B.V." },
      {
        name: "description",
        content:
          "Supersonic Dynamic Services B.V. is the next level game changer in the Dutch moving services market. Eco-responsible, technology-powered moving across the Netherlands.",
      },
    ],
  }),
});

const ADVANTAGES = [
  {
    image: ecoVan,
    title: "Eco-Friendly Fleet",
    body: "Your move deserves a service that's both reliable and environmentally responsible. Our electric fleet allows us to transport your belongings safely and efficiently while reducing our environmental impact, helping create a greener Netherlands for everyone.",
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
    role: "Family Move • Netherlands",
  },
  {
    quote:
      "Honestly one of the most professional client services I've worked with. Quick to respond and follow-ups were spot-on and very thorough. Exceptional service.",
    name: "Marc Joorbema",
    role: "Business Owner • Netherlands",
  },
  {
    quote:
      "Excellent experience from start to finish. The pricing was transparent, the team was friendly and respectful. They handled all my belongings with care. Highly recommend.",
    name: "Luca Meyer",
    role: "Student • Netherlands",
  },
];

const FOUNDER_DATA = {
  nweze: {
    name: "Mr. NWEZE WIEGI EMI CHUKWUDI",
    role: "CEO & FOUNDER",
    education: [
      "B.Eng. in Chemical Engineering - Niger Delta University, Bayelsa State, Nigeria",
      "M.Sc. in Advanced Chemical Engineering - University of Aberdeen, Scotland, United Kingdom",
    ],
    bio: [
      "Mr. Nweze Wiengi Emi Chukwudi; is the Founder and Chief Executive Officer of SUPERSONIC DYNAMIC SERVICES B.V. He is a skilled international expert from Nigeria who have lived and integrated into the Dutch culture and society with his family for about 5 years now. He is an experienced engineering and business professional with international expertise in logistics, supply chain management, and strategic business development and operations across the United Kingdom and the Netherlands. He holds a Bachelor's Degree in Chemical Engineering from Niger Delta University, Nigeria, and a Master's Degree in Advanced Chemical Engineering from the University of Aberdeen, United Kingdom. With several years of hands-on experience in logistics and relocation services, combined with specialized training in entrepreneurship, leadership, and business management, he brings a strong operational and commercial perspective to the company. Mr. Chukwudi founded SUPERSONIC DYNAMIC SERVICES B.V. with the vision of delivering innovative, reliable, sustainable and customer-focused moving services and freight haulage solutions that create sustainable value for clients, generate employment opportunities and contribute to the Netherlands transition toward a greener and more sustainable economy by leveraging digital innovation and operational excellence.",
    ],
  },
  henry: {
    name: "Mr. HENRY OBI NDUBISI",
    role: "CO-FOUNDER & COO",
    education: [
      "B.Sc. in Accounting and Finance - University of Port-Harcourt, Rivers State, Nigeria",
      "B.A. in International Business - Guangdong Polytechnic Normal University, Guangzhou, China",
      "M.Sc. in International Marketing - Jönköping University, Jönköping, Sweden",
      "MBA - University of Maastricht, Limburg, Netherlands",
    ],
    bio: [
      "Mr. Henry Ndubisi Obi is a Co-Founder and the Chief Operating Officer of SUPERSONIC DYNAMIC SERVICES B.V. He is an international business and marketing professional with more than 25 years of leadership experience across the construction, catering, and technology sectors. Originally from Nigeria and now fully integrated into Dutch society, he combines a strong multicultural background with advanced academic qualifications, including degrees in Accounting & Finance, International Business, International Marketing (MSc), and an MBA from Maastricht University. As a Co-founder of SUPERSONIC DYNAMIC SERVICES B.V., Henry together with the SUPERSONIC DYNAMIC SERVICES B.V. team, are focused on contributing and strengthening the Netherlands’ transition toward a greener and more sustainable economy by transforming the Dutch moving-services and freight haulage services market through a technology-driven, customer-centric, and environmentally sustainable business model which leverages on digital innovation and operational excellence.",
    ],
  },
};

type FounderKey = keyof typeof FOUNDER_DATA;

function About() {
  const [selectedFounder, setSelectedFounder] = useState<FounderKey | null>(null);

  return (
    <SiteLayout>
      <section className="py-10 md:py-20 overflow-x-hidden">
        <header className="mx-auto max-w-7xl px-4 sm:px-6">
          <Pill variant="primary" dot>
            Supersonic Dynamic Services B.V.
          </Pill>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold sm:text-4xl md:text-6xl">
            About Supersonic Dynamic Services B.V.
          </h1>
          <p className="mt-5 max-w-3xl text-sm sm:text-base text-muted-foreground">
            SUPERSONIC DYNAMIC SERVICES B.V. is the next-level game changer in the Dutch moving
            services market. We pride in leveraging on our unique value proposition of continuously
            investing in a strong commitment to driving technological innovation, environmental
            sustainability - responsible and sustainable moving solutions.
          </p>
        </header>

        {/* Mission and Vision Grid Setup */}
        <div className="w-full bg-surface py-10 md:py-16 my-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 grid-cols-1 md:grid-cols-[1.3fr_0.7fr]">
            <SurfaceCard className="border-0 bg-[#1A2027] p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold">Our Mission</h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                The mission of SUPERSONIC DYNAMIC SERVICES B.V. is to Build the Netherlands most
                trusted, transparent, digitally driven, and environmentally sustainable moving
                services and freight haulage services.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Tech Innovation", "Eco Drive", "Client Care"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/2 px-3 py-1 text-[11px] text-foreground/85"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard
              bordered="primary"
              className="bg-[#D7FFC5] border-0 text-center p-6 sm:p-8 flex flex-col justify-center items-center"
            >
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#053900]">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display text-[#053900] text-xl font-semibold">Our Vision</h3>
              <p className="mt-3 text-xs sm:text-sm text-[#053900]/90 leading-relaxed">
                The vision of SUPERSONIC DYNAMIC SERVICES B.V. is to be in the forefront of the
                Dutch moving and freight haulage services market changing the game as one of the
                leading innovative technology and sustainability driven moving and freight haulage
                service providers in the Netherlands.
              </p>
            </SurfaceCard>
          </div>
        </div>

        {/* Founders Leadership and Identity Cards */}
        <section className="mt-16 md:mt-24 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            {/* LEFT CONTENT */}
            <div className="w-full space-y-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
                Legacy of Leadership
              </p>

              <h2 className="font-display text-2xl font-bold leading-[1.2] text-white sm:text-3xl md:text-[40px]">
                Founded by Mr. Nweze W. Chukwudi & Henry Obi Ndubuisi
              </h2>

              <div className="flex gap-4">
                <div className="w-0.5 bg-[#5B8CFF] shrink-0" />
                <p className="text-sm sm:text-[15px] leading-6 sm:leading-7 text-white/65">
                  Logistics is the heartbeat of the global economy. At Supersonic, we've engineered
                  that heartbeat to be cleaner, faster, and smarter than ever before.
                </p>
              </div>

              <p className="text-xs sm:text-sm leading-6 text-white/45">
                Under the visionary leadership of Mr. Nweze W. Chukwudi & Henry Obi Ndubuisi,
                Supersonic Dynamic Services B.V. has evolved from a kinetic concept into a premier
                logistics powerhouse. Our foundation is built on the belief that speed should never
                come at the cost of our planet.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <CTAButton
                  variant="primary"
                  className="rounded"
                  onClick={() => setSelectedFounder("nweze")}
                >
                  CEO Profile
                </CTAButton>
                <CTAButton
                  variant="secondary"
                  className="rounded border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => setSelectedFounder("henry")}
                >
                  COO Profile
                </CTAButton>
              </div>
            </div>

            {/* RIGHT FOUNDERS PHOTO CARDS BOXES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-auto">
              {(Object.keys(FOUNDER_DATA) as FounderKey[]).map((key) => {
                const founder = FOUNDER_DATA[key];
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedFounder(key)}
                    className="group relative flex min-h-70 sm:h-80 w-full flex-col justify-end overflow-hidden rounded-[24px] border border-white/10 bg-white/3 p-6 backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/6 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 space-y-1.5">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 -mt-12">
                        <Eye className="h-4 w-4" />
                      </div>
                      <h4 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#8EA7FF]">
                        {founder.name}
                      </h4>
                      <p className="text-xs font-medium tracking-wide text-[#8EA7FF]/90 uppercase">
                        {founder.role}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Advantage Section */}
        <div className="bg-[#090F15] w-full py-12 md:py-20 mt-16 md:mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">
              The Supersonic Advantage
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground">
              At SUPERSONIC DYNAMIC SERVICES, we redefine moving with a seamless, technology-driven,
              and eco-responsible approach that makes your move smooth, efficient, and completely
              stress-free.
            </p>
          </div>

          <div className="mt-12 mx-auto max-w-7xl px-4 sm:px-6 space-y-12 md:space-y-16">
            {ADVANTAGES.map((a, i) => (
              <div key={a.title} className="grid items-center gap-6 md:grid-cols-2">
                <div className={i % 2 === 0 ? "order-1" : "order-1 md:order-2"}>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold">{a.title}</h3>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {a.body}
                  </p>
                </div>
                <div className={i % 2 === 0 ? "order-2" : "order-2 md:order-1"}>
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="aspect-4/3 w-full rounded-2xl object-cover shadow-xl border border-white/5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 md:mt-24 mx-auto max-w-7xl px-4 sm:px-6 text-start">
          <Pill variant="muted">Proven Excellence</Pill>
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground">
            Reliability, speed, and sustainability are at the core of every move. Join thousands of
            satisfied clients across the Netherlands and Europe.
          </p>
        </div>

        <div className="mt-8 grid mx-auto max-w-7xl px-4 sm:px-6 gap-5 grid-cols-1 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <SurfaceCard key={t.name} className="p-6">
              <p className="text-3xl text-muted-foreground font-display leading-none">"</p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed -mt-1">
                {t.quote}
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate">{t.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate mt-0.5">
                    {t.role}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <RequestQuoteBanner />

      {/* MODAL BIOGRAPHY DIALOG WINDOW - HIGHEST Z-INDEX OVERLAY */}
      {selectedFounder && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
          {/* Translucent Backdrop Blur layer */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            onClick={() => setSelectedFounder(null)}
          />

          {/* Modal Container Window Box */}
          <div className="relative bg-[#0d121a] border border-white/10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl text-left custom-scrollbar animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Header Area */}
            <div className="flex items-start justify-between gap-4 border-b border-white/5 p-6 sm:p-8 md:p-10 pb-5 sticky top-0 bg-[#0d121a] z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-[#8EA7FF] uppercase px-2.5 py-1 bg-[#8EA7FF]/10 rounded-md border border-[#8EA7FF]/20 inline-block">
                  {FOUNDER_DATA[selectedFounder].role}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mt-3">
                  {FOUNDER_DATA[selectedFounder].name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1">Leadership Executive</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFounder(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Content Area Container with consistent padding */}
            <div className="p-6 sm:p-8 md:p-10 pt-2 space-y-8 flex-1">
              {/* Academic Credentials Box */}
              <div className="bg-white/2 border border-white/5 rounded-1xl p-5 md:p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#8EA7FF]" /> Education & Credentials
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 list-none pl-0">
                  {FOUNDER_DATA[selectedFounder].education.map((edu, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8EA7FF] mt-2 shrink-0 opacity-80" />
                      <span className="leading-normal font-medium tracking-wide">{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Main Statement Text Area / Professional Biography */}
              <div className="space-y-5 text-sm sm:text-base text-slate-300 font-normal leading-relaxed tracking-wide border-l-2 border-white/5 pl-4 sm:pl-6">
                {FOUNDER_DATA[selectedFounder].bio.map((paragraph, index) => (
                  <p key={index} className="opacity-95 font-light">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer Control Box */}
            <div className="border-t border-white/5 p-6 sm:px-8 md:px-10 py-4 flex justify-end sticky bottom-0 bg-[#0d121a] z-10">
              <CTAButton
                variant="primary"
                className="rounded-md px-6 py-2.5 text-xs font-bold tracking-wide hover:opacity-90 transition-all shadow-lg"
                onClick={() => setSelectedFounder(null)}
              >
                Close Profile
              </CTAButton>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
