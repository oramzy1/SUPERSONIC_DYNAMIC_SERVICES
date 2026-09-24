import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, User, X, Landmark, GraduationCap, Quote, Star } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { CTAButton } from "@/components/shared/CTAButton";
import { RequestQuoteBanner } from "./index";
import ecoVan from "@/assets/images/home-eco.jpg";
import tracking from "@/assets/images/about-tracking.jpg";
import packing from "@/assets/images/about-packing.jpg";
import vanHero from "@/assets/images/hero-van.jpg";
import { motion, AnimatePresence } from "framer-motion";
// FOUNDER PHOTOS: import your images here, then set them on FOUNDER_DATA below, e.g.
// import nwezePhoto from "@/assets/images/founder-nweze.jpg";
// import henryPhoto from "@/assets/images/founder-henry.jpg";

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

// REVIEWS: the section below renders automatically as soon as this list has entries.
// Add real reviews here (or populate it from your API) using this shape.
// `rating` (1-5) is optional; when provided, stars are shown on the card.
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

const TESTIMONIALS: Testimonial[] = [];

// Previous placeholder reviews, kept here for reference and not displayed:
// {
//   quote:
//     "Moving was such a stressful thing, but Supersonic made it easy. Their team was professional, courteous and ensured every box was visible. Highly recommend to anyone looking for a reliable mover.",
//   name: "Marie van den Berg",
//   role: "Family Move • Netherlands",
// },
// {
//   quote:
//     "Honestly one of the most professional client services I've worked with. Quick to respond and follow-ups were spot-on and very thorough. Exceptional service.",
//   name: "Marc Joorbema",
//   role: "Business Owner • Netherlands",
// },
// {
//   quote:
//     "Excellent experience from start to finish. The pricing was transparent, the team was friendly and respectful. They handled all my belongings with care. Highly recommend.",
//   name: "Luca Meyer",
//   role: "Student • Netherlands",
// },

const FOUNDER_DATA = {
  nweze: {
    name: "Mr. NWEZE W. CHUKWUDI",
    role: "CEO & FOUNDER",
    initials: "NC",
    // Set to an imported photo, e.g. image: nwezePhoto
    image: undefined as string | undefined,
    education: [
      "B.Eng. in Chemical Engineering - Niger Delta University, Bayelsa State, Nigeria",
      "M.Sc. in Advanced Chemical Engineering - University of Aberdeen, Scotland, United Kingdom",
    ],
    bio: [
      "Mr. Nweze W. Chukwudi; is the Founder and Chief Executive Officer of SUPERSONIC DYNAMIC SERVICES B.V. He is a skilled international expert from Nigeria who have lived and integrated into the Dutch culture and society with his family for about 5 years now. He is an experienced engineering and business professional with international expertise in logistics, supply chain management, and strategic business development and operations across the United Kingdom and the Netherlands. He holds a Bachelor's Degree in Chemical Engineering from Niger Delta University, Nigeria, and a Master's Degree in Advanced Chemical Engineering from the University of Aberdeen, United Kingdom. With several years of hands-on experience in logistics and relocation services, combined with specialized training in entrepreneurship, leadership, and business management, he brings a strong operational and commercial perspective to the company. Mr. Chukwudi founded SUPERSONIC DYNAMIC SERVICES B.V. with the vision of delivering innovative, reliable, sustainable and customer-focused moving services and freight haulage solutions that create sustainable value for clients, generate employment opportunities and contribute to the Netherlands transition toward a greener and more sustainable economy by leveraging digital innovation and operational excellence.",
    ],
  },
  henry: {
    name: "Mr. HENRY O. N.",
    role: "CO-FOUNDER & COO",
    initials: "HO",
    // Set to an imported photo, e.g. image: henryPhoto
    image: undefined as string | undefined,
    education: [
      "B.Sc. in Accounting and Finance - University of Port-Harcourt, Rivers State, Nigeria",
      "B.A. in International Business - Guangdong Polytechnic Normal University, Guangzhou, China",
      "M.Sc. in International Marketing - Jönköping University, Jönköping, Sweden",
      "MBA - University of Maastricht, Limburg, Netherlands",
    ],
    bio: [
      "Mr. Henry O. N. is a Co-Founder and the Chief Operating Officer of SUPERSONIC DYNAMIC SERVICES B.V. He is an international business and marketing professional with more than 25 years of leadership experience across the construction, catering, and technology sectors. Originally from Nigeria and now fully integrated into Dutch society, he combines a strong multicultural background with advanced academic qualifications, including degrees in Accounting & Finance, International Business, International Marketing (MSc), and an MBA from Maastricht University. As a Co-founder of SUPERSONIC DYNAMIC SERVICES B.V., Henry together with the SUPERSONIC DYNAMIC SERVICES B.V. team, are focused on contributing and strengthening the Netherlands’ transition toward a greener and more sustainable economy by transforming the Dutch moving-services and freight haulage services market through a technology-driven, customer-centric, and environmentally sustainable business model which leverages on digital innovation and operational excellence.",
    ],
  },
};

