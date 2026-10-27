import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface TooltipProps {
  children: React.ReactElement;
  title: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  arrow?: boolean;
  open?: boolean;
  className?: string;
}

const TooltipContent = styled.div<{ placement: string }>`
  position: absolute;
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[800]};
  color: white;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(0.5)} ${(props.theme as XloxTheme).spacing(1)}`};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  font-size: ${(props) => (props.theme as XloxTheme).typography.caption.fontSize};
  max-width: 300px;
  word-wrap: break-word;
  z-index: 1500;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  
  &.visible {
    opacity: 1;
  }
`;

const Arrow = styled.div<{ placement: string }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[800]};
  transform: rotate(45deg);
  
  ${(props) => {
    switch (props.placement) {
      case "top":
        return `
          bottom: -4px;
          left: 50%;
          margin-left: -4px;
        `;
      case "bottom":
        return `
          top: -4px;
          left: 50%;
          margin-left: -4px;
        `;
      case "left":
        return `
          right: -4px;
          top: 50%;
          margin-top: -4px;
        `;
      case "right":
        return `
          left: -4px;
          top: 50%;
          margin-top: -4px;
        `;
      default:
        return "";
    }
  }}
`;

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  placement = "top",
  arrow = false,
  open: controlledOpen,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;
    
    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = 8;
    
    let top = 0;
    let left = 0;
    
    switch (placement) {
      case "top":
        top = childRect.top - tooltipRect.height - offset;
        left = childRect.left + (childRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = childRect.bottom + offset;
        left = childRect.left + (childRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = childRect.top + (childRect.height - tooltipRect.height) / 2;
        left = childRect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = childRect.top + (childRect.height - tooltipRect.height) / 2;
        left = childRect.right + offset;
        break;
    }
    
    setPosition({ top, left });
  };
  
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
      
      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);
  
  const handleMouseEnter = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    }
  };
  
  const childWithRef = React.cloneElement(children, {
    ref: childRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  });
  
  return (
    <>
      {childWithRef}
      {isOpen && title && createPortal(
        <TooltipContent
          ref={tooltipRef}
          placement={placement}
          className={isOpen ? "visible" : ""}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          role="tooltip"
          {...props}
        >
          {title}
          {arrow && <Arrow placement={placement} />}
        </TooltipContent>,
        document.body
      )}
    </>
  );
};

Tooltip.displayName = "Tooltip";
