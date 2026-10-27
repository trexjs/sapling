import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  startIcon?: React.ReactNode;
}

const ButtonBase = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
          font-size: ${({ theme }) => theme.typography.fontSize.sm};
          min-height: 32px;
        `;
      case 'lg':
        return css`
          padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
          font-size: ${({ theme }) => theme.typography.fontSize.lg};
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
          font-size: ${({ theme }) => theme.typography.fontSize.base};
          min-height: 40px;
        `;
    }
  }}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrast};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary.dark};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary.main};
          border-color: ${theme.colors.primary.main};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary.main};
            color: ${theme.colors.primary.contrast};
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.text.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background.secondary};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error.main};
          color: ${theme.colors.error.contrast};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.error.dark};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary.dark};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: inherit;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  startIcon,
  ...props
}) => {
  return (
    <ButtonBase
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
      {startIcon && !loading && startIcon}
      {children}
    </ButtonBase>
  );
};
