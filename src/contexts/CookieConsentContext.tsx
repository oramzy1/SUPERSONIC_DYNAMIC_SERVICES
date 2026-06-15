import { CookieBanner } from "@/components/shared/CookieBanner";
import { createContext, useContext, useEffect, useState } from "react";

type Prefs = { essential: boolean; analytics: boolean; functional: boolean };
type ConsentState = {
  prefs: Prefs;
  hasConsented: boolean;
  savePrefs: (p: Prefs) => void;
  openBanner: () => void;
};

const STORAGE_KEY = "sds_cookie_consent";

const CookieConsentContext = createContext<ConsentState | null>(null);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>({ essential: true, analytics: false, functional: false });
  const [hasConsented, setHasConsented] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setPrefs(parsed);
      setHasConsented(true);
    } else {
      setTimeout(() => setBannerOpen(true), 1200);
    }
  }, []);

  const applyConsent = (p: Prefs) => {
    const win = window as any;
    if (win.gtag) {
      win.gtag("consent", "update", {
        analytics_storage: p.analytics ? "granted" : "denied",
        functionality_storage: p.functional ? "granted" : "denied",
        ad_storage: "denied",
      });
    }
  };

  const savePrefs = (p: Prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...p, timestamp: Date.now() }));
    setPrefs(p);
    setHasConsented(true);
    applyConsent(p);
    setBannerOpen(false);
  };

  const openBanner = () => setBannerOpen(true);

  return (
    <CookieConsentContext.Provider value={{ prefs, hasConsented, savePrefs, openBanner }}>
      {children}
      {bannerOpen && <CookieBanner prefs={prefs} setPrefs={setPrefs} savePrefs={savePrefs} setBannerOpen={setBannerOpen} />}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}