import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

export default function PageLoader() {
  const [mounted, setMounted] = useState(false);

  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });

  const [show, setShow] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prevent SSR rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial splash timing (swift but smooth)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Navigation loading routing logic
  useEffect(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    if (isLoading) {
      setShow(true);
    } else {
      // 500ms is perfectly snappy while avoiding layout flickering
      hideTimer.current = setTimeout(() => setShow(false), 500);
    }

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isLoading]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
        >
          <div className="relative flex items-center justify-center">
            {/* Ambient Background Glow Effect */}
            <motion.div
              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-32 w-32 rounded-full bg-cyan-500/20 blur-xl"
            />

            {/* Main Outer Tech Spinner Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              className="h-14 w-14 rounded-full border-2 border-white/5 border-t-cyan-400 border-r-cyan-400/30"
            />

            {/* Core Inner Reverse Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="absolute h-8 w-8 rounded-full border border-white/5 border-t-white/40"
            />
          </div>

          {/* Minimalist Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-[10px] font-semibold tracking-[0.25em] text-white uppercase"
          >
            Loading
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
