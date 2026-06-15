import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Cpu, Network } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute()({
  component: QuoteProcessing,
});

const PROGRESS_STATES = [
  { text: "Initializing secure connection matrix...", icon: Network },
  { text: "Calculating dynamic routing parameters...", icon: Cpu },
  { text: "Optimizing eco-precision cost structures...", icon: ShieldCheck },
];

function QuoteProcessing() {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    // Step through telemetry text variations over the 3 seconds
    const intervals = [1000, 2000];
    const timers = intervals.map((time, index) => 
      setTimeout(() => setCurrentState(index + 1), time)
    );

    // Final redirection timer to success screen
    const redirectTimer = setTimeout(
      () => navigate({ to: "/quote/success", params: { slug: "success" } }),
      3200,
    );

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  const ActiveIcon = PROGRESS_STATES[currentState]?.icon || Cpu;

  return (
    <SiteLayout marquee={false}>
      <div className="min-h-[75vh] w-full flex flex-col items-center justify-center text-center px-6 bg-[#0B0F14] text-white relative overflow-hidden">
        
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-(--primary)/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Premium Spinner Graphic Section */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Decorative outer dash ring spinning counter-clockwise */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute h-24 w-24 rounded-full border border-dashed border-white/10"
          />
          
          {/* Main animated color core ring container */}
          <div className="relative h-20 w-20 rounded-2xl bg-[#0F151C] border border-white/10 flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-primary border-r-primary opacity-40"
            />
            <motion.div
              key={currentState}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-primary"
            >
              <Loader2 className="h-8 w-8 animate-spin" />
            </motion.div>
          </div>
        </div>

        {/* Telemetry Typography Block */}
        <div className="space-y-3 max-w-md z-10">
          <h1 className="font-display text-2xl font-bold md:text-3xl tracking-tight text-white">
            Processing Request
          </h1>
          
          {/* Animated loading subtext box to keep user attention engaged */}
          <div className="h-12 flex items-center justify-center">
            <motion.div
              key={currentState}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-slate-400"
            >
              <ActiveIcon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{PROGRESS_STATES[currentState]?.text}</span>
            </motion.div>
          </div>
          
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Please maintain connection. Our terminal is optimizing logistics configurations for your relocation in the Netherlands.
          </p>
        </div>

      </div>
    </SiteLayout>
  );
}