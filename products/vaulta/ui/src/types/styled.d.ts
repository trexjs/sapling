import 'styled-components';
import { theme } from '../styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof theme.colors;
    spacing: typeof theme.spacing;
    borderRadius: typeof theme.borderRadius;
    typography: typeof theme.typography;
    breakpoints: typeof theme.breakpoints;
    zIndex: typeof theme.zIndex;
  }
}
