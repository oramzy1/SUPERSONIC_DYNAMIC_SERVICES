import React, { useState, useEffect } from "react";
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode; // Enabled structural wrapping compatibility
  onSuccess?: () => void;
}

// Named Export aligned with Topbar/Sidebar import statements
export function AdminAuthGuard({ children, onSuccess }: AdminAuthGuardProps) {
  // --- Form & Step States ---
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");

  // Persist session check instantly to avoid flashing blank pages on authenticated reloads
  const [step, setStep] = useState<"IDENTIFY" | "VERIFY" | "SUCCESS" | "AUTHENTICATED">(() => {
    const isSaved = localStorage.getItem("supersonic_admin_authed") === "true";
    return isSaved ? "AUTHENTICATED" : "IDENTIFY";
  });

  // --- Validation & UI Feedback States ---
  const [emailError, setEmailError] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- AUTOMATED LOGOUT STATE SYNC ---
  // This watches local storage changes to snap the screen back to login instantly upon logout
  useEffect(() => {
    const handleStorageSync = () => {
      const isSaved = localStorage.getItem("supersonic_admin_authed") === "true";
      if (!isSaved) {
        setStep("IDENTIFY");
        setPasscode("");
        setEmail("");
      }
    };

    // Listen for storage changes from other windows/tabs or custom dispatch events
    window.addEventListener("storage", handleStorageSync);
    window.addEventListener("local-storage-logout", handleStorageSync);

    return () => {
      window.removeEventListener("storage", handleStorageSync);
      window.removeEventListener("local-storage-logout", handleStorageSync);
    };
  }, []);

  // --- Email Format Validation Helper ---
  const validateEmail = (targetEmail: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!targetEmail) {
      return "Email address is required";
    }
    if (!emailRegex.test(targetEmail)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // --- Handle Step 1: Email Submission ---
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(email);

    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError("");
    setIsLoading(true);

    // Simulate verification delay
    setTimeout(() => {
      setIsLoading(false);
      setStep("VERIFY");
    }, 1200);
  };

  // --- Handle Step 2: Passcode Validation ---
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict 6-digit numeric check validation rule
    const numericRegex = /^\d{6}$/;
    if (!passcode) {
      setPasscodeError("Security passcode is required");
      return;
    }
    if (!numericRegex.test(passcode)) {
      setPasscodeError("Passcode must be a valid 6-digit number");
      return;
    }

    setPasscodeError("");
    setIsLoading(true);

    // Simulate authorization processing handshake
    setTimeout(() => {
      setIsLoading(false);
      // Persist to localStorage so layout doesn't lock up again upon hot reloads
      localStorage.setItem("supersonic_admin_authed", "true");
      setStep("SUCCESS");
    }, 1500);
  };

  // --- Trigger Redirection Loop After Success Banner Display ---
  useEffect(() => {
    if (step === "SUCCESS") {
      const redirectTimeout = setTimeout(() => {
        setStep("AUTHENTICATED");
        if (onSuccess) onSuccess();
      }, 2000);
      return () => clearTimeout(redirectTimeout);
    }
  }, [step, onSuccess]);

  // If already logged in successfully, simply drop the gateway wall and show the page contents
  if (step === "AUTHENTICATED") {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F17] text-[#94A3B8] font-sans antialiased px-4">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      {/* Main Authentication Core Card Layout Portal */}
      <div className="w-full max-w-md bg-[#111622] border border-[#1E293B] rounded-2xl p-8 shadow-1xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-[#C8A24A]/10 border border-[#C8A24A]/20 flex items-center justify-center text-[#C8A24A] mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Supersonic Team Portal</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Please log in to manage your moves, quotes, and schedules
          </p>
        </div>

        {/* --- STEP 1: INITIAL EMAIL IDENTIFICATION FORM --- */}
        {step === "IDENTIFY" && (
          <form onSubmit={handleEmailSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  disabled={isLoading}
                  placeholder="admin@aerologix.com"
                  className={`w-full bg-[#080B11] border ${
                    emailError
                      ? "border-rose-500/50 focus:border-rose-500"
                      : "border-[#262F45] focus:border-[#C8A24A]"
                  } rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none transition-colors disabled:opacity-50`}
                />
              </div>
              {emailError && (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-2 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {emailError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: "#C8A24A" }}
              className="w-full text-[#0B0F17] hover:brightness-110 font-bold text-xs tracking-wider py-3 rounded-xl transition-all shadow-xl shadow-[#C8A24A]/5 flex items-center justify-center gap-2 uppercase disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        )}

        {/* --- STEP 2: MFA PASSCODE UNLOCK VERIFICATION FORM --- */}
        {step === "VERIFY" && (
          <form onSubmit={handlePasscodeSubmit} className="space-y-5">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Security Verification Code
                </label>
                <span className="text-[10px] text-slate-400 font-mono">{email}</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <input
                  type="text"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/\D/g, "");
                    setPasscode(cleanValue);
                    if (passcodeError) setPasscodeError("");
                  }}
                  disabled={isLoading}
                  placeholder="000000"
                  className={`w-full bg-[#080B11] border ${
                    passcodeError
                      ? "border-rose-500/50 focus:border-rose-500"
                      : "border-[#262F45] focus:border-[#C8A24A]"
                  } rounded-lg pl-10 pr-4 py-2.5 text-sm text-white tracking-widest placeholder-[#64748B] placeholder:tracking-normal focus:outline-none transition-colors disabled:opacity-50 text-center font-bold font-mono`}
                />
              </div>
              <p className="text-[10px] text-[#64748B] mt-1.5">
                Enter any 6-digit code combinations to confirm authentication.
              </p>
              {passcodeError && (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-2 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {passcodeError}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setStep("IDENTIFY");
                  setPasscode("");
                  setPasscodeError("");
                }}
                className="w-1/3 bg-[#1A202E] border border-[#262F45] hover:bg-[#262F45] text-white font-bold text-xs tracking-wider py-3 rounded-xl transition-all uppercase disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: "#C8A24A" }}
                className="flex-1 text-[#0B0F17] hover:brightness-110 font-bold text-xs tracking-wider py-3 rounded-xl transition-all shadow-xl shadow-[#C8A24A]/5 flex items-center justify-center gap-2 uppercase disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  "Unlock Dashboard"
                )}
              </button>
            </div>
          </form>
        )}

        {/* --- STEP 3: SUCCESS FEEDBACK BANNER ANIMATION TRIGGER --- */}
        {step === "SUCCESS" && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Authentication Successful
            </h2>
            <p className="text-xs text-emerald-400 font-medium">
              Redirecting to administrator console cluster metrics...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}