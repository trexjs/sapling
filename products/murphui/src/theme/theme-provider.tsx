import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { XloxTheme } from "./types";
import { lightPalette, darkPalette } from "./palette";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { breakpoints } from "./breakpoints";

const shadows = [
  "none",
  "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "0 25px 50px -12px rgb(0 0 0 / 0.25)",
];

const createTheme = (mode: "light" | "dark"): XloxTheme => ({
  colors: mode === "light" ? lightPalette : darkPalette,
  typography,
  spacing,
  breakpoints,
  shadows,
  shape: {
    borderRadius: 8,
  },
  direction: "ltr",
  density: "comfortable",
});

type ThemeContextType = {
  theme: XloxTheme;
  mode: "light" | "dark";
  toggleTheme: () => void;
  setMode: (mode: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within XloxThemeProvider");
  }
  return context;
};

type XloxThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: "light" | "dark";
};

export const XloxThemeProvider: React.FC<XloxThemeProviderProps> = ({
  children,
  defaultMode = "light",
}) => {
  const [mode, setMode] = useState<"light" | "dark">(defaultMode);

  const theme = useMemo(() => createTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const contextValue = useMemo(
    () => ({
      theme,
      mode,
      toggleTheme,
      setMode,
    }),
    [theme, mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};
