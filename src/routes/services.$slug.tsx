import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { CTAButton } from "@/components/shared/CTAButton";
import { getService, SERVICES } from "@/lib/services-data";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.service
      ? [
          { title: `${loaderData.service.title} - Supersonic Dynamic Services` },
          { name: "description", content: loaderData.service.intro },
        ]
      : [],
  }),
  component: ServiceDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Service not found</h1>
        <Link to="/services" className="mt-6 inline-block text-primary">
          Back to services
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ServiceDetail() {
  const { service } = Route.useLoaderData() as {
    service: NonNullable<ReturnType<typeof getService>>;
  };
  const navigate = useNavigate();
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative h-full w-full overflow-hidden md:h-120">
        <motion.img
          src={service.image}
          alt={service.heroTitle}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/85 via-foreground/55 to-foreground/20" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-foreground" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-6 md:px-8 md:py-8">
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate({ to: "/services" })}
            aria-label="Back to services"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-primary shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-3xl"
          >
            <Pill className="text white">Supersonic Dynamic Services B.V</Pill>
            <h1 className="mt-4 mb-7 font-display text-3xl font-bold leading-tight text-white md:text-5xl">
              {service.heroTitle}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
        <h2 className="max-w-3xl font-display text-xl font-semibold leading-snug md:text-2xl">
          {service.title}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-10"
        >
          <p className="text-sm leading-relaxed text-foreground/85 md:text-base">
            <span className="font-bold">{service.intro.split(",")[0]},</span>
            {service.intro.substring(service.intro.indexOf(",") + 1)}
          </p>

          {service.body.map((p, i) => (
            <p
              key={i}
              className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-[15px]"
            >
              {p}
            </p>
          ))}

          {service.expertise && (
            <div className="mt-6">
              <p className="font-semibold text-foreground">Our expertise covers:</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                {service.expertise}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            {service.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted px-4 py-1.5 text-xs text-foreground/80 transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ADVANTAGES + IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 grid gap-6 md:grid-cols-2"
        >
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold">Enterprise Advantages</h3>
            <ul className="mt-6 space-y-1">
              {service.benefits.map((b, i) => (
                <li
                  key={i}
                  className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-1.5 text-sm text-foreground/85 transition-colors duration-200 hover:bg-muted"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 grid gap-6 md:grid-cols-2 md:items-start"
        >
          <div className="rounded-2xl text-foreground/85">
            {service.quoteGuidance && (
              <p className="mt-0 max-w-xl rounded-2xl border border-border bg-surface p-6 text-sm leading-relaxed transition-shadow duration-300 hover:shadow-sm">
                {service.quoteGuidance.primary}
              </p>
            )}
            <Link to="/quoterequest" className="group inline-block">
              <CTAButton
                variant="primary"
                className="rounded-lg px-12 mb-3 py-3 tracking-tight mt-4 text-base"
              >
                Request Your Free Quote
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </CTAButton>
            </Link>
          </div>

          {service.quoteGuidance && (
            <div className="rounded-2xl border border-border bg-surface p-6 transition-shadow duration-300 hover:shadow-sm">
              <p className="text-sm leading-relaxed text-foreground/85">
                {service.quoteGuidance.contactLead}{" "}
                <a
                  href="mailto:info@supersonicdynamicservices.nl"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  info@supersonicdynamicservices.nl
                </a>{" "}
                {service.quoteGuidance.contactTrail}{" "}
                <a
                  href="tel:+31684336600"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  +31 06 84 336 600
                </a>{" "}
                to schedule a pre-move audit & operational planning site visit.
              </p>
            </div>
          )}
        </motion.div>

        {/* RELATED */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <h3 className="mb-6 font-display text-xl font-semibold">Other Services</h3>
          <div className="grid gap-5 md:grid-cols-3">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:ring-1 hover:ring-primary/60"
              >
                <div className="overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.heroTitle}
                    className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display text-sm font-semibold">{s.heroTitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>
    </SiteLayout>
  );
}