import { ThemeBreakpoints } from "./types";

const breakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const breakpoints: ThemeBreakpoints = {
  values: breakpointValues,
  up: (key) => `@media (min-width: ${breakpointValues[key]}px)`,
  down: (key) => {
    const value = breakpointValues[key];
    return value === 0 ? "@media (max-width: 0px)" : `@media (max-width: ${value - 1}px)`;
  },
  between: (start, end) =>
    `@media (min-width: ${breakpointValues[start]}px) and (max-width: ${breakpointValues[end] - 1}px)`,
};
