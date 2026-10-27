export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type ThemeColors = {
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
  neutral: ColorScale;
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
};

export type TypographyVariant = {
  fontSize: string;
  fontWeight: number;
  lineHeight: number | string;
  letterSpacing?: string;
};

export type ThemeTypography = {
  fontFamily: string;
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  h4: TypographyVariant;
  h5: TypographyVariant;
  h6: TypographyVariant;
  subtitle1: TypographyVariant;
  subtitle2: TypographyVariant;
  body1: TypographyVariant;
  body2: TypographyVariant;
  caption: TypographyVariant;
  overline: TypographyVariant;
  button: TypographyVariant;
};

export type ThemeSpacing = (factor: number) => string;

export type ThemeBreakpoints = {
  values: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  up: (key: keyof ThemeBreakpoints["values"]) => string;
  down: (key: keyof ThemeBreakpoints["values"]) => string;
  between: (
    start: keyof ThemeBreakpoints["values"],
    end: keyof ThemeBreakpoints["values"]
  ) => string;
};

export type ThemeShadows = string[];

export type ThemeShape = {
  borderRadius: number;
};

export type XloxTheme = {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  shadows: ThemeShadows;
  shape: ThemeShape;
  direction: "ltr" | "rtl";
  density: "comfortable" | "compact";
};
