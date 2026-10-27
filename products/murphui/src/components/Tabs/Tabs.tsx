import React, { useState } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  children: React.ReactNode;
  variant?: "standard" | "fullWidth";
}

export interface TabProps {
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const TabsContainer = styled.div`
  width: 100%;
`;

const TabsList = styled.div<{ variant?: string }>`
  display: flex;
  border-bottom: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  position: relative;
  
  ${(props) => props.variant === "fullWidth" && `
    & > * {
      flex: 1;
    }
  `}
`;

const StyledTab = styled.button<{ active?: boolean; disabled?: boolean }>`
  background: none;
  border: none;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1.5)} ${(props.theme as XloxTheme).spacing(2)}`};
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => (props.theme as XloxTheme).typography.button.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.button.fontWeight};
  color: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.disabled) return theme.colors.text.disabled;
    if (props.active) return theme.colors.primary[500];
    return theme.colors.text.secondary;
  }};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  position: relative;
  transition: color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
  white-space: nowrap;
  
  &:hover {
    color: ${(props) => {
      if (props.disabled) return;
      return (props.theme as XloxTheme).colors.primary[600];
    }};
  }
  
  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${(props) => (props.theme as XloxTheme).colors.primary[500]};
    transform: scaleX(${(props) => (props.active ? 1 : 0)});
    transition: transform 0.2s ease-in-out;
  }
`;

const TabPanel = styled.div<{ active?: boolean }>`
  display: ${(props) => (props.active ? "block" : "none")};
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(3)} 0`};
`;

export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  onChange,
  children,
  variant = "standard",
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(0);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleChange = (newValue: number) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  const childrenArray = React.Children.toArray(children);
  
  return (
    <TabsContainer {...props}>
      <TabsList variant={variant}>
        {childrenArray.map((child, index) => {
          if (React.isValidElement<TabProps>(child)) {
            return (
              <StyledTab
                key={index}
                active={value === index}
                disabled={child.props.disabled}
                onClick={() => !child.props.disabled && handleChange(index)}
                role="tab"
                aria-selected={value === index}
              >
                {child.props.icon}
                {child.props.label}
              </StyledTab>
            );
          }
          return null;
        })}
      </TabsList>
      {childrenArray.map((child, index) => (
        <TabPanel key={index} active={value === index} role="tabpanel">
          {React.isValidElement(child) ? child.props.children : null}
        </TabPanel>
      ))}
    </TabsContainer>
  );
};

export const Tab: React.FC<TabProps & { children?: React.ReactNode }> = () => {
  return null;
};

Tabs.displayName = "Tabs";
Tab.displayName = "Tab";
