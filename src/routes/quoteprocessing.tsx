import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Check } from "lucide-react";

export const Route = createFileRoute("/quoteprocessing")({
  component: RouteComponent,
});

const PROCESSING_STEPS = [
  "Validating shipment details",
  "Calculating carbon-neutral fleet options",
  "Optimizing regional transit routing",
  "Finalizing your rate",
];

function RouteComponent() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          navigate({ to: "/quotesuccess" });
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-[90vh] w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
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
            <Truck className="h-7 w-7 text-primary z-10" />
          </div>

          <div className="text-center">
            <span className="font-mono text-2xl font-semibold tracking-tight text-white">
              {progress}%
            </span>
            <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase mt-0.5">
              Preparing your quote
            </p>
          </div>
        </div>

        {/* Right: step checklist */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-wide text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-md border border-primary/25 inline-block">
              Quote in progress
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Processing your request
            </h2>
            <p className="text-sm text-slate-400">This usually takes just a few seconds.</p>
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
                        ? "bg-primary border-primary text-white"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-white/20 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-3" /> : index + 1}
                  </div>
                  <span
                    className={`text-sm ${isActive ? "font-medium text-white" : "text-slate-400"}`}
                  >
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-slate-500">
            <ShieldCheck className="h-4 w-4 text-primary/70" />
            Your information is encrypted and secure
          </div>
        </div>
      </div>
    </div>
  );
}
