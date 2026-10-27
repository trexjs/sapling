import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  size?: "small" | "medium";
}

const SwitchWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const Track = styled.div<{ checked?: boolean; disabled?: boolean; size?: "small" | "medium" }>`
  position: relative;
  width: ${(props) => (props.size === "small" ? "34px" : "44px")};
  height: ${(props) => (props.size === "small" ? "20px" : "24px")};
  border-radius: ${(props) => (props.size === "small" ? "10px" : "12px")};
  background-color: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.disabled) return theme.colors.neutral[200];
    return props.checked ? theme.colors.primary[500] : theme.colors.neutral[300];
  }};
  transition: background-color 0.2s ease-in-out;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  
  &:hover {
    background-color: ${(props) => {
      if (props.disabled) return;
      const theme = props.theme as XloxTheme;
      return props.checked ? theme.colors.primary[600] : theme.colors.neutral[400];
    }};
  }
`;

const Thumb = styled.div<{ checked?: boolean; size?: "small" | "medium" }>`
  position: absolute;
  top: ${(props) => (props.size === "small" ? "2px" : "2px")};
  left: ${(props) => {
    if (props.checked) {
      return props.size === "small" ? "16px" : "22px";
    }
    return "2px";
  }};
  width: ${(props) => (props.size === "small" ? "16px" : "20px")};
  height: ${(props) => (props.size === "small" ? "16px" : "20px")};
  border-radius: 50%;
  background-color: white;
  box-shadow: ${(props) => (props.theme as XloxTheme).shadows[2]};
  transition: left 0.2s ease-in-out;
`;

const Label = styled.span<{ disabled?: boolean }>`
  font-size: ${(props) => (props.theme as XloxTheme).typography.body1.fontSize};
  color: ${(props) =>
    props.disabled
      ? (props.theme as XloxTheme).colors.text.disabled
      : (props.theme as XloxTheme).colors.text.primary};
`;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, size = "medium", checked, disabled, ...props }, ref) => {
    return (
      <SwitchWrapper>
        <HiddenInput
          type="checkbox"
          role="switch"
          ref={ref}
          checked={checked}
          disabled={disabled}
          {...props}
        />
        <Track checked={checked} disabled={disabled} size={size}>
          <Thumb checked={checked} size={size} />
        </Track>
        {label && <Label disabled={disabled}>{label}</Label>}
      </SwitchWrapper>
    );
  }
);

Switch.displayName = "Switch";
