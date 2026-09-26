import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeMode } from "@/lib/theme";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (mode: ThemeMode) => void;
  systemPromptChoice: "maintained" | "rejected" | null;
  respondToSystemPrompt: (choice: "maintained" | "rejected") => void;
  showSystemPromptBanner: boolean;
  setShowSystemPromptBanner: (show: boolean) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY_THEME = "supersonic_theme_mode";
const STORAGE_KEY_PROMPT = "supersonic_theme_prompt_choice";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode | null;
      if (saved && ["light", "dark", "system"].includes(saved)) {
        return saved;
      }
    }
    return "system";
  });

  const [systemPromptChoice, setSystemPromptChoice] = useState<"maintained" | "rejected" | null>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY_PROMPT) as "maintained" | "rejected" | null;
        if (saved && ["maintained", "rejected"].includes(saved)) {
          return saved;
        }
      }
      return null;
    }
  );

  const [showSystemPromptBanner, setShowSystemPromptBanner] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined" && systemPromptChoice === null) {
      setShowSystemPromptBanner(true);
    }
  }, [systemPromptChoice]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateResolvedTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
      const effectiveTheme = isDark ? "dark" : "light";
      setResolvedTheme(effectiveTheme);

      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    };

    updateResolvedTheme();

    const handleChange = () => {
      if (theme === "system") {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_THEME, mode);
    }
  };

  const respondToSystemPrompt = (choice: "maintained" | "rejected") => {
    setSystemPromptChoice(choice);
    setShowSystemPromptBanner(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PROMPT, choice);
    }
    if (choice === "rejected") {
      setIsThemeModalOpen(true);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        systemPromptChoice,
        respondToSystemPrompt,
        showSystemPromptBanner,
        setShowSystemPromptBanner,
        isThemeModalOpen,
        setIsThemeModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
