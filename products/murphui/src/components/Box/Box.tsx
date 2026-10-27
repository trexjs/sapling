import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface BoxProps {
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  display?: "block" | "inline" | "inline-block" | "flex" | "inline-flex" | "grid" | "none";
  padding?: number | string;
  margin?: number | string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  borderRadius?: number | string;
  className?: string;
}

const StyledBox = styled.div<BoxProps>`
  display: ${(props) => props.display || "block"};
  padding: ${(props) =>
    typeof props.padding === "number"
      ? (props.theme as XloxTheme).spacing(props.padding)
      : props.padding};
  margin: ${(props) =>
    typeof props.margin === "number"
      ? (props.theme as XloxTheme).spacing(props.margin)
      : props.margin};
  width: ${(props) => (typeof props.width === "number" ? `${props.width}px` : props.width)};
  height: ${(props) => (typeof props.height === "number" ? `${props.height}px` : props.height)};
  background-color: ${(props) => props.backgroundColor};
  border-radius: ${(props) =>
    typeof props.borderRadius === "number"
      ? `${props.borderRadius}px`
      : props.borderRadius ||
        `${(props.theme as XloxTheme).shape.borderRadius}px`};
`;

export const Box: React.FC<BoxProps> = ({ as = "div", children, ...props }) => {
  return (
    <StyledBox as={as as any} {...props}>
      {children}
    </StyledBox>
  );
};

Box.displayName = "Box";
