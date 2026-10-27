import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  severity?: "success" | "info" | "warning" | "error";
  variant?: "filled" | "outlined" | "standard";
  onClose?: () => void;
}

const StyledAlert = styled.div<{ severity: string; variant: string }>`
  display: flex;
  align-items: center;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1)} ${(props.theme as XloxTheme).spacing(2)}`};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    const colorMap = {
      success: theme.colors.success,
      info: theme.colors.info,
      warning: theme.colors.warning,
      error: theme.colors.error,
    };
    
    const color = colorMap[props.severity as keyof typeof colorMap];
    
    if (props.variant === "filled") {
      return `
        background-color: ${color[500]};
        color: white;
      `;
    }
    
    if (props.variant === "outlined") {
      return `
        background-color: transparent;
        color: ${color[700]};
        border: 1px solid ${color[500]};
      `;
    }
    
    return `
      background-color: ${color[50]};
      color: ${color[700]};
    `;
  }}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const Content = styled.div`
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const getIcon = (severity: string) => {
  switch (severity) {
    case "success":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"/>
        </svg>
      );
    case "warning":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M1 17h18L10 1 1 17zm10-2H9v-2h2v2zm0-4H9V7h2v4z"/>
        </svg>
      );
    case "error":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
        </svg>
      );
  }
};

export const Alert: React.FC<AlertProps> = ({
  children,
  severity = "info",
  variant = "standard",
  onClose,
  ...props
}) => {
  return (
    <StyledAlert severity={severity} variant={variant} role="alert" {...props}>
      <IconWrapper>{getIcon(severity)}</IconWrapper>
      <Content>{children}</Content>
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 6.59L13.3 1.3a1 1 0 111.4 1.42L9.42 8l5.3 5.3a1 1 0 01-1.42 1.4L8 9.42l-5.3 5.3a1 1 0 01-1.4-1.42L6.58 8l-5.3-5.3A1 1 0 012.7 1.3L8 6.59z"/>
          </svg>
        </CloseButton>
      )}
    </StyledAlert>
  );
};

Alert.displayName = "Alert";
