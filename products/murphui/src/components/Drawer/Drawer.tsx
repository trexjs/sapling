import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchor?: "left" | "right" | "top" | "bottom";
  width?: string | number;
}

const Backdrop = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1200;
  opacity: ${(props) => (props.open ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const DrawerContainer = styled.div<{ anchor: string; width: string | number; open: boolean }>`
  position: fixed;
  z-index: 1300;
  background-color: ${(props) => (props.theme as XloxTheme).colors.background.paper};
  box-shadow: ${(props) => (props.theme as XloxTheme).shadows[4]};
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
  
  ${(props) => {
    const width = typeof props.width === "number" ? `${props.width}px` : props.width;
    
    switch (props.anchor) {
      case "left":
        return `
          top: 0;
          left: 0;
          bottom: 0;
          width: ${width};
          transform: translateX(${props.open ? "0" : "-100%"});
        `;
      case "right":
        return `
          top: 0;
          right: 0;
          bottom: 0;
          width: ${width};
          transform: translateX(${props.open ? "0" : "100%"});
        `;
      case "top":
        return `
          top: 0;
          left: 0;
          right: 0;
          height: ${width};
          transform: translateY(${props.open ? "0" : "-100%"});
        `;
      case "bottom":
        return `
          bottom: 0;
          left: 0;
          right: 0;
          height: ${width};
          transform: translateY(${props.open ? "0" : "100%"});
        `;
      default:
        return "";
    }
  }}
`;

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  anchor = "left",
  width = "300px",
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
  
  return createPortal(
    <>
      <Backdrop open={open} onClick={onClose} />
      <DrawerContainer anchor={anchor} width={width} open={open} role="dialog" {...props}>
        {children}
      </DrawerContainer>
    </>,
    document.body
  );
};

Drawer.displayName = "Drawer";
