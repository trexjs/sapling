import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "fullWidth" | "inset" | "middle";
  textAlign?: "left" | "center" | "right";
  children?: React.ReactNode;
}

const StyledDivider = styled.div<DividerProps>`
  border: none;
  flex-shrink: 0;
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  
  ${(props) => {
    if (props.orientation === "vertical") {
      return `
        width: 1px;
        height: auto;
        align-self: stretch;
      `;
    }
    
    let marginLeft = "0";
    let marginRight = "0";
    
    if (props.variant === "inset") {
      marginLeft = (props.theme as XloxTheme).spacing(9);
    } else if (props.variant === "middle") {
      marginLeft = (props.theme as XloxTheme).spacing(2);
      marginRight = (props.theme as XloxTheme).spacing(2);
    }
    
    return `
      height: 1px;
      width: auto;
      margin-left: ${marginLeft};
      margin-right: ${marginRight};
    `;
  }}
`;

const DividerWithText = styled.div<{ textAlign?: "left" | "center" | "right" }>`
  display: flex;
  align-items: center;
  text-align: ${(props) => props.textAlign || "center"};
  white-space: nowrap;
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  }
  
  &::before {
    margin-right: ${(props) => (props.theme as XloxTheme).spacing(1)};
  }
  
  &::after {
    margin-left: ${(props) => (props.theme as XloxTheme).spacing(1)};
  }
  
  ${(props) => {
    if (props.textAlign === "left") {
      return `
        &::before {
          flex: 0 0 ${(props.theme as XloxTheme).spacing(2)};
        }
      `;
    }
    if (props.textAlign === "right") {
      return `
        &::after {
          flex: 0 0 ${(props.theme as XloxTheme).spacing(2)};
        }
      `;
    }
    return "";
  }}
`;

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  variant = "fullWidth",
  textAlign = "center",
  children,
  ...props
}) => {
  if (children && orientation === "horizontal") {
    return (
      <DividerWithText textAlign={textAlign} {...props}>
        {children}
      </DividerWithText>
    );
  }
  
  return (
    <StyledDivider
      orientation={orientation}
      variant={variant}
      role="separator"
      {...props}
    />
  );
};

Divider.displayName = "Divider";
