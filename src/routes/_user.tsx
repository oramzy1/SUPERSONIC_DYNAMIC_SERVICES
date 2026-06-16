import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, createContext, useContext } from "react";
import { X, ShieldAlert, UserPlus, LogIn } from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";

// 1. Create a lightweight Auth Intercept Context so any component on your site can trigger this popup
const SecurityGuardContext = createContext<{
  triggerGate: (nextActionUrl?: string) => void;
}>({
  triggerGate: () => {},
});

export const useSecurityGuard = () => useContext(SecurityGuardContext);

export const Route = createFileRoute("/_user")({
  component: UserLayoutWrapper,
});

function UserLayoutWrapper() {
  const navigate = useNavigate();
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  const [isUserLoggedIn] = useState<boolean>(false);

  // Global function exposed to your app to intercept actions
  const triggerGate = (nextActionUrl?: string) => {
    if (!isUserLoggedIn) {
      if (nextActionUrl) setRedirectTarget(nextActionUrl);
      setIsGateOpen(true);
    } else if (nextActionUrl) {
      // If already logged in, let them proceed directly to their destination
      navigate({ to: nextActionUrl });
    }
  };

  // Prevent background scrolling when the security popup is active
  useEffect(() => {
    if (isGateOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isGateOpen]);

  const handleRedirect = (destination: "/register" | "/login") => {
    setIsGateOpen(false);
    navigate({
      to: destination,
      search: redirectTarget ? { redirect: redirectTarget } : undefined,
    });
  };

  return (
    <SecurityGuardContext.Provider value={{ triggerGate }}>
      {/* Renders your public user authentication routes safely */}
      <Outlet />

      {/* PORTAL SECURITY MODAL OVERLAY */}
      {isGateOpen && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsGateOpen(false)}
          />

          {/* Modal Content Window */}
          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0F15] p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Top Close Button */}
            <button
              onClick={() => setIsGateOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Shield Warning Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8EA7FF]/10 text-[#8EA7FF] mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>

            {/* Text Copy */}
            <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
              Authentication Required
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              To book a moving service, configure fleets, or track live logistical progress across
              the Netherlands, you need an active client account.
            </p>

            {/* Interactive Redirect Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <CTAButton
                variant="primary"
                onClick={() => handleRedirect("/register")}
                className="w-full rounded-xl py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" /> Register Now
              </CTAButton>

              <button
                onClick={() => handleRedirect("/login")}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </button>
            </div>

            {/* Extra context help footer */}
            <p className="mt-4 text-[11px] text-slate-500">
              Registration is completely free and takes less than 60 seconds.
            </p>
          </div>
        </div>
      )}
    </SecurityGuardContext.Provider>
  );
}
