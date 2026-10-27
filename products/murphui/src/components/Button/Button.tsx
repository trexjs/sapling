import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-family: ${(props) => (props.theme as XloxTheme).typography.button.fontFamily};
  font-size: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.size) {
      case "small":
        return "0.75rem";
      case "large":
        return "1rem";
      default:
        return theme.typography.button.fontSize;
    }
  }};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.button.fontWeight};
  line-height: ${(props) => (props.theme as XloxTheme).typography.button.lineHeight};
  padding: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.size) {
      case "small":
        return `${theme.spacing(1)} ${theme.spacing(2)}`;
      case "large":
        return `${theme.spacing(1.5)} ${theme.spacing(4)}`;
      default:
        return `${theme.spacing(1)} ${theme.spacing(3)}`;
    }
  }};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  transition: all 0.2s ease-in-out;
  opacity: ${(props) => (props.disabled || props.loading ? 0.6 : 1)};
  pointer-events: ${(props) => (props.disabled || props.loading ? "none" : "auto")};

  ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.variant) {
      case "secondary":
        return `
          background-color: ${theme.colors.secondary[500]};
          color: white;
          &:hover {
            background-color: ${theme.colors.secondary[600]};
          }
        `;
      case "outlined":
        return `
          background-color: transparent;
          color: ${theme.colors.primary[500]};
          border: 1px solid ${theme.colors.primary[500]};
          &:hover {
            background-color: ${theme.colors.primary[50]};
          }
        `;
      case "text":
        return `
          background-color: transparent;
          color: ${theme.colors.primary[500]};
          &:hover {
            background-color: ${theme.colors.primary[50]};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.primary[500]};
          color: white;
          &:hover {
            background-color: ${theme.colors.primary[600]};
          }
        `;
    }
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </StyledButton>
  );
};

Button.displayName = "Button";
