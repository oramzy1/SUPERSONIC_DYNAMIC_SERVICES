import { createFileRoute, Link } from "@tanstack/react-router";
import { Cookie, ShieldCheck, ToggleLeft, Info, Mail } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CTAButton } from "@/components/shared/CTAButton";
import { Pill } from "@/components/shared/Pill";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy - Supersonic Dynamic Services B.V." },
      {
        name: "description",
        content:
          "How Supersonic Dynamic Services B.V. uses cookies and tracking technologies on our platform.",
      },
    ],
  }),
  component: Cookies,
});

const COOKIE_TYPES = [
  {
    label: "Essential",
    color: "text-[#6FE5FF]",
    border: "border-[#6FE5FF]/20",
    bg: "bg-[#6FE5FF]/5",
    dot: "bg-[#6FE5FF]",
    required: true,
    description:
      "Required for the platform to function. These enable core features like session management, security tokens, and quote form state. Cannot be disabled.",
    examples: ["Session token", "CSRF protection", "Load balancing"],
  },
  {
    label: "Analytics",
    color: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5",
    dot: "bg-primary",
    required: false,
    description:
      "Used via Google Tag Manager to understand how visitors interact with our platform. Data is anonymised and never sold to third parties.",
    examples: ["Page views", "Session duration", "Traffic source"],
  },
  {
    label: "Functional",
    color: "text-foreground",
    border: "border-white/10",
    bg: "bg-surface",
    dot: "bg-foreground/60",
    required: false,
    description:
      "Enhance your experience by remembering preferences such as language and region settings across sessions.",
    examples: ["Language preference", "Region setting", "UI state"],
  },
  {
    label: "Marketing",
    color: "text-muted-foreground",
    border: "border-white/5",
    bg: "bg-black/20",
    dot: "bg-muted-foreground",
    required: false,
    description:
      "Currently disabled. Supersonic does not run retargeting or cross-site advertising campaigns at this time.",
    examples: ["Disabled", "Not collected", "Not shared"],
  },
];

