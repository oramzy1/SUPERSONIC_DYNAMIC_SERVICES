import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Share2 } from "lucide-react";

const HOURS = [
  ["Monday", "8:30 - 17:30", true],
  ["Tuesday", "8:30 - 17:30", true],
  ["Wednesday", "8:30 - 17:30", true],
  ["Thursday", "8:30 - 17:30", true],
  ["Friday", "8:30 - 17:30", true],
  ["Saturday", "Closed", false],
  ["Sunday", "Closed", false],
] as const;

const NAV_LEFT = [
  { label: "About Us", to: "/about" },
  { label: "Request a Quote", to: "/quote" },
  { label: "Vacancies", to: "/about" },
  { label: "Cookies policy", to: "/terms" },
];
const NAV_RIGHT = [
  { label: "Contact", to: "/contact" },
  { label: "Frequently Asked Questions", to: "/faqs" },
  { label: "Privacy policy", to: "/terms" },
  { label: "General terms and conditions", to: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-[#090F15] text-foreground/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4 md:px-8">
        <div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Leading the transition to carbon-neutral logistics in the Netherlands. We combine
            precision engineering with premium moving experiences.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Facebook, Instagram, Share2, Share2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-foreground/80 transition hover:bg-white/10"
                aria-label="social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/90">
            Opening Hours
          </h4>
          <ul className="space-y-3 text-sm">
            {HOURS.map(([d, t, open]) => (
              <li key={d} className="flex items-center justify-between">
                <span className="text-foreground/85">{d}</span>
                <span className={open ? "text-primary font-medium" : "text-red-400 font-medium"}>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/90">
            Quick Navigation
          </h4>
          <ul className="space-y-3 text-sm">
            {NAV_LEFT.map((n) => (
              <li key={n.label} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-foreground/40" />
                <Link to={n.to} className="hover:text-primary">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 invisible text-xs font-semibold uppercase tracking-[0.2em]">.</h4>
          <ul className="space-y-3 text-sm">
            {NAV_RIGHT.map((n) => (
              <li key={n.label} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-foreground/40" />
                <Link to={n.to} className="hover:text-primary">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <div className="space-y-1">
            <div>KvK: 40415533</div>
            <div>BTW-NUMBER: NL804884870B01</div>
            <div>SUPERSONIC DYNAMIC SERVICES B.V. © 2026</div>
          </div>
          <div className="flex items-center gap-3">
            <span>Secure Payments:</span>
            <span className="rounded bg-white/10 px-2 py-1 text-foreground/90">iDEAL</span>
            <span className="rounded bg-white/10 px-2 py-1 text-foreground/90">MC</span>
            <span className="rounded bg-white/10 px-2 py-1 text-foreground/90">VISA</span>
            <span className="rounded bg-white/10 px-2 py-1 text-foreground/90">PayPal</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Certified Movers Mark</span>
            <span className="rounded bg-white/10 px-2 py-1 text-foreground/90">Erkende Verhuizers</span>
            <span className="rounded bg-white/10 px-2 py-1 text-foreground/90">TVM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-primary">Status: All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
