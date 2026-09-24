import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, ShieldCheck, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { authApi } from "@/lib/api";
import { useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/_user/setnewpassword")({
  component: UserSetNewPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || "",
  }),
});

function UserSetNewPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { token } = Route.useSearch();

  // Password validation checklist tracking states
  const [validation, setValidation] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Dynamic regex analysis whenever password field values shift
  useEffect(() => {
    setValidation({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const allCriteriaMet = Object.values(validation).every(Boolean);
    if (!allCriteriaMet) {
      setErrorMsg("Please fulfill all security criteria below before proceeding.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }
    if (!token) {
      setErrorMsg("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({
        token,
        new_password: password,
        password_confirmation: confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to reset password. The token may have expired.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full text-slate-900 flex items-center justify-center p-4 font-sans select-none">
      {/* FULL WRAPPER: Centers content elements structurally identical to S-Create new password.png */}
      <div className="w-full max-w-115 space-y-6">
        <div className="text-left space-y-2 px-1">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
            Secure your kinetic account with a high-performance credential.
          </p>
        </div>

        {/* CONTAINER CARD */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5 transition-all">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Validation Error Alerts Banner */}
              {(errorMsg || error) && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 font-medium animate-in fade-in duration-200">
                  {errorMsg || error}
                </div>
              )}

              {/* New Password Input Box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Confirm New Password Input Box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* COMPLEXITY CHECKS PANEL: Matches grid requirements from S-Create new password.png */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {/* Rule 1: Characters Count */}
                <div className="flex items-center gap-2.5 text-xs">
                  {validation.hasMinLength ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                  )}
                  <span className={validation.hasMinLength ? "text-slate-900 font-medium" : "text-slate-500"}>
                    8+ Characters
                  </span>
                </div>

                {/* Rule 2: Special Characters */}
                <div className="flex items-center gap-2.5 text-xs">
                  {validation.hasSpecialChar ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                  )}
                  <span className={validation.hasSpecialChar ? "text-slate-900 font-medium" : "text-slate-500"}>
                    1 Special Char
                  </span>
                </div>

                {/* Rule 3: Uppercase Character */}
                <div className="flex items-center gap-2.5 text-xs">
                  {validation.hasUppercase ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                  )}
                  <span className={validation.hasUppercase ? "text-slate-900 font-medium" : "text-slate-500"}>
                    1 Uppercase
                  </span>
                </div>

                {/* Rule 4: Numerical Digit */}
                <div className="flex items-center gap-2.5 text-xs">
                  {validation.hasNumber ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                  )}
                  <span className={validation.hasNumber ? "text-slate-900 font-medium" : "text-slate-500"}>
                    1 Number
                  </span>
                </div>
              </div>

              {/* Action Trigger Submit using --primary color token variables */}
              <CTAButton
                variant="primary"
                type="submit"
                style={{ backgroundColor: "var(--primary)" }}
                className="w-full rounded-xl py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:opacity-95 flex items-center justify-center gap-2 pt-2"
              >
                Reset Password <ArrowRight className="h-4 w-4 text-white" />
              </CTAButton>
            </form>
          ) : (
            /* Inline Success Notification Interface Wrapper */
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold font-display text-slate-900">Password Updated</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  Your credentials have been securely provisioned. You can now access your profile
                  safely.
                </p>
              </div>
              <CTAButton
                variant="primary"
                onClick={() => navigate({ to: "/login" as any })}
                style={{ backgroundColor: "var(--primary)" }}
                className="w-full rounded-xl py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/25 mt-2"
              >
                Proceed to Login
              </CTAButton>
            </div>
          )}
        </div>

        {/* Footer help link line precisely duplicating graphic text content */}
        <p className="text-center text-xs text-slate-500">
          Need technical support?{" "}
          <Link to="/support" className="text-primary hover:underline font-medium" search={function (current: { tab?: ("security" | "profile" | "notifications" | "api") | undefined; }): never {
            throw new Error("Function not implemented.");
          } } params={function (current: { slug?: string | undefined; }): never {
            throw new Error("Function not implemented.");
          } }>
            Contact Intelligence Desk
          </Link>
        </p>
      </div>
    </div>
  );
}