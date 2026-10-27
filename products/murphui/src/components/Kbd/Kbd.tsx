import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
}

const StyledKbd = styled.kbd<{ size?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.size) {
      case "small":
        return "0.75rem";
      case "large":
        return "1rem";
      default:
        return theme.typography.body2.fontSize;
    }
  }};
  font-weight: 600;
  line-height: 1;
  padding: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.size) {
      case "small":
        return `${theme.spacing(0.25)} ${theme.spacing(0.5)}`;
      case "large":
        return `${theme.spacing(0.75)} ${theme.spacing(1.5)}`;
      default:
        return `${theme.spacing(0.5)} ${theme.spacing(1)}`;
    }
  }};
  min-width: ${(props) => {
    switch (props.size) {
      case "small":
        return "20px";
      case "large":
        return "32px";
      default:
        return "24px";
    }
  }};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[100]};
  border: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[300]};
  border-bottom-width: 2px;
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  box-shadow: 0 1px 0 ${(props) => (props.theme as XloxTheme).colors.neutral[400]};
  white-space: nowrap;
`;

export const Kbd: React.FC<KbdProps> = ({ children, size = "medium", ...props }) => {
  return (
    <StyledKbd size={size} {...props}>
      {children}
    </StyledKbd>
  );
};

Kbd.displayName = "Kbd";
