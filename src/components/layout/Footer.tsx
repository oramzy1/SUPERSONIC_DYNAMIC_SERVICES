import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Share2,
  MessageSquare,
  X,
  ChevronUp,
  Ticket,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

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
  { label: "Cookies policy", to: "/privacy" },
];
const NAV_RIGHT = [
  { label: "Contact", to: "/contact" },
  { label: "Frequently Asked Questions", to: "/faqs" },
  { label: "Privacy policy", to: "/privacy" },
  { label: "General terms and conditions", to: "/terms" },
];

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSupportCard, setShowSupportCard] = useState(false);

  useEffect(() => {
    const handleScrollToggle = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScrollToggle);
    return () => window.removeEventListener("scroll", handleScrollToggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#090F15] text-foreground/85 relative">
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
                <span className={open ? "text-primary font-medium" : "text-red-400 font-medium"}>
                  {t}
                </span>
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
                <Link to={n.to} className="hover:text-primary">
                  {n.label}
                </Link>
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
                <Link to={n.to} className="hover:text-primary">
                  {n.label}
                </Link>
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
            <span className="rounded bg-white/10 px-2 py-1 text-foreground/90">
              Erkende Verhuizers
            </span>
            <span className="rounded bg-white/10 px-2 py-1 text-foreground/90">TVM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-primary">Status: All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* FIXED CONTROLS WRAPPER: Force z-index to max and use fixed positioning relative to viewport */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-9999 flex flex-col items-end gap-3 select-none">
        
        {/* CHAT SUPPORT FLOATING SLIDEOUT CARD */}
        {showSupportCard && (
          <div className="w-[calc(100vw-2rem)] sm:w-72 rounded-2xl border border-white/10 bg-[#0F161E]/95 p-4 text-white backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Supersonic Hub
                </span>
              </div>
              <button
                onClick={() => setShowSupportCard(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* Option 1: Live Chat Link */}
              <Link to="/support" onClick={() => setShowSupportCard(false)} className="block">
                <div className="w-full flex items-center gap-3 rounded-xl bg-white/5 p-3 text-left text-xs transition hover:bg-white/10 group">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-[#8EA7FF]/10 text-[#8EA7FF]">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-white">
                      Live Chat Support
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Instant setup with support squad
                    </div>
                  </div>
                </div>
              </Link>

              {/* Option 2: Submit Ticket Link */}
              <Link to="/ticket" onClick={() => setShowSupportCard(false)} className="block">
                <div className="w-full flex items-center gap-3 rounded-xl bg-white/5 p-3 text-left text-xs transition hover:bg-white/10 group">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-[#8EA7FF]/10 text-[#8EA7FF]">
                    <Ticket className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-white">
                      Submit Tech Ticket
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Logistics pipeline & cargo claims
                    </div>
                  </div>
                </div>
              </Link>

              {/* Option 3: Contact Us Link */}
              <Link to="/contact" onClick={() => setShowSupportCard(false)} className="block">
                <div className="w-full flex items-center gap-3 rounded-xl bg-white/5 p-3 text-left text-xs transition hover:bg-white/10 group">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-[#8EA7FF]/10 text-[#8EA7FF]">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-white">
                      Contact HQ Division
                    </div>
                    <div className="text-[10px] text-slate-500">Direct dial telemetry lines</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          {/* SEAMLESS SCROLL TO TOP ARROW BUTTON */}
          {showScrollTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#0F161E]/80 text-slate-400 backdrop-blur-md transition hover:bg-[#0F161E] hover:text-white shadow-lg animate-in fade-in zoom-in-90 duration-200"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          )}

          {/* FLOATING SUPPORT TRIGGER ICON */}
          <button
            type="button"
            onClick={() => setShowSupportCard(!showSupportCard)}
            className={`grid h-12 w-12 place-items-center rounded-xl text-slate-900 transition shadow-xl hover:opacity-95 active:scale-95 ${
              showSupportCard ? "bg-white text-slate-900" : "bg-[#8EA7FF]"
            }`}
            style={{ backgroundColor: !showSupportCard ? "var(--primary)" : undefined }}
            aria-label="Toggle support channel options"
          >
            {showSupportCard ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </footer>
  );
}