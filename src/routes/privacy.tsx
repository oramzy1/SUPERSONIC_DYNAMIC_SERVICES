import { createFileRoute, Link } from "@tanstack/react-router";
import { Cookie, Gavel, Mail, MapPin, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CTAButton } from "@/components/shared/CTAButton";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Data Ethics - Supersonic Dynamic Services" },
      {
        name: "description",
        content:
          "Our regulatory framework, privacy practices, cookies and user rights at Supersonic Dynamic Services B.V.",
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  const { prefs, openBanner } = useCookieConsent();

  return (
    <SiteLayout marquee={false}>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-emerald-500/5" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <h1 className="mt-8 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Privacy & <br /> Data Ethics
          </h1>
          <div className="mt-8 flex items-end justify-between border-b border-border pb-6">
            <div />
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Last Updated
              </p>
              <p className="mt-1 font-display text-base font-semibold text-primary">NOV 2026.V2</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* DATA PROTECTION */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:col-span-2 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-primary">
                  01. Data Protection
                </h2>
              </div>
              <ShieldCheck className="h-14 w-14 text-primary/15" />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              At Supersonic Dynamic Services B.V., precision engineering extends to how we handle
              your information. We operate under a "Privacy by Design" mandate, ensuring that every
              logistics node in our network maintains the highest level of encryption and integrity.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We process personal data only when necessary to fulfill our precision-logistics
              obligations. This includes name, contact details, and geolocation data specifically
              for real-time tracking of high-speed fleet movements.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Transit Security
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  End-to-end encryption for all operational communications within the Supersonic
                  fleet.
                </p>
              </div>
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Data Retention
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Automatic purging of sensitive transit data 90 days after successful delivery
                  confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* COOKIE POLICY */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm md:p-8">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              <Cookie className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold text-foreground">Cookie Policy</h2>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Our platform utilizes technical cookies to optimize fleet visualization and session
              stability. We do not track users across third-party domains.
            </p>
            <ul className="mt-5 space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-foreground/85">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ESSENTIAL - ALWAYS ON
              </li>
              <li
                className={`flex items-center gap-2 ${prefs.analytics ? "text-foreground/85" : "text-muted-foreground"}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${prefs.analytics ? "bg-primary" : "bg-slate-400"}`}
                />
                ANALYTICS - {prefs.analytics ? "ENABLED" : "DISABLED"}
              </li>
              <li
                className={`flex items-center gap-2 ${prefs.functional ? "text-foreground/85" : "text-muted-foreground"}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${prefs.functional ? "bg-primary" : "bg-slate-400"}`}
                />
                FUNCTIONAL - {prefs.functional ? "ENABLED" : "DISABLED"}
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> MARKETING -
                DISABLED
              </li>
            </ul>
            <CTAButton
              variant="white"
              className="mt-6 w-full rounded-xl bg-primary! text-primary-foreground! border-transparent! shadow-md shadow-primary/25 hover:opacity-90"
              onClick={openBanner}
            >
              MANAGE PREFERENCES
            </CTAButton>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* USER RIGHTS */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <Gavel className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold text-foreground">User Rights</h2>
            </div>
            <ul className="mt-5 space-y-4 text-sm">
              {[
                [
                  "A.",
                  "Right to Rectification:",
                  "Request correction of inaccurate logistical or profile data.",
                ],
                [
                  "B.",
                  "Data Portability:",
                  "Obtain a structured, machine-readable format of your interaction history.",
                ],
                [
                  "C.",
                  "The Right to Erasure:",
                  'The "Right to be Forgotten" within our kinetic storage systems.',
                ],
              ].map(([letter, title, desc]) => (
                <li key={letter} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                    {letter}
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">{title}</span> {desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* PRIVACY QUERIES */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
            <h2 className="font-display text-xl font-semibold text-foreground">Privacy Queries</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For inquiries regarding GDPR compliance, data subjects requests, or automated
              processing concerns, contact our Data Protection Office.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Email Terminal
                  </p>
                  <p className="mt-1 wrap-break-word text-xs font-medium text-primary">info@supersonicdynamicservices.nl</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    HQ Command
                  </p>
                  <p className="mt-1 text-xs font-medium text-primary">Amsterdam, NL</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HAVE ANY ISSUES */}
        <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary/15 bg-linear-to-br from-primary/5 via-surface to-emerald-500/5 p-6 shadow-sm md:flex-row md:items-center md:p-10">
          <div>
            <h3 className="font-display text-2xl font-semibold text-foreground">Have Any Issues?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our support team are ready to assist with help
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/schedulecall">
              <CTAButton
                variant="white"
                className="rounded-xl px-6 bg-primary! text-primary-foreground! border-transparent! shadow-md shadow-primary/25 hover:opacity-90"
              >
                Schedule a Call
              </CTAButton>
            </Link>

            <Link to="/contact">
              <CTAButton
                variant="outline"
                className="rounded-xl px-6 bg-white! text-slate-700! border-slate-300! hover:bg-slate-50!"
              >
                Contact Us
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}