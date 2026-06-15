import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; 
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/quote/processing")({
  component: QuoteProcessing,
});

function QuoteProcessing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a 3-second server processing time, then redirect to success
    const timer = setTimeout(() => {
      navigate({ to: "/quote/success" });
    }, 3000);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [navigate]);

  return (
    <SiteLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-primary mb-6"
        >
          <Loader2 className="h-12 w-12" />
        </motion.div>
        
        <h1 className="font-display text-2xl font-bold md:text-3xl tracking-tight">
          Processing Your Request
        </h1>
        <p className="mt-2 text-muted-foreground max-w-sm text-sm">
          Please hold tight while our system calculates your dynamic routing parameters and optimizes your quote structure.
        </p>
      </div>
    </SiteLayout>
  );
}