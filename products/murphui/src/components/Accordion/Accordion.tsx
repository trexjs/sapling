import React, { useState } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onChange'> {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
  disabled?: boolean;
}

const AccordionContainer = styled.div`
  border: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  overflow: hidden;
`;

const AccordionHeader = styled.button<{ expanded?: boolean; disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(2)} ${(props.theme as XloxTheme).spacing(2)}`};
  background-color: ${(props) => (props.theme as XloxTheme).colors.background.paper};
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body1.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.subtitle1.fontWeight};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  text-align: left;
  transition: background-color 0.2s ease-in-out;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  
  &:hover {
    background-color: ${(props) => {
      if (props.disabled) return;
      return (props.theme as XloxTheme).colors.neutral[50];
    }};
  }
`;

const AccordionIcon = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease-in-out;
  transform: rotate(${(props) => (props.expanded ? "180deg" : "0deg")});
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
`;

const AccordionContent = styled.div<{ expanded?: boolean }>`
  max-height: ${(props) => (props.expanded ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const AccordionBody = styled.div`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(2)}`};
  border-top: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
`;

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onChange,
  disabled = false,
  ...props
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  
  const handleToggle = () => {
    if (disabled) return;
    
    const newExpanded = !expanded;
    
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    
    onChange?.(newExpanded);
  };
  
  return (
    <AccordionContainer {...props}>
      <AccordionHeader
        expanded={expanded}
        disabled={disabled}
        onClick={handleToggle}
        aria-expanded={expanded}
        aria-disabled={disabled}
      >
        <span>{title}</span>
        <AccordionIcon expanded={expanded}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </AccordionIcon>
      </AccordionHeader>
      <AccordionContent expanded={expanded}>
        <AccordionBody>{children}</AccordionBody>
      </AccordionContent>
    </AccordionContainer>
  );
};

Accordion.displayName = "Accordion";
