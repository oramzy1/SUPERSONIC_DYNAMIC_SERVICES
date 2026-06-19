import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, ArrowUpRight, Check } from "lucide-react";

export const Route = createFileRoute("/quoteprocessing")({
  component: RouteComponent,
});

const PROCESSING_STEPS = [
  "Validating logistical coordinates...",
  "Calculating carbon-neutral fleet metrics...",
  "Optimizing regional transit routing...",
  "Finalizing transparent rate variables...",
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
    <div className="min-h-[90vh] w-full flex flex-col items-center justify-center px-4 bg-background selection:bg-primary/30">
      <div className="w-full max-w-2xl bg-surface/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-10 shadow-1xl space-y-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Hand Visual Node Section */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-8">
          <div className="relative flex justify-center items-center h-32 w-32">
            {/* Pulsing Accent Rings */}
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />

            {/* SVG Circular Track Metrics */}
            <svg className="absolute transform -rotate-90 w-28 h-28">
              <circle cx="56" cy="56" r="48" className="stroke-white/5 fill-none" strokeWidth="4" />
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-primary fill-none"
                strokeWidth="4"
                strokeDasharray={301.6}
                strokeDashoffset={301.6 - (301.6 * progress) / 100}
                transition={{ ease: "linear" }}
              />
            </svg>
            <Cpu className="h-8 w-8 text-slate-400 opacity-80 z-10 animate-pulse" />
          </div>

          <div className="text-center">
            <span className="font-mono text-2xl font-bold tracking-tight text-white">
              {progress}%
            </span>
            <p className="text-[10px] font-bold tracking-widest text-primary uppercase mt-0.5">
              Analyzing Data
            </p>
          </div>
        </div>

        {/* Right Hand Context Progress Flow Tracker */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 inline-block">
              Engine Framework
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              Processing Request
            </h2>
          </div>

          {/* Checklist Architecture Mapping Stream */}
          <div className="space-y-3.5 text-left">
            {PROCESSING_STEPS.map((stepText, index) => {
              const isCompleted = currentStepIndex > index;
              const isActive = currentStepIndex === index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    isActive ? "opacity-100 scale-102" : isCompleted ? "opacity-60" : "opacity-25"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] border shrink-0 transition-all ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isActive
                          ? "border-primary text-primary animate-pulse"
                          : "border-white/10 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-3" /> : index + 1}
                  </div>
                  <span
                    className={`text-xs sm:text-sm tracking-wide ${isActive ? "font-medium text-white" : "text-slate-400"}`}
                  >
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Secure Assurances Footer Layout Block */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary/70" />
              256-Bit SSL Encrypted
            </span>
            <span className="h-1 w-1 rounded-full bg-white/10 hidden sm:inline" />
            <span className="flex items-center gap-1.5 ml-auto md:ml-0">
              NL Systems Verify
              <ArrowUpRight className="h-3 w-3 opacity-60" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
