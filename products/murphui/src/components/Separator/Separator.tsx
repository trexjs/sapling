import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const StyledSeparator = styled.div<SeparatorProps>`
  flex-shrink: 0;
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  
  ${(props) => {
    if (props.orientation === "vertical") {
      return `
        width: 1px;
        height: 100%;
        min-height: 20px;
      `;
    }
    return `
      height: 1px;
      width: 100%;
    `;
  }}
`;

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  decorative = false,
  ...props
}) => {
  return (
    <StyledSeparator
      orientation={orientation}
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      {...props}
    />
  );
};

Separator.displayName = "Separator";
