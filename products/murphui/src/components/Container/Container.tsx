import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  disableGutters?: boolean;
}

const getMaxWidth = (maxWidth: ContainerProps["maxWidth"], theme: XloxTheme): string => {
  if (maxWidth === false) return "100%";
  
  const widths = {
    xs: "444px",
    sm: `${theme.breakpoints.values.sm}px`,
    md: `${theme.breakpoints.values.md}px`,
    lg: `${theme.breakpoints.values.lg}px`,
    xl: `${theme.breakpoints.values.xl}px`,
  };
  
  return widths[maxWidth || "lg"];
};

const StyledContainer = styled.div<ContainerProps>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: ${(props) => getMaxWidth(props.maxWidth, props.theme as XloxTheme)};
  padding-left: ${(props) =>
    props.disableGutters ? 0 : (props.theme as XloxTheme).spacing(2)};
  padding-right: ${(props) =>
    props.disableGutters ? 0 : (props.theme as XloxTheme).spacing(2)};

  ${(props) => (props.theme as XloxTheme).breakpoints.up("sm")} {
    padding-left: ${(props) =>
      props.disableGutters ? 0 : (props.theme as XloxTheme).spacing(3)};
    padding-right: ${(props) =>
      props.disableGutters ? 0 : (props.theme as XloxTheme).spacing(3)};
  }
`;

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = "lg",
  disableGutters = false,
  ...props
}) => {
  return (
    <StyledContainer maxWidth={maxWidth} disableGutters={disableGutters} {...props}>
      {children}
    </StyledContainer>
  );
};

Container.displayName = "Container";
