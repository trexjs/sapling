import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  minRows?: number;
  maxRows?: number;
}

const TextareaWrapper = styled.div<{ fullWidth?: boolean }>`
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

const StyledTextarea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1)} ${(props.theme as XloxTheme).spacing(1.5)}`};
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
  resize: vertical;
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

  &::placeholder {
    color: ${(props) => (props.theme as XloxTheme).colors.text.disabled};
  }
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: ${(props) => (props.theme as XloxTheme).typography.caption.fontSize};
  color: ${(props) =>
    props.isError
      ? (props.theme as XloxTheme).colors.error[500]
      : (props.theme as XloxTheme).colors.text.secondary};
  margin-top: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      minRows = 3,
      maxRows,
      rows,
      ...props
    },
    ref
  ) => {
    return (
      <TextareaWrapper fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <StyledTextarea
          ref={ref}
          hasError={!!error}
          rows={rows || minRows}
          {...props}
        />
        {(error || helperText) && (
          <HelperText isError={!!error}>{error || helperText}</HelperText>
        )}
      </TextareaWrapper>
    );
  }
);

Textarea.displayName = "Textarea";
