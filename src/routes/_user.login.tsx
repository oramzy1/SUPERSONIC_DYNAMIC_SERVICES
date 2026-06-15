import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";

export const Route = createFileRoute("/_user/login")({
  component: UserLoginPage,
});

function UserLoginPage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Automated timing effect to mimic smooth routing redirect handover
  useEffect(() => {
    if (isSuccess) {
      const redirectTimer = setTimeout(() => {
        navigate({ to: "/" });
      }, 2500); // 2.5s window to read the authenticating micro-card
      return () => clearTimeout(redirectTimer);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    // Strict Email validation to filter spam/malformed entries
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrors("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 1) {
      setErrors("Password field cannot be empty.");
      return;
    }

    console.log("Submitting validated login payload:", formData);

    // Toggle success state to swap UI conditionally inside the card structure
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-white flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-115 rounded-[24px] border border-white/10 bg-white/2 p-6 sm:p-10 backdrop-blur-xl shadow-1xl transition-all duration-300">
        {!isSuccess ? (
          <div className="animate-in fade-in duration-200">
            {/* Header Block */}
            <div className="space-y-1.5 mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Continue to Login
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Welcome Back! <br />
                <span className="text-slate-500">Enter your credentials to continue</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Validation Error Display Banner */}
              {errors && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 font-medium animate-in fade-in duration-200">
                  {errors}
                </div>
              )}

              {/* Email Address Input Block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="operator@supersonic.pulse"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                  />
                </div>
              </div>

              {/* Password Input Block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Utilities Row: Remember Me & Forgot Password links */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="h-4 w-4 rounded border-white/10 bg-white/4 text-[#8EA7FF] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-slate-400 cursor-pointer text-[11px]">
                    Remember me
                  </label>
                </div>

                <Link
                  to={"/forgotpassword" as any}
                  className="text-[#8EA7FF]/80 hover:text-[#8EA7FF] hover:underline text-[11px]"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button explicitly utilizing your --primary CSS variable */}
              <CTAButton
                variant="primary"
                type="submit"
                style={{ backgroundColor: "var(--primary)" }}
                className="w-full rounded-xl py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 transition hover:opacity-95 flex items-center justify-center gap-2 mt-2"
              >
                SIGN IN <ArrowRight className="h-4 w-4 text-slate-900" />
              </CTAButton>
            </form>

            {/* Dynamic Route Switching Links */}
            <p className="mt-8 text-center text-xs text-slate-400">
              Don't Have An Account?{" "}
              <a href="/register" className="text-[#8EA7FF] hover:underline font-semibold">
                Register
              </a>
            </p>
          </div>
        ) : (
          /* SUCCESS DISPLAY COMPONENT: Swaps directly inside the exact same container layout */
          <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold tracking-tight text-white">
                Login Successful
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Authenticated session authorized for{" "}
                <span className="text-slate-200 font-medium">{formData.email}</span>.
              </p>
            </div>

            {/* Micro details panel indicating the designated destination pipeline */}
            <div className="rounded-xl bg-white/4 border border-white/5 p-3 max-w-xs mx-auto flex items-center justify-between text-left">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block">
                  Redirecting Destination
                </span>
                <span className="text-xs text-[#8EA7FF] font-mono font-medium">
                  Home Dashboard (/)
                </span>
              </div>
              <Loader2 className="h-4 w-4 text-[#8EA7FF] animate-spin shrink-0" />
            </div>

            {/* Sleek linear timeline tracking animation loader */}
            <div className="w-24 h-0.5 bg-white/10 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full animate-[loading_2.5s_ease-in-out_forwards]"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
