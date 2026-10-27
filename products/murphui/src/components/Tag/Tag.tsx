import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  color?: "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info";
  variant?: "filled" | "outlined" | "subtle";
  size?: "small" | "medium" | "large";
  onRemove?: () => void;
}

const StyledTag = styled.span<TagProps>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.75rem";
      case "large":
        return "0.875rem";
      default:
        return "0.8125rem";
    }
  }};
  font-weight: 500;
  padding: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.size) {
      case "small":
        return `${theme.spacing(0.25)} ${theme.spacing(0.75)}`;
      case "large":
        return `${theme.spacing(0.75)} ${theme.spacing(1.5)}`;
      default:
        return `${theme.spacing(0.5)} ${theme.spacing(1)}`;
    }
  }};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  white-space: nowrap;
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    const colorMap = {
      default: theme.colors.neutral,
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
      info: theme.colors.info,
    };
    
    const colors = colorMap[props.color || "default"];
    
    if (props.variant === "outlined") {
      return `
        background-color: transparent;
        color: ${colors[700]};
        border: 1px solid ${colors[500]};
      `;
    }
    
    if (props.variant === "subtle") {
      return `
        background-color: ${colors[50]};
        color: ${colors[700]};
        border: none;
      `;
    }
    
    return `
      background-color: ${colors[500]};
      color: white;
      border: none;
    `;
  }}
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

export const Tag: React.FC<TagProps> = ({
  children,
  color = "default",
  variant = "filled",
  size = "medium",
  onRemove,
  ...props
}) => {
  return (
    <StyledTag color={color} variant={variant} size={size} {...props}>
      {children}
      {onRemove && (
        <RemoveButton onClick={onRemove} aria-label="Remove tag">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 5.59L11.3 1.3a1 1 0 111.4 1.42L8.42 7l4.3 4.3a1 1 0 01-1.42 1.4L7 8.42l-4.3 4.3a1 1 0 01-1.4-1.42L5.58 7l-4.3-4.3A1 1 0 012.7 1.3L7 5.59z"/>
          </svg>
        </RemoveButton>
      )}
    </StyledTag>
  );
};

Tag.displayName = "Tag";
