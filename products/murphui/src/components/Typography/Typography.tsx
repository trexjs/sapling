import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "overline" | "button";
  component?: keyof JSX.IntrinsicElements;
  color?: "primary" | "secondary" | "textPrimary" | "textSecondary" | "error";
  align?: "left" | "center" | "right" | "justify";
  gutterBottom?: boolean;
  noWrap?: boolean;
}

const StyledTypography = styled.span<TypographyProps>`
  margin: 0;
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    const variant = props.variant || "body1";
    const typography = theme.typography[variant];
    
    return `
      font-size: ${typography.fontSize};
      font-weight: ${typography.fontWeight};
      line-height: ${typography.lineHeight};
      letter-spacing: ${typography.letterSpacing || "normal"};
    `;
  }}
  
  color: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.color) {
      case "primary":
        return theme.colors.primary[500];
      case "secondary":
        return theme.colors.secondary[500];
      case "textSecondary":
        return theme.colors.text.secondary;
      case "error":
        return theme.colors.error[500];
      default:
        return theme.colors.text.primary;
    }
  }};
  
  text-align: ${(props) => props.align || "left"};
  margin-bottom: ${(props) =>
    props.gutterBottom ? (props.theme as XloxTheme).spacing(2) : 0};
  
  ${(props) =>
    props.noWrap &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`;

const defaultComponentMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subtitle1: "h6",
  subtitle2: "h6",
  body1: "p",
  body2: "p",
  caption: "span",
  overline: "span",
  button: "span",
} as const;

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "body1",
  component,
  ...props
}) => {
  const Component = component || (defaultComponentMapping[variant] as any);
  
  return (
    <StyledTypography as={Component} variant={variant} {...props}>
      {children}
    </StyledTypography>
  );
};

Typography.displayName = "Typography";
