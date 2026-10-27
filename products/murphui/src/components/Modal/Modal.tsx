import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  disableBackdropClick?: boolean;
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
  z-index: 1300;
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

const ModalContainer = styled.div<{ maxWidth?: string }>`
  background-color: ${(props) => (props.theme as XloxTheme).colors.background.paper};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  box-shadow: ${(props) => (props.theme as XloxTheme).shadows[5]};
  max-width: ${(props) => {
    const widths = {
      xs: "444px",
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1536px",
    };
    return widths[props.maxWidth as keyof typeof widths] || "600px";
  }};
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.2s ease-in-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(2)} ${(props.theme as XloxTheme).spacing(3)}`};
  border-bottom: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${(props) => (props.theme as XloxTheme).typography.h6.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.h6.fontWeight};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[100]};
  }
`;

const ModalContent = styled.div`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(3)}`};
  overflow-y: auto;
  flex: 1;
`;

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  maxWidth = "sm",
  disableBackdropClick = false,
  ...props
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);
  
  if (!open) return null;
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !disableBackdropClick) {
      onClose();
    }
  };
  
  return createPortal(
    <Backdrop onClick={handleBackdropClick}>
      <ModalContainer maxWidth={maxWidth} role="dialog" aria-modal="true" {...props}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onClick={onClose} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </CloseButton>
          </ModalHeader>
        )}
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </Backdrop>,
    document.body
  );
};

Modal.displayName = "Modal";
