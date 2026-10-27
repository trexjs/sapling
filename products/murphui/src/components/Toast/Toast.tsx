import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface ToastMessage {
  id: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastMessage["type"], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastContainer = styled.div`
  position: fixed;
  top: ${(props) => (props.theme as XloxTheme).spacing(2)};
  right: ${(props) => (props.theme as XloxTheme).spacing(2)};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
  pointer-events: none;
`;

const ToastItem = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1.5)};
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1.5)} ${(props.theme as XloxTheme).spacing(2)}`};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  box-shadow: ${(props) => (props.theme as XloxTheme).shadows[3]};
  min-width: 300px;
  max-width: 500px;
  pointer-events: auto;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    const colorMap = {
      success: { bg: theme.colors.success[500], text: "white" },
      error: { bg: theme.colors.error[500], text: "white" },
      warning: { bg: theme.colors.warning[500], text: "white" },
      info: { bg: theme.colors.info[500], text: "white" },
    };
    
    const colors = colorMap[props.type as keyof typeof colorMap] || colorMap.info;
    
    return `
      background-color: ${colors.bg};
      color: ${colors.text};
    `;
  }}
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
  display: flex;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const showToast = useCallback((message: string, type: ToastMessage["type"] = "info", duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastMessage = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <ToastContainer>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} type={toast.type || "info"}>
              <ToastMessage>{toast.message}</ToastMessage>
              <CloseButton onClick={() => removeToast(toast.id)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 6.59L13.3 1.3a1 1 0 111.4 1.42L9.42 8l5.3 5.3a1 1 0 01-1.42 1.4L8 9.42l-5.3 5.3a1 1 0 01-1.4-1.42L6.58 8l-5.3-5.3A1 1 0 012.7 1.3L8 6.59z"/>
                </svg>
              </CloseButton>
            </ToastItem>
          ))}
        </ToastContainer>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
