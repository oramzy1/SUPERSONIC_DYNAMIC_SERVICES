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
import { useAuth } from "@/contexts/AuthContext";

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
const { register, user } = useAuth();
  const isAdminRole = user && ["admin", "dispatcher", "crew", "finance"].includes(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  // Form Submission Interceptor logic
 const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrors("Please enter a valid business or personal email address.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match. Please re-enter.");
      return;
    }
    if (formData.password.length < 8) {
      setErrors("Password must be at least 8 characters.");
      return;
    }
    if (!formData.agreeTerms) {
      setErrors("You must accept the Terms of Service to create an account.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        full_name: formData.fullName,
        phone: formData.phoneNumber || undefined,
      });
      setFormStep("LOADING");
      setTimeout(() => {
        navigate({ to: isAdminRole ? "/admindashboard" : "/dashboard" });
      }, 2000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Registration failed. Please try again.";
      setErrors(msg);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 select-none font-sans">
      {formStep === "INPUT" && (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center animate-in fade-in duration-300">
          {/* LEFT COLUMN: BRAND VALUE PROP SECTION */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-3">
              <p className="text-[11px] mt-4 font-bold tracking-tight uppercase text-primary">
                Supersonic Dynamic Services B.V.
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-balance font-extrabold tracking-tight leading-[1.1] text-slate-900">
                Next Gen <br />
                <span className="text-primary">Logistics.</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Create an account to access the Supersonic Dynamic Services B.V. hub for carbon-neutral fleet management,
              instant moving quotes, and real-time kinetic freight tracking across the Netherlands.
            </p>

            <div className="space-y-4 pt-5 border-t border-slate-200">
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald-50 border border-emerald-200">
                  <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  <strong className="text-slate-900 font-semibold">Eco-Responsible:</strong> 100% electric
                  operations minimizing urban footprint.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 border border-primary/20 text-primary">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  <strong className="text-slate-900 font-semibold">Smart Logistics:</strong> Integrated tracking
                  with live telemetry.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 border border-primary/20 text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  <strong className="text-slate-900 font-semibold">Certified Care:</strong> Fully insured
                  professional movers handling your goods.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REGISTER INTERFACE CARD */}
          <div className="space-y-6 w-full">

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {errors && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 font-medium">
                    {errors}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 py-3 pl-11 pr-4 text-sm placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 py-3 pl-11 pr-4 text-sm placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 py-3 pl-11 pr-4 text-sm placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 py-3 pl-11 pr-12 text-sm placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 py-3 pl-11 pr-12 text-sm placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
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
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-primary focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="text-[11px] leading-normal text-slate-600 cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary font-medium hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary font-medium hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    regarding my personal data and logistics operations.
                  </label>
                </div>

                <CTAButton
                  variant="primary"
                  type="submit"
                  style={{ backgroundColor: "var(--primary)" }}
                  className="w-full rounded-lg py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:opacity-95 flex items-center justify-center gap-2 mt-4"
                >
                  Create Account <ArrowRight className="h-4 w-4 text-white" />
                </CTAButton>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                Already Have An Account?{" "}
                <Link to={'/login' as any} className="text-primary hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC BACKEND STEP: PREMIUM SPINNING LOADER */}
      {formStep === "LOADING" && (
        <div className="w-full max-w-sm mx-auto text-center space-y-6 p-8 sm:p-10 rounded-[24px] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative mx-auto h-16 w-16">
            {/* Outer Geometric Ring Loader */}
            <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-primary/20 border-l-transparent animate-spin duration-1000" />
            {/* Inner Ring Spinning Counter-Clockwise */}
            <div className="absolute inset-2 rounded-full border-2 border-r-primary/60 border-t-transparent border-l-primary/60 border-b-transparent animate-spin direction-[reverse] duration-700" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold tracking-tight text-slate-900">
              Creating Account
            </h3>
            <p className="text-xs text-slate-600 max-w-60 mx-auto leading-relaxed">
              Please hold on while we create your account. You will be redirected in a moment.
            </p>
          </div>
        </div>
      )}

      {/* VERIFICATION STEP: CENTERED 6-DIGIT SECURITY CARD */}
      {formStep === "VERIFY" && (
        <div className="w-full max-w-110 mx-auto rounded-[24px] border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5 animate-in zoom-in-95 duration-300">
          <div className="space-y-1.5 mb-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mb-3">
              <MailQuestion className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Confirm Your Email
            </h2>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              We have sent a 6-digit verification security code to{" "}
              <span className="text-slate-900 font-semibold">{formData.email || "your email"}</span>.
            </p>
          </div>

          <form onSubmit={handleVerifySubmit} className="space-y-6">
            {errors && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 font-medium text-center">
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
                  className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-300 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>

            <CTAButton
              variant="primary"
              type="submit"
              style={{ backgroundColor: "var(--primary)" }}
              className="w-full rounded-lg py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-primary/25 transition hover:opacity-95 flex items-center justify-center gap-2"
            >
              Confirm Code <ArrowRight className="h-4 w-4 text-white" />
            </CTAButton>
          </form>

          <div className="mt-6 text-center text-xs space-y-2">
            <p className="text-slate-500">
              Didn't receive the email code?{" "}
              <button
                type="button"
                onClick={() => console.log("Re-dispatching OTP code")}
                className="text-primary hover:underline font-semibold"
              >
                Resend Code
              </button>
            </p>
            <button
              type="button"
              onClick={() => setFormStep("INPUT")}
              className="text-[11px] text-slate-500 hover:text-slate-900 transition underline block mx-auto"
            >
              Change email address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}