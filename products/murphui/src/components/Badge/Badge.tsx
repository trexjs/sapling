import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface BadgeProps {
  children: React.ReactNode;
  badgeContent?: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  variant?: "standard" | "dot";
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  };
  invisible?: boolean;
  max?: number;
  className?: string;
}

const BadgeContainer = styled.div`
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  flex-shrink: 0;
`;

const StyledBadge = styled.span<{
  color?: string;
  variant?: string;
  anchorOrigin?: { vertical: string; horizontal: string };
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  box-sizing: border-box;
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.button.fontWeight};
  font-size: 0.75rem;
  min-width: ${(props) => (props.variant === "dot" ? "8px" : "20px")};
  height: ${(props) => (props.variant === "dot" ? "8px" : "20px")};
  padding: ${(props) => (props.variant === "dot" ? "0" : "0 6px")};
  border-radius: ${(props) => (props.variant === "dot" ? "4px" : "10px")};
  z-index: 1;
  transition: transform 0.2s ease-in-out;
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    const colorMap = {
      primary: theme.colors.primary[500],
      secondary: theme.colors.secondary[500],
      success: theme.colors.success[500],
      error: theme.colors.error[500],
      warning: theme.colors.warning[500],
      info: theme.colors.info[500],
    };
    
    const bgColor = colorMap[props.color as keyof typeof colorMap] || theme.colors.primary[500];
    
    return `
      background-color: ${bgColor};
      color: white;
    `;
  }}
  
  ${(props) => {
    const { vertical = "top", horizontal = "right" } = props.anchorOrigin || {};
    const offset = props.variant === "dot" ? "14%" : "0";
    
    if (vertical === "top" && horizontal === "right") {
      return `
        top: ${offset};
        right: ${offset};
        transform: scale(1) translate(50%, -50%);
        transform-origin: 100% 0%;
      `;
    }
    if (vertical === "top" && horizontal === "left") {
      return `
        top: ${offset};
        left: ${offset};
        transform: scale(1) translate(-50%, -50%);
        transform-origin: 0% 0%;
      `;
    }
    if (vertical === "bottom" && horizontal === "right") {
      return `
        bottom: ${offset};
        right: ${offset};
        transform: scale(1) translate(50%, 50%);
        transform-origin: 100% 100%;
      `;
    }
    return `
      bottom: ${offset};
      left: ${offset};
      transform: scale(1) translate(-50%, 50%);
      transform-origin: 0% 100%;
    `;
  }}
`;

export const Badge: React.FC<BadgeProps> = ({
  children,
  badgeContent,
  color = "primary",
  variant = "standard",
  anchorOrigin = { vertical: "top", horizontal: "right" },
  invisible = false,
  max = 99,
  ...props
}) => {
  const displayContent = () => {
    if (variant === "dot") return null;
    if (typeof badgeContent === "number" && badgeContent > max) {
      return `${max}+`;
    }
    return badgeContent;
  };
  
  const showBadge = !invisible && (badgeContent !== undefined || variant === "dot");
  
  return (
    <BadgeContainer {...props}>
      {children}
      {showBadge && (
        <StyledBadge color={color} variant={variant} anchorOrigin={anchorOrigin}>
          {displayContent()}
        </StyledBadge>
      )}
    </BadgeContainer>
  );
};

Badge.displayName = "Badge";
