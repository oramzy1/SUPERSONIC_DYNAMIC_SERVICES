import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
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
      <section className="relative h-85 w-full overflow-hidden md:h-110">
        <img
          src={service.image}
          alt={service.heroTitle}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0E141A]/85 via-[#0E141A]/55 to-[#0E141A]/20" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#0E141A]" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-6 md:px-8 md:py-8">
          <button
            onClick={() => navigate({ to: "/services" })}
            aria-label="Back to services"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0E141A] shadow-lg transition hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl font-display text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl"
          >
            {service.heroTitle}
          </motion.h1>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
        <h2 className="max-w-3xl font-display text-1xl font-semibold leading-snug md:text-2xl">
          {service.title}
        </h2>

        <div className="mt-8 rounded-2xl bg-surface p-6 md:p-10">
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
                className="rounded-full border border-white/10 bg-white/3 px-4 py-1.5 text-xs text-foreground/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ADVANTAGES + IMAGE */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-surface p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold">Enterprise Advantages</h3>
            <ul className="mt-6 space-y-4">
              {service.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="mt-10">
          <Link to="/quote">
            <CTAButton variant="primary" className="rounded-xl px-8 py-4 text-base">
              Request Your Free Quote
            </CTAButton>
          </Link>
        </div>

        {/* RELATED */}
        <div className="mt-20">
          <h3 className="mb-6 font-display text-xl font-semibold">Other Services</h3>
          <div className="grid gap-5 md:grid-cols-3">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group overflow-hidden rounded-2xl bg-surface transition hover:ring-1 hover:ring-primary/60"
              >
                <img
                  src={s.image}
                  alt={s.heroTitle}
                  className="h-36 w-full object-cover transition group-hover:scale-[1.02]"
                />
                <div className="p-4">
                  <p className="font-display text-sm font-semibold">{s.heroTitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
