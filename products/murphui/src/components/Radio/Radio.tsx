import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
}

const RadioWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledRadio = styled.div<{ checked?: boolean; error?: boolean; disabled?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.error) return theme.colors.error[500];
    if (props.checked) return theme.colors.primary[500];
    return theme.colors.neutral[400];
  }};
  background-color: transparent;
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
  
  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${(props) => (props.theme as XloxTheme).colors.primary[500]};
    transform: scale(${(props) => (props.checked ? 1 : 0)});
    transition: transform 0.2s ease-in-out;
  }
`;

const Label = styled.span<{ disabled?: boolean }>`
  font-size: ${(props) => (props.theme as XloxTheme).typography.body1.fontSize};
  color: ${(props) =>
    props.disabled
      ? (props.theme as XloxTheme).colors.text.disabled
      : (props.theme as XloxTheme).colors.text.primary};
`;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, checked, disabled, ...props }, ref) => {
    return (
      <RadioWrapper>
        <HiddenRadio
          type="radio"
          ref={ref}
          checked={checked}
          disabled={disabled}
          {...props}
        />
        <StyledRadio checked={checked} error={error} disabled={disabled} />
        {label && <Label disabled={disabled}>{label}</Label>}
      </RadioWrapper>
    );
  }
);

Radio.displayName = "Radio";
