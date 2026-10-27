import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InputWrapper = styled.div<{ hasError?: boolean; hasStartIcon?: boolean; hasEndIcon?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  ${({ hasStartIcon }) =>
    hasStartIcon &&
    css`
      .input-field {
        padding-left: 2.5rem;
      }
    `}

  ${({ hasEndIcon }) =>
    hasEndIcon &&
    css`
      .input-field {
        padding-right: 2.5rem;
      }
    `}
`;

const InputField = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error.main : theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  background-color: ${({ theme }) => theme.colors.background.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error.main : theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? theme.colors.error.light + '20' : theme.colors.primary.light + '20'};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const IconWrapper = styled.div<{ position: 'start' | 'end' }>`
  position: absolute;
  ${({ position }) => position}: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error.main};
`;

const HelperText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth, startIcon, endIcon, className, ...props }, ref) => {
    return (
      <InputContainer fullWidth={fullWidth} className={className}>
        {label && <Label>{label}</Label>}
        <InputWrapper 
          hasError={!!error} 
          hasStartIcon={!!startIcon} 
          hasEndIcon={!!endIcon}
        >
          {startIcon && <IconWrapper position="start">{startIcon}</IconWrapper>}
          <InputField
            ref={ref}
            hasError={!!error}
            className="input-field"
            {...props}
          />
          {endIcon && <IconWrapper position="end">{endIcon}</IconWrapper>}
        </InputWrapper>
        {error && <ErrorText>{error}</ErrorText>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';
