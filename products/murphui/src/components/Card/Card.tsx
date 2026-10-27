import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "outlined" | "elevated";
  padding?: number;
}

const StyledCard = styled.div<CardProps>`
  background-color: ${(props) => (props.theme as XloxTheme).colors.background.paper};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  padding: ${(props) =>
    props.padding !== undefined
      ? (props.theme as XloxTheme).spacing(props.padding)
      : (props.theme as XloxTheme).spacing(2)};
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.variant === "outlined") {
      return `
        border: 1px solid ${theme.colors.neutral[200]};
      `;
    }
    const elevation = props.elevation ?? 1;
    return `
      box-shadow: ${theme.shadows[elevation]};
    `;
  }}
`;

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 1,
  variant = "elevated",
  padding,
  ...props
}) => {
  return (
    <StyledCard elevation={elevation} variant={variant} padding={padding} {...props}>
      {children}
    </StyledCard>
  );
};

Card.displayName = "Card";
