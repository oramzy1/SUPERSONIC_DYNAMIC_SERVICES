import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/quote_/processing")({
  component: Processing,
});

const STEPS = ["Mapping Fleet", "Syncing Nodes", "Securing Carbon Offsets"];

function Processing() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const id = setInterval(() => setActive((a) => Math.min(a + 1, STEPS.length - 1)), 1100);
  //   const go = setTimeout(() => navigate({ to: "/quote/success" }), 4200);
  //   return () => { clearInterval(id); clearTimeout(go); };
  // }, []);


  useEffect(() => {
  const id = setInterval(() => setActive((a) => Math.min(a + 1, STEPS.length - 1)), 1100)
  const go = setTimeout(() => {
    window.location.href = '/quote/success'
  }, 4200)
  return () => {
    clearInterval(id)
    clearTimeout(go)
  }
}, [])
  return (
    <SiteLayout marquee={false}>
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center md:px-8">
        <div className="flex items-end gap-1.5">
          {[0,1,2,3].map((i) => (
            <span key={i} className="dot h-2 w-2 rounded-full bg-primary" style={{ animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 font-display text-4xl font-bold md:text-6xl"
        >
          Calculating Your Pulse
        </motion.h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Our AI engine is optimizing your logistics route for <span className="text-foreground">maximum efficiency</span> and <span className="text-[#6FE5FF]">zero waste</span>.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {STEPS.map((s, i) => {
            const state = i < active ? "done" : i === active ? "active" : "pending";
            return (
              <span
                key={s}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  state === "active"
                    ? "border-primary/60 text-primary"
                    : state === "done"
                    ? "border-white/15 text-foreground/80"
                    : "border-white/10 text-muted-foreground"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${state === "pending" ? "bg-muted-foreground" : "bg-primary"}`} />
                {s}
              </span>
            );
          })}
        </div>

        <p className="mt-16 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Supersonic Dynamic Services B.V. © 2024
        </p>
      </section>
    </SiteLayout>
  );
}