type FounderKey = keyof typeof FOUNDER_DATA;

function About() {
  const [selectedFounder, setSelectedFounder] = useState<FounderKey | null>(null);

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
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl md:text-6xl">
                About Supersonic Dynamic Services B.V.
              </h1>
              <p className="mt-3 max-w-4xl text-sm sm:text-base text-white/75">
                SUPERSONIC DYNAMIC SERVICES B.V. is the next-level game changer in the Dutch moving
                services market. We pride in leveraging on our unique value proposition of
                continuously investing in a strong commitment to driving technological innovation,
                environmental sustainability - responsible and sustainable moving solutions.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mission and Vision Grid Setup */}
        <div className="w-full bg-surface py-10 md:py-16 my-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 grid-cols-1 md:grid-cols-[1.3fr_0.7fr]"
          >
            <SurfaceCard className="relative overflow-hidden border-0 bg-primary p-6 sm:p-8 text-white transition-shadow duration-300 hover:shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
              <h3 className="relative font-display text-xl font-semibold">Our Mission</h3>
              <p className="relative mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
                The mission of SUPERSONIC DYNAMIC SERVICES B.V. is to Build the Netherlands most
                trusted, transparent, digitally driven, and environmentally sustainable moving
                services and freight haulage services.
              </p>
              <div className="relative mt-5 flex flex-wrap gap-2">
                {["Tech Innovation", "Eco Drive", "Client Care"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard
              bordered="primary"
              className="border-0 bg-secondary text-center p-6 sm:p-8 flex flex-col justify-center items-center transition-shadow duration-300 hover:shadow-sm"
            >
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-primary">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display text-primary text-xl font-semibold">Our Vision</h3>
              <p className="mt-3 text-xs sm:text-sm text-foreground/75 leading-relaxed">
                The vision of SUPERSONIC DYNAMIC SERVICES B.V. is to be in the forefront of the
                Dutch moving and freight haulage services market changing the game as one of the
                leading innovative technology and sustainability driven moving and freight haulage
                service providers in the Netherlands.
              </p>
            </SurfaceCard>
          </motion.div>
        </div>

        {/* Founders Leadership and Identity Cards */}
        <section className="mt-16 md:mt-24 mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-4xl border border-border bg-surface p-6 sm:p-10 lg:p-14"
          >
            {/* Ambient glow accents */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative grid gap-12 lg:gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
              {/* LEFT CONTENT */}
              <div className="w-full space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-primary" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                    Legacy of Leadership
                  </p>
                </div>

                <h2 className="font-display text-balance text-2xl font-bold leading-[1.15] tracking-tight sm:text-3xl md:text-[44px]">
                  Founded by <span className="text-primary">Mr. Nweze W. Chukwudi</span> &{" "}
                  <span className="text-primary">Henry O. N.</span>
                </h2>

                <div className="relative rounded-2xl border border-border bg-background/60 p-5 sm:p-6">
                  <Quote className="absolute -top-3 left-5 h-7 w-7 rounded-full bg-primary p-1.5 text-white shadow-md shadow-primary/30" />
                  <div className="flex gap-4">
                    <div className="w-0.5 rounded-full bg-primary shrink-0" />
                    <p className="text-sm sm:text-[15px] leading-6 sm:leading-7 text-foreground/80 font-medium">
                      Logistics is the heartbeat of the global economy. At Supersonic, we've
                      engineered that heartbeat to be cleaner, faster, and smarter than ever before.
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-muted-foreground">
                  Under the visionary leadership of Mr. Nweze W. Chukwudi & Henry Obi Ndubuisi,
                  Supersonic Dynamic Services B.V. has evolved from a kinetic concept into a premier
                  logistics powerhouse. Our foundation is built on the belief that speed should
                  never come at the cost of our planet.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <CTAButton
                    variant="primary"
                    className="rounded-lg"
                    onClick={() => setSelectedFounder("nweze")}
                  >
                    CEO Profile
                  </CTAButton>
                  <CTAButton
                    variant="secondary"
                    className="rounded-lg"
                    onClick={() => setSelectedFounder("henry")}
                  >
                    COO Profile
                  </CTAButton>
                </div>
              </div>

              {/* RIGHT FOUNDERS PHOTO CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-5 w-full h-auto pb-2 sm:pb-12">
                {(Object.keys(FOUNDER_DATA) as FounderKey[]).map((key, idx) => {
                  const founder = FOUNDER_DATA[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedFounder(key)}
                      className={`group relative w-full text-left cursor-pointer focus:outline-none ${
                        idx === 1 ? "sm:mt-12" : ""
                      }`}
                    >
                      {/* Offset outline frame */}
                      <div className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-3xl border border-primary/25 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />

                      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10 group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
                        {/* Portrait area */}
                        <div className="relative aspect-4/5 overflow-hidden bg-linear-to-br from-primary/15 via-primary/5 to-emerald-500/10">
                          {founder.image ? (
                            <>
                              <img
                                src={founder.image}
                                alt={founder.name}
                                loading="lazy"
                                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/25 to-transparent" />
                            </>
                          ) : (
                            <div className="absolute inset-0 grid place-items-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="grid h-20 w-20 place-items-center rounded-full border border-primary/20 bg-white/70 text-primary shadow-sm">
                                  <User className="h-9 w-9" />
                                </div>
                                <span className="font-display text-4xl font-bold tracking-tight text-primary/30">
                                  {founder.initials}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* View badge */}
                          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                            <Eye className="h-4 w-4" />
                          </span>
                        </div>

                        {/* Caption */}
                        <div className="space-y-2 border-t border-border p-5">
                          <h4 className="text-base sm:text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                            {founder.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="h-px w-6 bg-primary" />
                            <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                              {founder.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Advantage Section */}
        <div className="bg-surface-2 w-full py-12 md:py-20 mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 text-center"
          >
            <h2 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">
              The Supersonic Advantage
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground">
              At SUPERSONIC DYNAMIC SERVICES, we redefine moving with a seamless, technology-driven,
              and eco-responsible approach that makes your move smooth, efficient, and completely
              stress-free.
            </p>
          </motion.div>

          <div className="mt-12 mx-auto max-w-7xl px-4 sm:px-6 space-y-12 md:space-y-16">
            {ADVANTAGES.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="grid items-center gap-6 md:grid-cols-2"
              >
                <div className={i % 2 === 0 ? "order-1" : "order-1 md:order-2"}>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold">{a.title}</h3>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {a.body}
                  </p>
                </div>
                <div className={i % 2 === 0 ? "order-2" : "order-2 md:order-1"}>
                  <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="aspect-4/3 w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-24 mx-auto max-w-7xl px-4 sm:px-6 text-start"
        >
          <Pill className="text-black">Proven Excellence</Pill>
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground">
            Reliability, speed, and sustainability are at the core of every move. Join thousands of
            satisfied clients across the Netherlands and Europe.
          </p>
        </motion.div>

        {TESTIMONIALS.length > 0 ? (
          <div className="mt-8 grid mx-auto max-w-7xl mb-15 px-4 sm:px-6 gap-5 grid-cols-1 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <SurfaceCard className="h-full border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                  <p className="text-3xl text-primary/20 font-display leading-none">"</p>
                  {t.rating ? (
                    <div className="mt-1 mb-2 flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-3.5 w-3.5 ${
                            n <= (t.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                  ) : null}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed -mt-1">
                    {t.quote}
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
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
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state: shown until the first review is added to TESTIMONIALS */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-8 mx-auto max-w-7xl mb-15 px-4 sm:px-6"
          >
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-primary/30 bg-linear-to-br from-primary/5 via-surface to-emerald-500/5 px-6 py-12 sm:py-16 text-center">
              <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                  <Quote className="h-6 w-6" />
                </div>
                <div className="flex gap-1" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-4 w-4 text-primary/25" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Customer reviews will appear here as soon as we start receiving them.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <RequestQuoteBanner />

      {/* MODAL BIOGRAPHY DIALOG WINDOW - HIGHEST Z-INDEX OVERLAY */}
      <AnimatePresence>
        {selectedFounder && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Translucent Backdrop Blur layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedFounder(null)}
            />

            {/* Modal Container Window Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative bg-white border border-border w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-xl text-left custom-scrollbar flex flex-col"
            >
              {/* Header Area */}
              <div className="flex items-start justify-between gap-4 border-b border-border p-6 sm:p-8 md:p-10 pb-5 sticky top-0 bg-white z-10">
                <div className="flex items-start gap-4 min-w-0">
                  {/* Founder avatar */}
                  <div className="hidden sm:grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/15 to-primary/5 text-primary">
                    {FOUNDER_DATA[selectedFounder].image ? (
                      <img
                        src={FOUNDER_DATA[selectedFounder].image}
                        alt={FOUNDER_DATA[selectedFounder].name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <span className="font-display text-xl font-bold">
                        {FOUNDER_DATA[selectedFounder].initials}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase px-2.5 py-1 bg-primary/10 rounded-md border border-primary/20 inline-block">
                      {FOUNDER_DATA[selectedFounder].role}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground mt-3">
                      {FOUNDER_DATA[selectedFounder].name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium">
                      <span className="inline-flex items-center gap-1">Leadership Executive</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFounder(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-border transition focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main Content Area Container with consistent padding */}
              <div className="p-6 sm:p-8 md:p-10 pt-2 space-y-8 flex-1">
                {/* Academic Credentials Box */}
                <div className="bg-muted border border-border rounded-xl p-5 md:p-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" /> Education & Credentials
                  </h4>
                  <ul className="space-y-3 text-xs sm:text-sm text-foreground/85 list-none pl-0">
                    {FOUNDER_DATA[selectedFounder].education.map((edu, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0 opacity-80" />
                        <span className="leading-normal font-medium tracking-wide">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Main Statement Text Area / Professional Biography */}
                <div className="space-y-5 text-sm sm:text-base text-foreground/80 font-normal leading-relaxed tracking-wide border-l-2 border-primary/25 pl-4 sm:pl-6">
                  {FOUNDER_DATA[selectedFounder].bio.map((paragraph, index) => (
                    <p key={index} className="opacity-95 font-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Footer Control Box */}
              <div className="border-t border-border p-6 sm:px-8 md:px-10 py-4 flex justify-end sticky bottom-0 bg-white z-10">
                <CTAButton
                  variant="primary"
                  className="rounded-md px-6 py-2.5 text-xs font-bold tracking-wide"
                  onClick={() => setSelectedFounder(null)}
                >
                  Close Profile
                </CTAButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SiteLayout>
  );
}
