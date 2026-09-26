import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Laptop, X } from "lucide-react";

export function SystemThemePromptBanner() {
  const { showSystemPromptBanner, respondToSystemPrompt } = useTheme();

  if (!showSystemPromptBanner) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96 rounded-2xl bg-surface border border-border p-4 shadow-xl text-foreground backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
            <Laptop className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Theme Preference
            </h5>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              We've set your theme to automatically match your system settings. Would you like to maintain this preference?
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => respondToSystemPrompt("maintained")}
          className="text-muted-foreground hover:text-foreground p-1 transition"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs">
        <button
          type="button"
          onClick={() => respondToSystemPrompt("rejected")}
          className="px-3 py-1.5 rounded-lg border border-border bg-surface-2 hover:bg-accent text-foreground transition font-medium"
        >
          Customize
        </button>
        <button
          type="button"
          onClick={() => respondToSystemPrompt("maintained")}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
        >
          Maintain
        </button>
      </div>
    </div>
  );
}
