import { ColorScale, ThemeColors } from "./types";

export const primaryColors: ColorScale = {
  50: "#f0f9ff",
  100: "#e0f2fe",
  200: "#bae6fd",
  300: "#7dd3fc",
  400: "#38bdf8",
  500: "#0ea5e9",
  600: "#0284c7",
  700: "#0369a1",
  800: "#075985",
  900: "#0c4a6e",
};

export const secondaryColors: ColorScale = {
  50: "#faf5ff",
  100: "#f3e8ff",
  200: "#e9d5ff",
  300: "#d8b4fe",
  400: "#c084fc",
  500: "#a855f7",
  600: "#9333ea",
  700: "#7e22ce",
  800: "#6b21a8",
  900: "#581c87",
};

export const successColors: ColorScale = {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
};

export const warningColors: ColorScale = {
  50: "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f",
};

export const errorColors: ColorScale = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
};

export const infoColors: ColorScale = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a",
};

export const neutralColors: ColorScale = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
};

export const lightPalette: ThemeColors = {
  primary: primaryColors,
  secondary: secondaryColors,
  success: successColors,
  warning: warningColors,
  error: errorColors,
  info: infoColors,
  neutral: neutralColors,
  background: {
    default: "#ffffff",
    paper: "#f9fafb",
  },
  text: {
    primary: "#171717",
    secondary: "#525252",
    disabled: "#a3a3a3",
  },
};

export const darkPalette: ThemeColors = {
  primary: primaryColors,
  secondary: secondaryColors,
  success: successColors,
  warning: warningColors,
  error: errorColors,
  info: infoColors,
  neutral: neutralColors,
  background: {
    default: "#0a0a0a",
    paper: "#171717",
  },
  text: {
    primary: "#fafafa",
    secondary: "#d4d4d4",
    disabled: "#737373",
  },
};
