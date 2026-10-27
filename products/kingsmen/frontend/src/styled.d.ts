import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    palette: {
      primary: string;
      accent: string;
      background: string;
    };
  }
}
