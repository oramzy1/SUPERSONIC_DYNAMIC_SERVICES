import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type LoadingContextValue = {
  isLoading: boolean;
  message: string;
  show: (msg?: string) => void;
  hide: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading…");

  const show = useCallback((msg = "Loading…") => {
    setMessage(msg);
    setLoading(true);
  }, []);
  const hide = useCallback(() => setLoading(false), []);

  const value = useMemo(() => ({ isLoading, message, show, hide }), [isLoading, message, show, hide]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="global-loader" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-100 grid place-items-center bg-[#0E141A]/85 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-5">
              <div className="relative h-14 w-14">
                <span className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="text-sm tracking-wide text-muted-foreground">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used inside LoadingProvider");
  return ctx;
}
