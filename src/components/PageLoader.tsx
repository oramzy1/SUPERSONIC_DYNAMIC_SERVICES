import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import loaderAnimation from "@/assets/animations/loader.json";

export default function PageLoader() {
  const [mounted, setMounted] = useState(false);
  const [LottieComponent, setLottieComponent] = useState<any>(null);

  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });

  const [show, setShow] = useState(true);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prevent SSR rendering
  useEffect(() => {
    setMounted(true);

    import("lottie-react").then((mod) => {
      setLottieComponent(() => mod.default);
    });
  }, []);

  // Initial splash
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Navigation loading
  useEffect(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    if (isLoading) {
      setShow(true);
    } else {
      hideTimer.current = setTimeout(() => setShow(false), 600);
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
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background/85 backdrop-blur-sm"
        >
          {LottieComponent && (
            <LottieComponent
              animationData={loaderAnimation}
              loop
              autoplay
              className="h-60 w-60"
            />
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}