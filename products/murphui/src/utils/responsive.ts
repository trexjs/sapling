export const getResponsiveValue = <T>(
  value: T | { xs?: T; sm?: T; md?: T; lg?: T; xl?: T },
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl"
): T | undefined => {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return (value as Record<string, T>)[breakpoint];
  }
  return value as T;
};
