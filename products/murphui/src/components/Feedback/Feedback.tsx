import React, { useState } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface FeedbackProps {
  value?: "up" | "down" | null;
  defaultValue?: "up" | "down" | null;
  onChange?: (value: "up" | "down" | null) => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  showLabels?: boolean;
  upLabel?: string;
  downLabel?: string;
  allowDeselect?: boolean;
  className?: string;
}

const FeedbackContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const FeedbackButton = styled.button<{
  active?: boolean;
  disabled?: boolean;
  size?: string;
  variant?: "up" | "down";
}>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
  padding: ${(props) => {
    const theme = props.theme as XloxTheme;
    switch (props.size) {
      case "small":
        return `${theme.spacing(0.5)} ${theme.spacing(1)}`;
      case "large":
        return `${theme.spacing(1.5)} ${theme.spacing(2)}`;
      default:
        return `${theme.spacing(1)} ${theme.spacing(1.5)}`;
    }
  }};
  background-color: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.active) {
      if (props.variant === "up") {
        return theme.colors.success[50];
      }
      return theme.colors.error[50];
    }
    return "transparent";
  }};
  border: 1px solid ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.active) {
      if (props.variant === "up") {
        return theme.colors.success[500];
      }
      return theme.colors.error[500];
    }
    return theme.colors.neutral[300];
  }};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  color: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.active) {
      if (props.variant === "up") {
        return theme.colors.success[700];
      }
      return theme.colors.error[700];
    }
    return theme.colors.text.secondary;
  }};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all 0.2s ease-in-out;
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.75rem";
      case "large":
        return "1rem";
      default:
        return "0.875rem";
    }
  }};
  
  ${(props) => !props.disabled && `
    &:hover {
      background-color: ${
        props.active
          ? props.variant === "up"
            ? (props.theme as XloxTheme).colors.success[100]
            : (props.theme as XloxTheme).colors.error[100]
          : (props.theme as XloxTheme).colors.neutral[50]
      };
      border-color: ${
        props.variant === "up"
          ? (props.theme as XloxTheme).colors.success[500]
          : (props.theme as XloxTheme).colors.error[500]
      };
    }
  `}
  
  svg {
    width: ${(props) => {
      switch (props.size) {
        case "small":
          return "16px";
        case "large":
          return "24px";
        default:
          return "20px";
      }
    }};
    height: ${(props) => {
      switch (props.size) {
        case "small":
          return "16px";
        case "large":
          return "24px";
        default:
          return "20px";
      }
    }};
  }
`;

const ThumbsUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
  </svg>
);

const ThumbsDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
  </svg>
);

export const Feedback: React.FC<FeedbackProps> = ({
  value: controlledValue,
  defaultValue = null,
  onChange,
  disabled = false,
  size = "medium",
  showLabels = false,
  upLabel = "Helpful",
  downLabel = "Not helpful",
  allowDeselect = true,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<"up" | "down" | null>(defaultValue);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleClick = (newValue: "up" | "down") => {
    if (disabled) return;
    
    // If clicking the same button and deselect is allowed, clear the value
    const finalValue = allowDeselect && value === newValue ? null : newValue;
    
    if (controlledValue === undefined) {
      setInternalValue(finalValue);
    }
    onChange?.(finalValue);
  };
  
  return (
    <FeedbackContainer {...props}>
      <FeedbackButton
        active={value === "up"}
        disabled={disabled}
        size={size}
        variant="up"
        onClick={() => handleClick("up")}
        aria-label="Thumbs up"
        aria-pressed={value === "up"}
        type="button"
      >
        <ThumbsUpIcon />
        {showLabels && <span>{upLabel}</span>}
      </FeedbackButton>
      
      <FeedbackButton
        active={value === "down"}
        disabled={disabled}
        size={size}
        variant="down"
        onClick={() => handleClick("down")}
        aria-label="Thumbs down"
        aria-pressed={value === "down"}
        type="button"
      >
        <ThumbsDownIcon />
        {showLabels && <span>{downLabel}</span>}
      </FeedbackButton>
    </FeedbackContainer>
  );
};

Feedback.displayName = "Feedback";
