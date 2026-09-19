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
  Truck,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_user/crewregister")({
  component: CrewRegisterPage,
});

function CrewRegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrors("Please enter a valid email address.");
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
        role: "crew",
      });
      // Crew registration always resolves to the crew dashboard - no need to
      // inspect a role value that may not have re-rendered yet.
      setIsSuccess(true);
      setTimeout(() => navigate({ to: "/crewdashboard" as any }), 1500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Registration failed. Please try again.";
      setErrors(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-white flex items-center justify-center p-4 sm:p-8 md:p-12 select-none font-sans">
      {!isSuccess ? (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center animate-in fade-in duration-300">
          <div className="space-y-8 max-w-xl">
            <div className="space-y-3">
              <p className="text-[11px] mt-4 font-bold tracking-tight text-amber-400 uppercase">
                Supersonic Dynamic Services B.V. - Crew
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-balance font-extrabold tracking-tight leading-[1.1] text-white">
                Join the <br />
                <span className="text-white/90">Crew.</span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Create your crew account to receive job assignments, update job status in the field,
              and upload photo evidence directly from your phone.
            </p>
            <div className="space-y-4 pt-2 border-t border-white/5">
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-white/5 text-[#8EA7FF]">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-200">Live Assignments:</strong> See every job
                  dispatch assigns to you, with schedule and status in one place.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-white/5 text-[#8EA7FF]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-200">Photo Evidence:</strong> Upload proof of
                  completed work straight from the job screen.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/2 p-6 sm:p-8 backdrop-blur-xl shadow-1xl w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 font-medium">
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
                      placeholder="Jane Crewman"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/4 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
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
                      placeholder="+31 (6) 000-0000"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/4 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
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
                    placeholder="name@supersonic.nl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/4 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
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
                      className="w-full rounded-lg border border-white/10 bg-white/4 py-3 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                      className="w-full rounded-lg border border-white/10 bg-white/4 py-3 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
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
                  </Link>
                  .
                </label>
              </div>

              <CTAButton
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: "var(--primary)" }}
                className="w-full rounded-lg py-3 text-sm font-semibold text-slate-900 transition hover:opacity-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                  </>
                ) : (
                  <>
                    Create Crew Account <ArrowRight className="h-4 w-4 text-slate-900" />
                  </>
                )}
              </CTAButton>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link to={"/login" as any} className="text-[#8EA7FF] hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm text-center space-y-6 p-8 rounded-[24px] border border-white/5 bg-white/1 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-t-[#8EA7FF] border-r-transparent border-b-[#8EA7FF]/20 border-l-transparent animate-spin duration-1000" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold tracking-tight text-white">
              Account Created
            </h3>
            <p className="text-xs text-slate-500 max-w-60 mx-auto">
              Taking you to your assignments...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
