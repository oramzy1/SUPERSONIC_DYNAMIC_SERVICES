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
  Truck,
  Warehouse,
  Loader2,
} from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/shared/Logo";
import { safeRedirect } from "@/lib/redirect";
import { showError, showErrorText, showSuccess } from "@/lib/toast";

export const Route = createFileRoute("/_user/register")({
  component: UserRegisterPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: safeRedirect(search.redirect),
  }),
});

type FormStep = "INPUT" | "LOADING" | "VERIFY";

const inputClass =
  "w-full h-12 rounded-none border border-slate-300 bg-transparent text-foreground/80 pl-11 pr-4 text-sm placeholder-slate-400 outline-none transition-colors focus:border-primary";

function UserRegisterPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [formStep, setFormStep] = useState<FormStep>("INPUT");
  const [verificationCode, setVerificationCode] = useState<string[]>(new Array(6).fill(""));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [armed, setArmed] = useState(false);
  const noAutofill = {
    autoComplete: "off",
    readOnly: !armed,
    onFocus: () => setArmed(true),
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const { register, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdminRole = user?.role === "admin";

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      showErrorText("Please enter a valid business or personal email address.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showErrorText("Passwords do not match. Please re-enter.");
      return;
    }
    if (formData.password.length < 8) {
      showErrorText("Password must be at least 8 characters.");
      return;
    }
    if (!formData.agreeTerms) {
      showErrorText("You must accept the Terms of Service to create an account.");
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
      showSuccess("Account created successfully. Ride On!💪");
      setFormStep("LOADING");
      setTimeout(() => {
        navigate({ to: isAdminRole ? "/admindashboard" : "/dashboard" });
      }, 2000);
    } catch (err: unknown) {
      showError(err, "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const combinedCode = verificationCode.join("");
    if (combinedCode.length < 6) {
      showErrorText("Please fill in the complete 6-digit confirmation code.");
      return;
    }

    setFormStep("LOADING");
    setTimeout(() => {
      navigate({ to: "/login" as any });
    }, 1500);
  };

  const handleCodeChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const updatedCode = [...verificationCode];
    updatedCode[index] = element.value;
    setVerificationCode(updatedCode);

    if (element.value !== "" && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-background font-sans select-none">
      {formStep === "INPUT" && (
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] min-h-screen animate-in fade-in duration-300">
          {/* LEFT: MEDIA PANEL */}
          <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0E141A] text-white p-12 xl:p-16 lg:sticky lg:top-0 lg:h-screen">
            <img
              src="https://supersonicdynamicservices.nl/assets/new-van3-DJz3j1D0.jpg"
              alt="Supersonic electric fleet on the road"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0E141A]/95" />

            <p className="relative text-[11px] font-bold uppercase tracking-widest text-white/70">
              Supersonic Dynamic Services B.V.
            </p>

            <div className="relative space-y-8 max-w-lg">
              <h1 className="font-display text-5xl xl:text-6xl text-balance font-extrabold tracking-tight leading-[1.05]">
                Next Gen <br />
                <span className="text-primary">Logistics.</span>
              </h1>
              <p className="text-sm leading-relaxed text-white/80">
                Create an account to book moving and freight haulage, reserve smart storage, and
                track every job in real time across the Netherlands and Europe.
              </p>

              <div className="border-t border-white/20 pt-6 space-y-4">
                <div className="flex gap-3 items-start">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-white/80">
                    <strong className="text-white font-semibold">Freight &amp; Moving:</strong>{" "}
                    Local and nationwide haulage with a vetted, professional crew.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <Warehouse className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-white/80">
                    <strong className="text-white font-semibold">Smart Storage:</strong> Secure,
                    monitored storage for goods and equipment.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-white/80">
                    <strong className="text-white font-semibold">Live Tracking:</strong> Follow your
                    job from request to delivery.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-white/80">
                    <strong className="text-white font-semibold">Eco-Responsible:</strong> 100%
                    electric, zero-emission operations.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-white/80">
                    <strong className="text-white font-semibold">Certified Care:</strong> Fully
                    insured handling of your goods.
                  </p>
                </div>
              </div>
            </div>

            <p className="relative text-[11px] text-white/50">
              KvK 42113033 · © 2026 Supersonic Dynamic Services B.V.
            </p>
          </aside>

          {/* RIGHT: REGISTER FORM */}
          <main className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
            <div className="w-full max-w-xl">
              {/* Mobile-only brand header, since the media panel is hidden */}
              {/* <div className="lg:hidden mb-8 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                  Supersonic Dynamic Services B.V.
                </p>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground/90">
                  Next Gen <span className="text-primary">Logistics.</span>
                </h1>
              </div> */}

              <div className="mb-8 space-y-1">
                <Logo />
                <h2 className="font-display text-2xl mt-4 font-bold tracking-tight text-foreground">
                  Create Your Account
                </h2>
                <p className="text-sm text-foreground/70">
                  Request quotes, book jobs and track shipments in one place.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-70">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                      <input
                        type="text"
                        required
                        name="sds-reg-fullname"
                        {...noAutofill}
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                      <input
                        type="tel"
                        required
                        name="sds-reg-phone"
                        {...noAutofill}
                        placeholder="+31 6 1234 5678"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                    <input
                      type="email"
                      required
                      name="sds-reg-email"
                      {...noAutofill}
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        name="sds-reg-password"
                        {...noAutofill}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-foreground/80 transition-colors"
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-foreground/80 transition-colors"
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
                    className="mt-1 h-4 w-4 shrink-0 rounded-none border-slate-300 accent-primary focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="text-[11px] leading-normal text-foreground/70 cursor-pointer"
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
                  disabled={isSubmitting}
                  style={{ backgroundColor: "var(--primary)" }}
                  className="w-full h-12 rounded-none text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="h-4 w-4 text-white" />
                    </>
                  )}
                </CTAButton>
              </form>

              <p className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-foreground/70">
                Already Have An Account?{" "}
                <Link
                  to={"/login" as any}
                  search={{ redirect: search.redirect } as any}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </main>
        </div>
      )}

      {/* LOADING STEP */}
      {formStep === "LOADING" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center space-y-6 p-8 sm:p-10 bg-surface animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mx-auto h-16 w-16">
              <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-primary/20 border-l-transparent animate-spin duration-1000" />
              <div className="absolute inset-2 rounded-full border-2 border-r-primary/60 border-t-transparent border-l-primary/60 border-b-transparent animate-spin direction-[reverse] duration-700" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                Creating Account
              </h3>
              <p className="text-xs text-foreground/70 max-w-60 mx-auto leading-relaxed">
                Please hold on while we create your account. You will be redirected in a moment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VERIFY STEP */}
      {formStep === "VERIFY" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-110 bg-surface p-6 sm:p-10 animate-in zoom-in-95 duration-300">
            <div className="space-y-1.5 mb-6 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center bg-primary/10 border border-primary/20 text-primary mb-3">
                <MailQuestion className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Confirm Your Email
              </h2>
              <p className="text-xs text-foreground/70 max-w-xs mx-auto leading-relaxed">
                We have sent a 6-digit verification security code to{" "}
                <span className="text-foreground/70 font-semibold">
                  {formData.email || "your email"}
                </span>
                .
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-6">
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
                    className="w-11 h-12 text-center text-lg font-bold rounded-none  bg-transparent text-foreground/70 outline-none transition-colors focus:border-primary"
                  />
                ))}
              </div>

              <CTAButton
                variant="primary"
                type="submit"
                style={{ backgroundColor: "var(--primary)" }}
                className="w-full h-12 rounded-none text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              >
                Confirm Code <ArrowRight className="h-4 w-4 text-white" />
              </CTAButton>
            </form>

            <div className="mt-6 text-center text-xs space-y-2">
              <p className="text-foreground/70">
                Didn't receive the email code?{" "}
                <button
                  type="button"
                  onClick={() =>
                    showSuccess("A new verification code has been sent to your email.")
                  }
                  className="text-primary hover:underline font-semibold"
                >
                  Resend Code
                </button>
              </p>
              <button
                type="button"
                onClick={() => setFormStep("INPUT")}
                className="text-[11px] text-foreground/60 hover:text-foreground transition-colors underline block mx-auto"
              >
                Change email address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
