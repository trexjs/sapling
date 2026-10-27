import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: "determinate" | "indeterminate";
  color?: "primary" | "secondary" | "success" | "error";
  size?: "small" | "medium" | "large";
}

const getHeight = (size: ProgressProps["size"]): string => {
  const sizes = {
    small: "4px",
    medium: "6px",
    large: "8px",
  };
  return sizes[size || "medium"];
};

const ProgressContainer = styled.div<{ size?: string }>`
  width: 100%;
  height: ${(props) => getHeight(props.size as ProgressProps["size"])};
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled.div<{ value?: number; variant?: string; color?: string }>`
  height: 100%;
  background-color: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.color) {
      case "secondary":
        return theme.colors.secondary[500];
      case "success":
        return theme.colors.success[500];
      case "error":
        return theme.colors.error[500];
      default:
        return theme.colors.primary[500];
    }
  }};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  transition: width 0.3s ease-in-out;
  
  ${(props) => {
    if (props.variant === "indeterminate") {
      return `
        width: 30%;
        animation: indeterminate 1.5s ease-in-out infinite;
        
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(350%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `;
    }
    return `width: ${props.value || 0}%;`;
  }}
`;

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  variant = "determinate",
  color = "primary",
  size = "medium",
  ...props
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  return (
    <ProgressContainer size={size} role="progressbar" aria-valuenow={normalizedValue} {...props}>
      <ProgressBar value={normalizedValue} variant={variant} color={color} />
    </ProgressContainer>
  );
};

Progress.displayName = "Progress";
