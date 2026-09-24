import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem("sds_quote_payload");
    if (!raw) {
      navigate({ to: "/quoterequest" });
      return;
    }
    const payload = JSON.parse(raw);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    // Animate up to 90% while the real request is in flight; only real
    // success jumps it to 100%.
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 60);

    quotesApi
      .createRequest(payload)
      .then(() => {
        sessionStorage.removeItem("sds_quote_payload");
        clearInterval(stepInterval);
        clearInterval(progressInterval);
        setCurrentStepIndex(PROCESSING_STEPS.length - 1);
        setProgress(100);
        setTimeout(() => navigate({ to: "/quotesuccess" }), 400);
      })
      .catch((err: unknown) => {
        const msg = extractErrorMessage(err);
        sessionStorage.setItem("sds_quote_error", msg);
        sessionStorage.removeItem("sds_quote_payload");
        navigate({ to: "/quoterequest" });
      })
      .finally(() => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      });

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-[90vh] w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl border border-slate-200 bg-white rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-900/5 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: progress ring */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-8">
          <div className="relative flex justify-center items-center h-28 w-28">
            <svg className="absolute transform -rotate-90 w-28 h-28">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-slate-200 fill-none"
                strokeWidth="4"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-primary fill-none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={301.6}
                strokeDashoffset={301.6 - (301.6 * progress) / 100}
                transition={{ ease: "linear" }}
              />
            </svg>
            <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Truck className="h-7 w-7 text-primary" />
            </div>
          </div>

          <div className="text-center">
            <span className="font-mono text-2xl font-semibold tracking-tight text-slate-900">
              {progress}%
            </span>
            <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase mt-0.5">
              Preparing your quote
            </p>
          </div>
        </div>

        {/* Right: step checklist */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-wide text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 inline-block">
              Quote in progress
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Processing your request
            </h2>
            <p className="text-sm text-slate-500">This usually takes just a few seconds.</p>
          </div>

          <div className="space-y-3.5 text-left">
            {PROCESSING_STEPS.map((stepText, index) => {
              const isCompleted = currentStepIndex > index;
              const isActive = currentStepIndex === index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-50"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] border shrink-0 transition-colors ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-300 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-3" /> : index + 1}
                  </div>
                  <span
                    className={`text-sm ${isActive ? "font-medium text-slate-900" : "text-slate-500"}`}
                  >
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-medium text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Your information is encrypted and secure
          </div>
        </div>
      </div>
    </div>
  );
}