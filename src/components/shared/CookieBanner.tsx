import { useState, useEffect } from "react";
import {
  Cookie,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

type Prefs = {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
};

const STORAGE_KEY = "sds_cookie_consent";

export function CookieBanner({
  prefs,
  setPrefs,
  savePrefs,
  setBannerOpen,
}: {
  prefs: Prefs;
  setPrefs: (p: Prefs) => void;
  savePrefs: (p: Prefs) => void;
  setBannerOpen: (v: boolean) => void;
}) {
  //   const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const acceptAll = () => savePrefs({ essential: true, analytics: true, functional: true });
  const rejectAll = () => savePrefs({ essential: true, analytics: false, functional: false });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0E141A]/95 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:p-6">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              We use cookies to improve your experience
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Essential cookies are always active. You can choose to enable analytics and functional
              cookies.{" "}
              <Link to="/cookies" className="text-primary underline underline-offset-2">
                Cookie policy
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-white/20 hover:text-foreground"
            >
              Manage
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={rejectAll}
              className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-white/20 hover:text-foreground"
            >
              Reject all
            </button>
            <button
              onClick={acceptAll}
              className="inline-flex items-center rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Accept all
            </button>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-white/5 px-5 pb-5 pt-4 md:px-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6FE5FF]">
                    Essential
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-[#6FE5FF]/30 px-2 py-0.5 text-[10px] text-[#6FE5FF]">
                    <ShieldCheck className="h-3 w-3" /> Always on
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  Session management, security and quote form state. Required for the site to
                  function.
                </p>
              </div>

              {(["analytics", "functional"] as const).map((key) => (
                <div
                  key={key}
                  className={`rounded-xl border p-4 transition ${prefs[key] ? "border-primary/30 bg-primary/5" : "border-white/5 bg-white/5"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.15em] text-foreground capitalize">
                      {key}
                    </span>
                    <button
                      onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
                      aria-label={`Toggle ${key}`}
                    >
                      {prefs[key] ? (
                        <ToggleRight className="h-6 w-6 text-primary" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    {key === "analytics"
                      ? "Google Analytics via GTM. Helps us understand how visitors use the platform. Anonymised."
                      : "Remembers language and region preferences across sessions."}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => savePrefs(prefs)}
                className="inline-flex items-center rounded-xl bg-primary px-6 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
