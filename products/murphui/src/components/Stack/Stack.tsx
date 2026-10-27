import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  spacing?: number;
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
}

const StyledStack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  flex-wrap: ${(props) => props.flexWrap};
  gap: ${(props) =>
    props.spacing !== undefined
      ? (props.theme as XloxTheme).spacing(props.spacing)
      : 0};
`;

export const Stack: React.FC<StackProps> = ({
  children,
  direction = "column",
  spacing = 0,
  alignItems,
  justifyContent,
  flexWrap = "nowrap",
  ...props
}) => {
  return (
    <StyledStack
      direction={direction}
      spacing={spacing}
      alignItems={alignItems}
      justifyContent={justifyContent}
      flexWrap={flexWrap}
      {...props}
    >
      {children}
    </StyledStack>
  );
};

Stack.displayName = "Stack";
