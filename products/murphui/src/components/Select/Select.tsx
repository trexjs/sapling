import React, { useState, useRef, useEffect, forwardRef } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

const SelectWrapper = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  gap: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

const Label = styled.label`
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.subtitle2.fontWeight};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  margin-bottom: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

const SelectContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1)} ${(props.theme as XloxTheme).spacing(1.5)}`};
  padding-right: ${(props) => (props.theme as XloxTheme).spacing(4)};
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body1.fontSize};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  background-color: ${(props) => (props.theme as XloxTheme).colors.background.paper};
  border: 1px solid ${(props) =>
    props.hasError
      ? (props.theme as XloxTheme).colors.error[500]
      : (props.theme as XloxTheme).colors.neutral[300]};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  outline: none;
  cursor: pointer;
  appearance: none;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${(props) =>
      props.hasError
        ? (props.theme as XloxTheme).colors.error[500]
        : (props.theme as XloxTheme).colors.primary[500]};
  }

  &:disabled {
    background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[100]};
    color: ${(props) => (props.theme as XloxTheme).colors.text.disabled};
    cursor: not-allowed;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  right: ${(props) => (props.theme as XloxTheme).spacing(1.5)};
  pointer-events: none;
  display: flex;
  align-items: center;
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: ${(props) => (props.theme as XloxTheme).typography.caption.fontSize};
  color: ${(props) =>
    props.isError
      ? (props.theme as XloxTheme).colors.error[500]
      : (props.theme as XloxTheme).colors.text.secondary};
  margin-top: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <SelectWrapper fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <SelectContainer>
          <StyledSelect ref={ref} hasError={!!error} {...props}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </StyledSelect>
          <SelectIcon>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </SelectIcon>
        </SelectContainer>
        {(error || helperText) && (
          <HelperText isError={!!error}>{error || helperText}</HelperText>
        )}
      </SelectWrapper>
    );
  }
);

Select.displayName = "Select";
