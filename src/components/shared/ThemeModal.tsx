import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeMode } from "@/lib/theme";
import { Check, Laptop, Moon, Sun, X } from "lucide-react";

export function ThemeModal() {
  const { theme, setTheme, isThemeModalOpen, setIsThemeModalOpen } = useTheme();

  if (!isThemeModalOpen) return null;

  const options: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
    {
      mode: "light",
      label: "Light Mode",
      icon: Sun,
      description: "Clean, bright interface designed for high clarity",
    },
    {
      mode: "dark",
      label: "Dark Mode",
      icon: Moon,
      description: "Sleek navy palette designed for reduced eye strain",
    },
    {
      mode: "system",
      label: "System Preference",
      icon: Laptop,
      description: "Automatically matches your device system appearance",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-surface border border-border text-foreground shadow-2xl p-6 sm:p-7 relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => setIsThemeModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition"
          aria-label="Close theme selection"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold font-display text-foreground">Appearance Theme</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Choose your preferred display theme for Supersonic Dynamic Services.
          </p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = theme === opt.mode;
            const Icon = opt.icon;

            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => {
                  setTheme(opt.mode);
                  setIsThemeModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition text-left ${
                  isSelected
                    ? "bg-secondary/40 border-primary text-foreground shadow-sm"
                    : "bg-surface-2 border-border/60 hover:bg-accent hover:border-border text-foreground"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-lg ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.description}</div>
                  </div>
                </div>

                {isSelected && (
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
