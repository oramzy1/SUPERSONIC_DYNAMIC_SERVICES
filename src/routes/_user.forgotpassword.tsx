import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";

export const Route = createFileRoute("/_user/forgotpassword")({
  component: UserForgotPasswordPage,
});

function UserForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strict Email validation sequence to filter spam inputs
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Process secure link dispatch
    console.log("Requesting password reset payload for:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-white flex items-center justify-center p-4 font-sans select-none">
      {/* CONTAINER CONTAINER: Styled exactly to the structural layout of S-Forgor password.jpg */}
      <div className="w-full max-w-110 rounded-[24px] border border-white/10 bg-white/2 p-6 sm:p-10 backdrop-blur-xl shadow-2xl transition-all">
        {!isSubmitted ? (
          <>
            {/* Header Content Blocks */}
            <div className="space-y-1.5 mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Security Portal
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Forgot Password?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Enter your email to receive a password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Validation Error Banner */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 font-medium animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* Email Address Input Block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-4 pr-11 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                  />
                  {/* Subtle right aligned text decoration placeholder element from original graphic placeholder */}
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-600 font-sans font-medium">
                    @
                  </span>
                </div>
              </div>

              {/* Reset Submit button utilizing your custom CSS --primary asset token */}
              <CTAButton
                variant="primary"
                type="submit"
                style={{ backgroundColor: "var(--primary)" }}
                className="w-full rounded-xl py-3 text-xs sm:text-sm font-semibold text-slate-900 transition hover:opacity-95 flex items-center justify-center gap-2"
              >
                Send Reset Link <ArrowRight className="h-4 w-4 text-slate-900" />
              </CTAButton>
            </form>
          </>
        ) : (
          /* Post-Submission Success Interface Module */
          <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8EA7FF]/10 text-[#8EA7FF]">
              <MailCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold font-display text-white">Check Your Inbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                We have securely dispatched an authorization token recovery link to{" "}
                <span className="text-white font-medium">{email}</span>.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-slate-500 hover:text-white transition underline block mx-auto pt-2"
            >
              Resend recovery link
            </button>
          </div>
        )}

        {/* Bottom Utility Footer Return Navigation */}
        <div className="mt-8 pt-2 border-t border-white/5 flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
