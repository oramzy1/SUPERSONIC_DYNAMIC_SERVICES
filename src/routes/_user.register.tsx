import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  MailQuestion,
} from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";

export const Route = createFileRoute("/_user/register")({
  component: UserRegisterPage,
});

type FormStep = "INPUT" | "LOADING" | "VERIFY";

function UserRegisterPage() {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState<FormStep>("INPUT");
  const [verificationCode, setVerificationCode] = useState<string[]>(new Array(6).fill(""));

  // Visibility states for both password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<string | null>(null);

  // Form Submission Interceptor logic
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    // Emoji / Non-ASCII Character strict block validation rule
    const emojiRegex = /[^\x00-\x7F]/;
    if (
      emojiRegex.test(formData.fullName) ||
      emojiRegex.test(formData.email) ||
      emojiRegex.test(formData.password)
    ) {
      setErrors("Emojis or special system symbols are not permitted in form credentials.");
      return;
    }

    // Strict Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrors("Please enter a valid business or personal email address.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match. Please re-enter.");
      return;
    }

    if (!formData.agreeTerms) {
      setErrors("You must accept the Terms of Service to create an account.");
      return;
    }

    // Move to Simulated Premium Micro-loader State
    setFormStep("LOADING");

    setTimeout(() => {
      setFormStep("VERIFY");
    }, 2400);
  };

  // OTP Verification Submission Control
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    const combinedCode = verificationCode.join("");
    if (combinedCode.length < 6) {
      setErrors("Please fill in the complete 6-digit confirmation code.");
      return;
    }

    // Simulated Verification Processing step
    setFormStep("LOADING");
    setTimeout(() => {
      navigate({ to: "/login" as any });
    }, 1500);
  };

  // Utility to auto-focus next boxes on typing native numeric strings
  const handleCodeChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const updatedCode = [...verificationCode];
    updatedCode[index] = element.value;
    setVerificationCode(updatedCode);

    // Auto-focus next field element cleanly
    if (element.value !== "" && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-white flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 select-none font-sans">
      {formStep === "INPUT" && (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center animate-in fade-in duration-300">
          {/* LEFT COLUMN: BRAND VALUE PROP SECTION */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-3">
              <p className="text-[11px] mt-4 font-bold tracking-tight text-[#8EA7FF] uppercase">
                Supersonic Dynamic Services B.V.
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Next Gen <br />
                <span className="text-white/90">Logistics.</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Create an account to access the Supersonic Dynamic Services B.V. hub for carbon-neutral fleet management,
              instant moving quotes, and real-time kinetic freight tracking across the Netherlands.
            </p>

            <div className="space-y-4 pt-2 border-t border-white/5">
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-white/5 text-[#8EA7FF]">
                  <Leaf className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-200">Eco-Responsible:</strong> 100% electric
                  operations minimizing urban footprint.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-white/5 text-[#8EA7FF]">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-200">Smart Logistics:</strong> Integrated tracking
                  with live telemetry.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-white/5 text-[#8EA7FF]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-200">Certified Care:</strong> Fully insured
                  professional movers handling your goods.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REGISTER INTERFACE CARD */}
          <div className="space-y-6 w-full">

            <div className="rounded-[24px] border border-white/10 bg-white/2 p-6 sm:p-8 backdrop-blur-xl shadow-1xl">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {errors && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 font-medium">
                    {errors}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-white/10 bg-white/4 text-[#8EA7FF] focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="text-[11px] text-slate-400 leading-normal cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-white hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-white hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    regarding my personal data and logistics operations.
                  </label>
                </div>

                <CTAButton
                  variant="primary"
                  type="submit"
                  style={{ backgroundColor: "var(--primary)" }}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-slate-900 transition hover:opacity-95 flex items-center justify-center gap-2 mt-4"
                >
                  Create Account <ArrowRight className="h-4 w-4 text-slate-900" />
                </CTAButton>
              </form>

              <p className="mt-6 text-center text-xs text-slate-400">
                Already Have An Account?{" "}
                <Link to={'/login' as any} className="text-[#8EA7FF] hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC BACKEND STEP: PREMIUM SPINNING LOADER */}
      {formStep === "LOADING" && (
        <div className="w-full max-w-sm text-center space-y-6 p-8 rounded-[24px] border border-white/5 bg-white/1 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="relative mx-auto h-16 w-16">
            {/* Outer Geometric Ring Loader */}
            <div className="absolute inset-0 rounded-full border-2 border-t-[#8EA7FF] border-r-transparent border-b-[#8EA7FF]/20 border-l-transparent animate-spin duration-1000" />
            {/* Inner Ring Spinning Counter-Clockwise */}
            <div className="absolute inset-2 rounded-full border-2 border-r-[#8EA7FF]/60 border-t-transparent border-l-[#8EA7FF]/60 border-b-transparent animate-spin direction-[reverse] duration-700" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold tracking-tight text-white">
              Creating Account
            </h3>
            <p className="text-xs text-slate-500 max-w-60 mx-auto">
              Provisioning secure ledger and preparing cryptographic telemetry pipelines...
            </p>
          </div>
        </div>
      )}

      {/* VERIFICATION STEP: CENTERED 6-DIGIT SECURITY CARD */}
      {formStep === "VERIFY" && (
        <div className="w-full max-w-110 rounded-[24px] border border-white/10 bg-white/2 p-6 sm:p-10 backdrop-blur-xl shadow-1xl animate-in zoom-in-95 duration-300">
          <div className="space-y-1.5 mb-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#8EA7FF]/10 text-[#8EA7FF] mb-3">
              <MailQuestion className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              Confirm Your Email
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              We have dispatched a 6-digit verification security token to{" "}
              <span className="text-white font-medium">{formData.email || "your email"}</span>.
            </p>
          </div>

          <form onSubmit={handleVerifySubmit} className="space-y-6">
            {errors && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 font-medium text-center">
                {errors}
              </div>
            )}

            {/* Complete Side-by-Side Pin Field Grid Wrapper */}
            <div className="flex justify-between items-center gap-2 max-w-xs mx-auto">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  required
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-white/10 bg-white/4 text-white placeholder-slate-700 outline-none transition focus:border-[#8EA7FF] focus:bg-white/8 focus:ring-1 focus:ring-[#8EA7FF]/30"
                />
              ))}
            </div>

            <CTAButton
              variant="primary"
              type="submit"
              style={{ backgroundColor: "var(--primary)" }}
              className="w-full rounded-xl py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 transition hover:opacity-95 flex items-center justify-center gap-2"
            >
              Confirm Code <ArrowRight className="h-4 w-4 text-slate-900" />
            </CTAButton>
          </form>

          <div className="mt-6 text-center text-xs space-y-2">
            <p className="text-slate-500">
              Didn't receive the email token?{" "}
              <button
                type="button"
                onClick={() => console.log("Re-dispatching OTP bundle")}
                className="text-[#8EA7FF] hover:underline font-medium"
              >
                Resend Code
              </button>
            </p>
            <button
              type="button"
              onClick={() => setFormStep("INPUT")}
              className="text-[11px] text-slate-400 hover:text-white transition underline block mx-auto"
            >
              Change email address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