function Cookies() {
  return (
    <SiteLayout marquee={false}>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-linear-to-br from-[#0E141A] via-[#0b1a3a]/40 to-[#0E141A]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <Pill variant="cyan" dot>Transparency Framework</Pill>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            Cookie <br /> Policy
          </h1>
          <div className="mt-8 flex items-end justify-between border-b border-white/10 pb-6">
            <p className="max-w-lg text-sm text-muted-foreground">
              We believe in full transparency about how our platform uses cookies and
              tracking technologies. This policy explains what we collect, why, and your rights.
            </p>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Last Updated
              </p>
              <p className="mt-1 font-display text-base font-semibold text-primary">JAN 2026.V1</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8 space-y-6">

        {/* WHAT ARE COOKIES */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-surface p-6 md:col-span-2 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-[#6FE5FF]">
                01. What Are Cookies?
              </h2>
              <Cookie className="h-14 w-14 text-white/10" />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Cookies are small text files stored on your device when you visit a website. They allow
              platforms to remember information about your visit - such as your preferred language or
              form state - making your next visit easier and the site more useful.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              At Supersonic Dynamic Services B.V., we use cookies responsibly and in accordance with
              the Dutch Telecommunications Act (Telecommunicatiewet) and the EU ePrivacy Directive.
              You have the right to accept, reject, or manage non-essential cookies at any time.
            </p>
          </div>

          {/* GDPR BADGE */}
          <div className="rounded-2xl border border-[#002B73]/70 bg-[#002B73]/30 p-6 md:p-8">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#6FE5FF]/60 text-[#6FE5FF]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold">GDPR Compliant</h2>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Our cookie practices comply with the General Data Protection Regulation (GDPR) and
              Dutch national data law (UAVG).
            </p>
            <ul className="mt-5 space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-foreground/85">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Consent-based tracking
              </li>
              <li className="flex items-center gap-2 text-foreground/85">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> No data sold to third parties
              </li>
              <li className="flex items-center gap-2 text-foreground/85">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Right to withdraw consent
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Marketing cookies disabled
              </li>
            </ul>
          </div>
        </div>

        {/* COOKIE TYPES */}
        <div className="rounded-2xl bg-surface p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <ToggleLeft className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">02. Cookie Types We Use</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {COOKIE_TYPES.map((c) => (
              <div key={c.label} className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                    <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${c.color}`}>
                      {c.label}
                    </span>
                  </div>
                  <span className={`text-[10px] rounded-full px-2 py-0.5 border ${
                    c.required
                      ? "border-[#6FE5FF]/30 text-[#6FE5FF] bg-[#6FE5FF]/10"
                      : "border-white/10 text-muted-foreground"
                  }`}>
                    {c.required ? "Required" : "Optional"}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.examples.map((e) => (
                    <span key={e} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-foreground/60">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW WE USE GTM */}
        <div className="rounded-2xl bg-surface p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">03. Google Tag Manager & Analytics</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Our platform uses Google Tag Manager (GTM-WFZ99JP4) to manage analytics tags, including
            Google Analytics 4 (GA4). This helps us understand platform usage patterns to improve
            our services. IP addresses are anonymised by default, and data is processed in accordance
            with Google's data processing terms.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Tag Manager", "GTM-WFZ99JP4", "Container ID"],
              ["Analytics", "GA4 / G-H4PXL6HMXK", "Measurement ID"],
              ["Data Region", "European Union", "Processing location"],
            ].map(([title, value, sub]) => (
              <div key={title} className="rounded-xl bg-black/30 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{sub}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 font-mono text-xs text-[#6FE5FF]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* YOUR RIGHTS */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-surface p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold mb-4">04. Your Rights</h2>
            <ul className="space-y-4">
              {[
                ["A.", "Withdraw Consent:", "You may withdraw cookie consent at any time by clearing your browser cookies or adjusting settings below."],
                ["B.", "Access & Portability:", "Request a copy of any personal data we hold, including analytics identifiers."],
                ["C.", "Right to Erasure:", "Request deletion of your data from our analytics systems at any time."],
              ].map(([letter, title, desc]) => (
                <li key={letter} className="flex items-start gap-3">
                  <span className="mt-0.5 text-xs font-semibold text-primary">{letter}</span>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">{title}</span> {desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-surface p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold mb-4">05. Contact & Questions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For questions about our cookie practices or to exercise your data rights, contact our
              Data Protection Officer directly.
            </p>
            <div className="mt-5 flex items-start gap-3">
              <Mail className="mt-1 h-4 w-4 text-[#6FE5FF]" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <p className="mt-1 text-xs text-[#6FE5FF]">info@supersonicdynamicservices.nl</p>
              </div>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              You also have the right to lodge a complaint with the Dutch Data Protection Authority
              (Autoriteit Persoonsgegevens) at{" "}
              <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-[#6FE5FF] hover:underline">
                autoriteitpersoonsgegevens.nl
              </a>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#9DB1E6]/90 p-6 text-[#0E141A] md:flex-row md:items-center md:p-10">
          <div>
            <h3 className="font-display text-2xl font-bold">Still Have Questions?</h3>
            <p className="mt-1 text-sm text-[#0E141A]/80">
              Our team is ready to clarify anything about how we handle your data.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/contact">
              <CTAButton variant="secondary" className="rounded-xl bg-[#0E141A] text-white hover:bg-black px-6">
                Contact Us
              </CTAButton>
            </Link>
            <Link to="/privacy">
              <CTAButton variant="outline" className="rounded-xl border-[#0E141A]/20 text-[#0E141A] px-6">
                Privacy Policy
              </CTAButton>
            </Link>
          </div>
        </div>

      </section>
    </SiteLayout>
  );
}