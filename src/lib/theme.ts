export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  background: {
    primary: string;
    surface: string;
    surface2: string;
    footer?: string;
    popover: string;
  };
  text: {
    primary: string;
    muted: string;
    placeholder: string;
  };
  accents: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    ring: string;
    cyan: string;
  };
  ui: {
    border: string;
    input: string;
    destructive: string;
    destructiveForeground: string;
  };
  scrollbar: {
    track: string;
    thumb: string;
    thumbHover: string;
  };
  glass: {
    background: string;
    border: string;
    primaryGlow?: string;
  };
}

export const LIGHT_THEME: ThemeColors = {
  background: {
    primary: "#fefefe",
    surface: "#fdf8f8fd",
    surface2: "#fcfcfc",
    popover: "#FFFFFF",
  },
  text: {
    primary: "#0F172A",
    muted: "#525c69",
    placeholder: "#94A3B8",
  },
  accents: {
    primary: "#002889",
    primaryForeground: "#FFFFFF",
    secondary: "#EEF2FF",
    secondaryForeground: "#3730A3",
    accent: "#F1F5F9",
    accentForeground: "#0F172A",
    ring: "#3730A3",
    cyan: "#000000",
  },
  ui: {
    border: "#E2E8F0",
    input: "#E2E8F0",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
  },
  scrollbar: {
    track: "#F8FAFC",
    thumb: "#CBD5E1",
    thumbHover: "#94A3B8",
  },
  glass: {
    background: "rgb(255, 255, 255)",
    border: "rgba(15, 23, 42, 0.08)",
  },
};

export const DARK_THEME: ThemeColors = {
  background: {
    primary: "#0E141A",
    surface: "#161C22",
    surface2: "#1B232B",
    footer: "#090F15",
    popover: "#161C22",
  },
  text: {
    primary: "#E8EEF4",
    muted: "#8A95A1",
    placeholder: "#5b6773",
  },
  accents: {
    primary: "#F4D35E",
    primaryForeground: "#0E141A",
    secondary: "#002B73",
    secondaryForeground: "#E8EEF4",
    accent: "#1B232B",
    accentForeground: "#E8EEF4",
    ring: "#79FF5B",
    cyan: "#6FE5FF",
  },
  ui: {
    border: "rgba(255, 255, 255, 0.08)",
    input: "rgba(255, 255, 255, 0.10)",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
  },
  scrollbar: {
    track: "#0E141A",
    thumb: "#1B232B",
    thumbHover: "#2A333D",
  },
  glass: {
    background: "rgba(22, 28, 34, 0.55)",
    border: "rgba(255, 255, 255, 0.08)",
    primaryGlow: "rgba(121, 255, 91, 0.5)",
  },
};
