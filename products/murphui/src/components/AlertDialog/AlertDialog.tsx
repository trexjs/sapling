import React from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  severity?: "info" | "warning" | "error";
  className?: string;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1400;
  animation: fadeIn 0.2s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DialogContainer = styled.div`
  background-color: ${(props) => (props.theme as XloxTheme).colors.background.paper};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  box-shadow: ${(props) => (props.theme as XloxTheme).shadows[5]};
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.2s ease-in-out;
  
  @keyframes slideIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const DialogHeader = styled.div<{ severity?: string }>`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(3)}`};
  display: flex;
  align-items: flex-start;
  gap: ${(props) => (props.theme as XloxTheme).spacing(2)};
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.severity === "error") {
      return `border-left: 4px solid ${theme.colors.error[500]};`;
    }
    if (props.severity === "warning") {
      return `border-left: 4px solid ${theme.colors.warning[500]};`;
    }
    return "";
  }}
`;

const IconWrapper = styled.div<{ severity?: string }>`
  display: flex;
  align-items: center;
  color: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.severity) {
      case "error":
        return theme.colors.error[500];
      case "warning":
        return theme.colors.warning[500];
      default:
        return theme.colors.info[500];
    }
  }};
`;

const DialogContent = styled.div`
  flex: 1;
`;

const DialogTitle = styled.h2`
  margin: 0;
  font-size: ${(props) => (props.theme as XloxTheme).typography.h6.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.h6.fontWeight};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  margin-bottom: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const DialogDescription = styled.p`
  margin: 0;
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
  line-height: 1.5;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(2)} ${(props.theme as XloxTheme).spacing(3)} ${(props.theme as XloxTheme).spacing(3)}`};
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1)} ${(props.theme as XloxTheme).spacing(2)}`};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => (props.theme as XloxTheme).typography.button.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.button.fontWeight};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.variant === "primary") {
      return `
        background-color: ${theme.colors.primary[500]};
        color: white;
        &:hover {
          background-color: ${theme.colors.primary[600]};
        }
      `;
    }
    return `
      background-color: transparent;
      color: ${theme.colors.text.primary};
      border: 1px solid ${theme.colors.neutral[300]};
      &:hover {
        background-color: ${theme.colors.neutral[50]};
      }
    `;
  }}
`;

const getIcon = (severity?: string) => {
  if (severity === "error") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    );
  }
  if (severity === "warning") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  );
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  severity = "info",
  ...props
}) => {
  if (!open) return null;
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  return createPortal(
    <Backdrop onClick={onClose}>
      <DialogContainer onClick={(e) => e.stopPropagation()} role="alertdialog" {...props}>
        <DialogHeader severity={severity}>
          <IconWrapper severity={severity}>{getIcon(severity)}</IconWrapper>
          <DialogContent>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogContent>
        </DialogHeader>
        <DialogActions>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button variant="primary" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogActions>
      </DialogContainer>
    </Backdrop>,
    document.body
  );
};

AlertDialog.displayName = "AlertDialog";
