import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/_user/forgotpassword")({
  component: UserForgotPasswordPage,
});

function UserForgotPasswordPage() {
  const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to send reset link. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans select-none">
      {/* CONTAINER CONTAINER: Styled exactly to the structural layout of S-Forgor password.jpg */}
      <div className="w-full max-w-110 rounded-[24px] border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5 transition-all">
        {!isSubmitted ? (
          <>
            {/* Header Content Blocks */}
            <div className="space-y-1.5 mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Security Portal
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Forgot Password?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Enter your email to receive a password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Validation Error Banner */}
              {(errorMsg || error) && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 font-medium animate-in fade-in duration-200">
                  {errorMsg || error}
                </div>
              )}

              {/* Email Address Input Block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  {/* Subtle right aligned text decoration placeholder element from original graphic placeholder */}
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-sans font-medium">
                    @
                  </span>
                </div>
              </div>

              {/* Reset Submit button utilizing your custom CSS --primary asset token */}
              <CTAButton
                variant="primary"
                type="submit"
                style={{ backgroundColor: "var(--primary)" }}
                className="w-full rounded-lg py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:opacity-95 flex items-center justify-center gap-2"
              >
                Send Reset Link <ArrowRight className="h-4 w-4 text-white" />
              </CTAButton>
            </form>
          </>
        ) : (
          /* Post-Submission Success Interface Module */
          <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-lg shadow-emerald-500/10">
              <MailCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold font-display text-slate-900">Check Your Inbox</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                We have securely dispatched an authorization token recovery link to{" "}
                <span className="text-slate-900 font-semibold break-all">{email}</span>.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-slate-500 hover:text-primary transition underline block mx-auto pt-2"
            >
              Resend recovery link
            </button>
          </div>
        )}

        {/* Bottom Utility Footer Return Navigation */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition font-medium"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}