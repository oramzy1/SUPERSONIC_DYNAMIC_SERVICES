import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Truck,
  Warehouse,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/shared/Logo";

interface AdminAuthGuardProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const REMEMBER_KEY = "sds_remembered_email";

const readRemembered = (): string => {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
};

const writeRemembered = (email: string | null) => {
  try {
    if (email) window.localStorage.setItem(REMEMBER_KEY, email);
    else window.localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* storage unavailable (private mode), ignore */
  }
};

function dashboardLabelForRole(role?: string): string {
  if (role === "crew") return "Crew Dashboard (/crewdashboard)";
  if (role && ["admin", "dispatcher", "finance"].includes(role))
    return "Admin Dashboard (/admindashboard)";
  return "Home Dashboard (/dashboard)";
}

const inputClass =
  "w-full h-12 rounded-none border border-slate-300 bg-transparent text-foreground/80 pl-11 pr-4 text-sm placeholder-slate-400 outline-none transition-colors focus:border-primary";

export function AdminAuthGuard({ children, onSuccess }: AdminAuthGuardProps) {
  const { login, isAuthenticated, user } = useAuth();
  const isAdminRole =
    isAuthenticated && user && ["admin", "dispatcher", "crew", "finance"].includes(user.role);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [armed, setArmed] = useState(false);
  const [formData, setFormData] = useState(() => {
    const saved = readRemembered();
    return { email: saved, password: "", rememberMe: saved !== "" };
  });

  const noAutofill = {
    autoComplete: "off",
    readOnly: !armed,
    onFocus: () => setArmed(true),
  };

  // If authenticated and user is admin/staff, show children
  if (isAuthenticated && user && ["admin"].includes(user.role)) {
    return <>{children}</>;
  }

  // If authenticated but not staff, show unauthorized
  if (isAuthenticated && user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F17] text-[#94A3B8] font-sans antialiased px-4">
        <div className="w-full max-w-md bg-[#111622] border border-[#1E293B] rounded-2xl p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Access Denied</h1>
          <p className="text-xs text-[#64748B] mt-2">
            You do not have administrator privileges. Your role is: {user.role}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrors("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 1) {
      setErrors("Password field cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: formData.email, password: formData.password });
      writeRemembered(formData.rememberMe ? formData.email.trim() : null);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Invalid email or password. Please try again.";
      setErrors(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background font-sans select-none">
      {/* LEFT: MEDIA PANEL */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0E141A] text-white p-12 xl:p-16">
        <img
          src="https://supersonicdynamicservices.nl/assets/newVan5-DShjdwQj.jpg"
          alt="Supersonic electric delivery van"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0E141A]/95" />

        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
            Supersonic Dynamic Services B.V.
          </p>
        </div>

        <div className="relative space-y-8 max-w-lg">
          <h1 className="font-display text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Life moves.
            <br />
            Business moves.
            <br />
            <span className="text-primary">Everything moves.</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/80">
            Sign in to manage your moves, freight haulage and smart storage jobs, and follow every
            shipment live from request to delivery.
          </p>

          <ul className="border-t border-white/20 pt-6 space-y-4">
            <li className="flex items-center gap-3 text-sm text-white/90">
              <Truck className="h-4 w-4 text-primary shrink-0" /> Moving &amp; freight haulage
              across the Netherlands &amp; Europe
            </li>
            <li className="flex items-center gap-3 text-sm text-white/90">
              <Warehouse className="h-4 w-4 text-primary shrink-0" /> Smart, secure storage
              solutions
            </li>
            <li className="flex items-center gap-3 text-sm text-white/90">
              <Leaf className="h-4 w-4 text-primary shrink-0" /> 100% electric, zero-emission fleet
            </li>
          </ul>
        </div>

        <p className="relative text-[11px] text-white/50">
          KvK 42113033 · © 2026 Supersonic Dynamic Services B.V.
        </p>
      </aside>

      {/* RIGHT: FORM PANEL */}
      <main className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <div className="animate-in fade-in duration-200">
              <div className="mb-10 space-y-6">
                <Logo />
                <div className="space-y-1">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                    Welcome back
                  </h2>
                  <p className="text-sm text-foreground/60">Enter your credentials to continue</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
                {errors && (
                  <div className="border-l-4 border-red-600 bg-red-50 text-red-700 text-xs p-3 font-medium">
                    {errors}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70" />
                    <input
                      type="email"
                      name="sds-login-email"
                      {...noAutofill}
                      required
                      placeholder="operator@supersonic.pulse"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="sds-login-password"
                      {...noAutofill}
                      autoComplete="new-password"
                      required
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground/80 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="h-4 w-4 rounded-none border-slate-300 bg-white accent-primary focus:ring-0 cursor-pointer"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-foreground/70 cursor-pointer text-[11px]"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    to={"/forgotpassword" as any}
                    className="text-primary font-medium hover:underline text-[11px]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <CTAButton
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "var(--primary)" }}
                  className="w-full h-12 rounded-none text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                    </>
                  ) : (
                    <>
                      SIGN IN <ArrowRight className="h-4 w-4 text-white" />
                    </>
                  )}
                </CTAButton>
              </form>

              <p className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-foreground/70">
                Don't Have An Account?{" "}
                <a href="/register" className="text-primary hover:underline font-semibold">
                  Register
                </a>
              </p>
            </div>
          ) : (
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center bg-surface border border-emerald-600 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground/70">
                  Login Successful
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Authenticated session authorized for{" "}
                  <span className="text-foreground/80 font-semibold break-all">
                    {formData.email}
                  </span>
                  .
                </p>
              </div>

              <div className=" bg-sureface p-3.5 max-w-xs mx-auto flex items-center justify-between gap-3 text-left">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-foreground/70 block">
                    Redirecting Destination
                  </span>
                  <span className="text-xs text-primary font-mono font-medium block truncate">
                    {dashboardLabelForRole(user?.role)}
                  </span>
                </div>
                <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
              </div>

              <div className="w-24 h-0.5 mx-auto overflow-hidden bg-surface">
                <div
                  className="h-full bg-emerald-500 animate-[loading_2.5s_ease-in-out_forwards]"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
