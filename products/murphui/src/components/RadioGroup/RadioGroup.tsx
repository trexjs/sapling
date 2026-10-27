import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";
import { Radio, RadioProps } from "../Radio";

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  label?: string;
  error?: string;
  helperText?: string;
  direction?: "row" | "column";
}

const RadioGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

const Label = styled.label`
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.subtitle2.fontWeight};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  margin-bottom: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

const RadioContainer = styled.div<{ direction?: string }>`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  gap: ${(props) => (props.theme as XloxTheme).spacing(1.5)};
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: ${(props) => (props.theme as XloxTheme).typography.caption.fontSize};
  color: ${(props) =>
    props.isError
      ? (props.theme as XloxTheme).colors.error[500]
      : (props.theme as XloxTheme).colors.text.secondary};
  margin-top: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  error,
  helperText,
  direction = "column",
  ...props
}) => {
  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
  };

  return (
    <RadioGroupWrapper {...props}>
      {label && <Label>{label}</Label>}
      <RadioContainer direction={direction} role="radiogroup">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            disabled={option.disabled}
            error={!!error}
            onChange={() => handleChange(option.value)}
          />
        ))}
      </RadioContainer>
      {(error || helperText) && (
        <HelperText isError={!!error}>{error || helperText}</HelperText>
      )}
    </RadioGroupWrapper>
  );
};

RadioGroup.displayName = "RadioGroup";
