import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Check } from "lucide-react";
import { quotesApi } from "@/lib/api";

export const Route = createFileRoute("/quoteprocessing")({
  component: RouteComponent,
});

const PROCESSING_STEPS = [
  "Checking your relocation details",
  "Matching you with the best moving solution",
  "Calculating your personalized quote",
  "Your quote is almost ready",
];

function extractErrorMessage(err: unknown): string {
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return (
      detail
        .map((d: any) => (d?.msg ? `${(d.loc ?? []).slice(-1)[0] ?? "field"}: ${d.msg}` : null))
        .filter(Boolean)
        .join(" · ") || "Please check the details you entered."
    );
  }
  if (typeof detail === "string") return detail;
  return "Failed to submit quote request. Please try again.";
}

function RouteComponent() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [slow, setSlow] = useState(false);
  const requestStarted = useRef(false);

  // The only submit. The ref keeps StrictMode's double-run from sending it twice.
  useEffect(() => {
    if (requestStarted.current) return;

    const raw = sessionStorage.getItem("sds_quote_payload");
    if (!raw) {
      navigate({ to: "/quoterequest", replace: true });
      return;
    }
    requestStarted.current = true;
    sessionStorage.removeItem("sds_quote_payload"); // a refresh can't resubmit it

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      navigate({ to: "/quoterequest", replace: true });
      return;
    }

    quotesApi
      .createRequest(payload)
      .then(() => {
        sessionStorage.removeItem("sds_quote_draft");
        setDone(true);
        setTimeout(() => navigate({ to: "/quotesuccess", replace: true }), 600);
      })
      .catch((err: unknown) => {
        sessionStorage.setItem("sds_quote_error", extractErrorMessage(err));
        navigate({ to: "/quoterequest", replace: true });
      });
  }, [navigate]);

  // Visual only: ease toward 90%, jump to 100% on real success
  useEffect(() => {
    if (done) {
      setProgress(100);
      return;
    }
    const tick = setInterval(() => setProgress((p) => p + (90 - p) * 0.05), 100);
    const slowTimer = setTimeout(() => setSlow(true), 8000);
    return () => {
      clearInterval(tick);
      clearTimeout(slowTimer);
    };
  }, [done]);

  const currentStepIndex = done
    ? PROCESSING_STEPS.length - 1
    : Math.min(PROCESSING_STEPS.length - 1, Math.floor(progress / 25));

  return (
    <div className="min-h-[90vh] w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: progress ring */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
          <div className="relative flex justify-center items-center h-28 w-28">
            <svg className="absolute transform -rotate-90 w-28 h-28">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-white/10 fill-none"
                strokeWidth="4"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-primary fill-none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={301.6}
                strokeDashoffset={301.6 - (301.6 * progress) / 100}
                style={{ transition: "stroke-dashoffset 0.4s ease-out" }}
              />
            </svg>
            <Truck className="h-7 w-7 text-primary z-10" />
          </div>

          <div className="text-center">
            <span className="font-mono text-2xl font-semibold tracking-tight text-primary">
              {Math.round(progress)}%
            </span>
            <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase mt-0.5">
              Preparing your quote
            </p>
          </div>
        </div>

        {/* Right: step checklist */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-wide text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-xs border border-primary/25 inline-block">
              Quote in progress
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground/70">
              Processing your request
            </h2>
            <p className="text-sm text-slate-400" role="status">
              {slow
                ? "Taking a little longer than usual. Please keep this page open."
                : "This usually takes just a few seconds."}
            </p>
          </div>

          <div className="space-y-3.5 text-left">
            {PROCESSING_STEPS.map((stepText, index) => {
              const isCompleted = currentStepIndex > index;
              const isActive = currentStepIndex === index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : isCompleted ? "opacity-70" : "opacity-40"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] border shrink-0 transition-colors ${
                      isCompleted
                        ? "bg-primary border-primary text-foreground/70"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-white/20 text-foreground/60"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-3" /> : index + 1}
                  </div>
                  <span
                    className={`text-sm ${isActive ? "font-medium text-foreground/70" : "text-slate-400"}`}
                  >
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-foreground/60">
            <ShieldCheck className="h-4 w-4 text-primary/70" />
            Your information is encrypted and secure
          </div>
        </div>
      </div>
    </div>
  );
}
