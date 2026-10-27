import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium" | "large" | number;
  color?: "primary" | "secondary" | "inherit";
}

const getSize = (size: SpinnerProps["size"]): string => {
  if (typeof size === "number") return `${size}px`;
  
  const sizes = {
    small: "20px",
    medium: "40px",
    large: "60px",
  };
  
  return sizes[size || "medium"];
};

const StyledSpinner = styled.div<SpinnerProps>`
  display: inline-block;
  width: ${(props) => getSize(props.size)};
  height: ${(props) => getSize(props.size)};
  border: 3px solid ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.color === "inherit") return "currentColor";
    if (props.color === "secondary") return theme.colors.secondary[200];
    return theme.colors.primary[200];
  }};
  border-top-color: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.color === "inherit") return "currentColor";
    if (props.color === "secondary") return theme.colors.secondary[500];
    return theme.colors.primary[500];
  }};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "primary",
  ...props
}) => {
  return <StyledSpinner size={size} color={color} role="status" aria-label="Loading" {...props} />;
};

Spinner.displayName = "Spinner";
