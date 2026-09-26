import { Link } from "@tanstack/react-router";
import {
  ChevronUp,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  MessageSquare,
  Palette,
  PhoneCall,
  Plus,
  Share2,
  Ticket,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import TrustPilotWidget from "../shared/TrustPilotWidget";
import { ThemeModal } from "../shared/ThemeModal";
import { SystemThemePromptBanner } from "../shared/SystemThemePromptBanner";
import { useTheme } from "@/contexts/ThemeContext";
import ideal from "@/assets/images/ideal-logo.png";
import master from "@/assets/images/mastercard-logo.png";
import visa from "@/assets/images/visa-logo.png";
import paypal from "@/assets/images/paypal-logo.png";

// Short-form opening hours
const HOURS = [
  ["Monday - Friday", "8:30 - 17:30", true],
  ["Saturday", "Closed", false],
  ["Sunday", "Closed", false],
] as const;

const NAV_LEFT = [
  { label: "About Us", to: "/about" },
  { label: "Request a Quote", to: "/quoterequest" },
  { label: "Vacancies", to: "/vacancies" },
  { label: "Cookies policy", to: "/cookies" },
];

const NAV_RIGHT = [
  { label: "Contact", to: "/contact" },
  { label: "Frequently Asked Questions", to: "/faqs" },
  { label: "Privacy policy", to: "/privacy" },
  { label: "General terms and conditions", to: "/terms" },
];

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const { setIsThemeModalOpen } = useTheme();

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
    <footer className="bg-footer text-slate-300 border-t border-border/40">
      {/* Main Grid Section */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4 md:px-8">
        <div>
          <p className="text-sm leading-relaxed text-slate-400">
            Driving the energy transition vision of the Netherlands through our combined
            sustainability and technology powered business approach. We combine precision
            engineering with premium moving experiences.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Facebook, Instagram, Linkedin, Share2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                aria-label="social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <TrustPilotWidget />
        </div>

        {/* Shortened Opening Hours Section */}
        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            Opening Hours
          </h4>
          <ul className="space-y-3 text-sm">
            {HOURS.map(([d, t, open]) => (
              <li
                key={d}
                className="flex items-center justify-between border-b border-slate-900 pb-2"
              >
                <span className="text-slate-300 font-medium">{d}</span>
                <span
                  className={
                    open
                      ? "text-emerald-400 font-medium"
                      : "flex items-center gap-1.5 text-rose-500/80 font-medium"
                  }
                >
                  {!open && <XCircle className="h-3.5 w-3.5" />}
                  <span>{t}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Navigation Links */}
        <div className="my-0">
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            Quick Navigation
          </h4>
          <ul className="space-y-3 text-sm">
            {NAV_LEFT.map((n) => (
              <li key={n.label} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                <Link to={n.to} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Support Links */}
        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            Legal & Support
          </h4>
          <ul className="space-y-3 text-sm">
            {NAV_RIGHT.map((n) => (
              <li key={n.label} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                <Link to={n.to} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar Details */}
      <div className="border-t border-slate-900 bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 text-[11px] uppercase tracking-[0.18em] text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="space-y-1 text-slate-400">
            <div>KvK: 42113033</div>
            <div>BTW-NUMBER: NL869789491B01</div>
            <div className="text-slate-500">SUPERSONIC DYNAMIC SERVICES B.V. © 2026</div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 font-medium">
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Secure Payments:
            </span>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* iDEAL */}
              <div className="h-7 sm:h-8 w-11 sm:w-14 flex items-center justify-center rounded bg-slate-900 border border-slate-800 p-1 overflow-hidden">
                <img
                  src={ideal}
                  alt="iDEAL"
                  className="h-full w-full object-contain opacity-80 hover:opacity-100 transition"
                />
              </div>

              {/* Mastercard */}
              <div className="h-7 sm:h-8 w-11 sm:w-14 flex items-center justify-center rounded bg-slate-900 border border-slate-800 p-1 overflow-hidden">
                <img
                  src={master}
                  alt="Mastercard"
                  className="h-full w-full object-contain opacity-80 hover:opacity-100 transition"
                />
              </div>

              {/* VISA */}
              <div className="h-7 sm:h-8 w-11 sm:w-14 flex items-center justify-center rounded bg-slate-900 border border-slate-800 p-1 overflow-hidden">
                <img
                  src={visa}
                  alt="VISA"
                  className="h-full w-full object-contain opacity-80 hover:opacity-100 transition"
                />
              </div>

              {/* PayPal */}
              <div className="h-7 sm:h-8 w-11 sm:w-14 flex items-center justify-center rounded bg-slate-900 border border-slate-800 p-1 overflow-hidden">
                <img
                  src={paypal}
                  alt="PayPal"
                  className="h-full w-full object-contain opacity-80 hover:opacity-100 transition"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 text-sm text-slate-400 font-medium">
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Certified Quality Mark
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Quality Mark Images if uncommented */}
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-full bg-slate-900/80 px-3 py-1.5 border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium normal-case tracking-normal">
              Status: All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION MENU & MODALS */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 select-none">
        {/* Plus Menu Popup Options */}
        {showPlusMenu && (
          <div className="w-[calc(100vw-2rem)] sm:w-72 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 text-slate-100 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Supersonic Hub
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPlusMenu(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* Option 1: Existing Messaging / Support Hub Option */}
              <button
                type="button"
                onClick={() => {
                  setShowPlusMenu(false);
                  setShowMessagingModal(true);
                }}
                className="w-full flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 p-3 text-left text-xs transition hover:bg-slate-800 hover:border-emerald-500/50 group"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-emerald-400">
                    Support & Messaging
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Live chat, support tickets & contact
                  </div>
                </div>
              </button>

              {/* Option 2: Theme Modal Option */}
              <button
                type="button"
                onClick={() => {
                  setShowPlusMenu(false);
                  setIsThemeModalOpen(true);
                }}
                className="w-full flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 p-3 text-left text-xs transition hover:bg-slate-800 hover:border-emerald-500/50 group"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Palette className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-emerald-400">
                    Theme Appearance
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Switch Light, Dark or System theme
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Existing Support Channels Modal */}
        {showMessagingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setShowMessagingModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <h3 className="text-lg font-bold font-display text-white">Support Channels</h3>
              </div>

              <p className="text-xs text-slate-400 mb-5">
                How can we assist you today? Select one of our communication channels below.
              </p>

              <div className="space-y-3">
                <Link to="/support" onClick={() => setShowMessagingModal(false)} className="block">
                  <div className="w-full flex items-center gap-3 rounded-xl bg-slate-800/80 border border-slate-700/80 p-3.5 text-left text-xs transition hover:bg-slate-800 hover:border-emerald-500/50 group">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-emerald-400">
                        Live Chat Support
                      </div>
                      <div className="text-[11px] text-slate-400">Chat with our online support team</div>
                    </div>
                  </div>
                </Link>

                <Link to="/ticket" onClick={() => setShowMessagingModal(false)} className="block">
                  <div className="w-full flex items-center gap-3 rounded-xl bg-slate-800/80 border border-slate-700/80 p-3.5 text-left text-xs transition hover:bg-slate-800 hover:border-emerald-500/50 group">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Ticket className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-emerald-400">
                        Submit a Ticket
                      </div>
                      <div className="text-[11px] text-slate-400">Open a detailed inquiry or request</div>
                    </div>
                  </div>
                </Link>

                <Link to="/contact" onClick={() => setShowMessagingModal(false)} className="block">
                  <div className="w-full flex items-center gap-3 rounded-xl bg-slate-800/80 border border-slate-700/80 p-3.5 text-left text-xs transition hover:bg-slate-800 hover:border-emerald-500/50 group">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <PhoneCall className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-emerald-400">
                        Contact Us
                      </div>
                      <div className="text-[11px] text-slate-400">Get in touch via phone or email</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Support Trigger Button (PLUS button) */}
        <button
          type="button"
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          className={`grid h-12 w-12 place-items-center rounded-xl transition shadow-xl hover:opacity-95 active:scale-95 border ${
            showPlusMenu
              ? "bg-slate-800 text-slate-200 border-slate-700"
              : "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
          }`}
          aria-label="Toggle supersonic options"
        >
          {showPlusMenu ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </button>
      </div>

      {/* Theme Modal */}
      <ThemeModal />

      {/* System Theme Prompt Banner */}
      <SystemThemePromptBanner />

      {/* FLOATING SCROLL TO TOP ARROW BUTTON */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-end gap-3 select-none">
        <div className="flex flex-col items-center gap-3">
          {showScrollTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-400 backdrop-blur-md transition hover:bg-slate-800 hover:text-white shadow-lg animate-in fade-in zoom-in-90 duration-200"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
