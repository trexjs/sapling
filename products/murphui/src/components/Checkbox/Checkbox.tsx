import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
  indeterminate?: boolean;
}

const CheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.div<{ checked?: boolean; error?: boolean; disabled?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.error) return theme.colors.error[500];
    if (props.checked) return theme.colors.primary[500];
    return theme.colors.neutral[400];
  }};
  background-color: ${(props) =>
    props.checked
      ? (props.theme as XloxTheme).colors.primary[500]
      : "transparent"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  
  &:hover {
    border-color: ${(props) => {
      if (props.disabled) return;
      const theme = props.theme as XloxTheme;
      if (props.error) return theme.colors.error[600];
      return theme.colors.primary[600];
    }};
  }
  
  svg {
    width: 14px;
    height: 14px;
    stroke: white;
    stroke-width: 3;
    fill: none;
    opacity: ${(props) => (props.checked ? 1 : 0)};
    transition: opacity 0.2s ease-in-out;
  }
`;

const Label = styled.span<{ disabled?: boolean }>`
  font-size: ${(props) => (props.theme as XloxTheme).typography.body1.fontSize};
  color: ${(props) =>
    props.disabled
      ? (props.theme as XloxTheme).colors.text.disabled
      : (props.theme as XloxTheme).colors.text.primary};
`;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate, checked, disabled, ...props }, ref) => {
    return (
      <CheckboxWrapper>
        <HiddenCheckbox
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          {...props}
        />
        <StyledCheckbox checked={checked} error={error} disabled={disabled}>
          {indeterminate ? (
            <svg viewBox="0 0 24 24">
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </StyledCheckbox>
        {label && <Label disabled={disabled}>{label}</Label>}
      </CheckboxWrapper>
    );
  }
);

Checkbox.displayName = "Checkbox";
