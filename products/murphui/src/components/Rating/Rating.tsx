import React, { useState } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  precision?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "warning";
  showValue?: boolean;
  className?: string;
}

const RatingContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

const StarsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(0.25)};
`;

const StarButton = styled.button<{ 
  disabled?: boolean; 
  readOnly?: boolean;
  size?: string;
}>`
  background: none;
  border: none;
  padding: 0;
  cursor: ${(props) => {
    if (props.disabled) return "not-allowed";
    if (props.readOnly) return "default";
    return "pointer";
  }};
  display: inline-flex;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: transform 0.2s ease-in-out;
  
  ${(props) => !props.disabled && !props.readOnly && `
    &:hover {
      transform: scale(1.1);
    }
  `}
  
  svg {
    width: ${(props) => {
      switch (props.size) {
        case "small":
          return "20px";
        case "large":
          return "32px";
        default:
          return "24px";
      }
    }};
    height: ${(props) => {
      switch (props.size) {
        case "small":
          return "20px";
        case "large":
          return "32px";
        default:
          return "24px";
      }
    }};
  }
`;

const Star = styled.svg<{ filled: number; color?: string }>`
  fill: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.filled === 0) {
      return theme.colors.neutral[300];
    }
    
    const colorMap = {
      primary: theme.colors.primary[500],
      secondary: theme.colors.secondary[500],
      warning: theme.colors.warning[500],
    };
    
    return colorMap[props.color as keyof typeof colorMap] || theme.colors.warning[500];
  }};
  transition: fill 0.2s ease-in-out;
`;

const ValueDisplay = styled.span`
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
  margin-left: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

const StarIcon: React.FC<{ filled: number; color?: string }> = ({ filled, color }) => {
  if (filled === 0) {
    // Empty star
    return (
      <Star filled={0} color={color} viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" opacity="0.3" />
        <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
      </Star>
    );
  } else if (filled === 1) {
    // Full star
    return (
      <Star filled={1} color={color} viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </Star>
    );
  } else {
    // Half star
    return (
      <Star filled={0.5} color={color} viewBox="0 0 24 24">
        <defs>
          <linearGradient id={`half-${filled}`}>
            <stop offset="50%" stopOpacity="1" />
            <stop offset="50%" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path 
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill={`url(#half-${filled})`}
        />
      </Star>
    );
  }
};

export const Rating: React.FC<RatingProps> = ({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  precision = 1,
  onChange,
  readOnly = false,
  disabled = false,
  size = "medium",
  color = "warning",
  showValue = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : value;
  
  const handleClick = (newValue: number) => {
    if (disabled || readOnly) return;
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  const handleMouseEnter = (starValue: number) => {
    if (disabled || readOnly) return;
    setHoverValue(starValue);
  };
  
  const handleMouseLeave = () => {
    setHoverValue(null);
  };
  
  const getStarFill = (starIndex: number): number => {
    const starValue = starIndex + 1;
    
    if (displayValue >= starValue) {
      return 1; // Full star
    } else if (displayValue > starIndex && displayValue < starValue) {
      // Partial star
      const partial = displayValue - starIndex;
      if (precision === 0.5 && partial >= 0.5) {
        return 0.5;
      }
      return partial;
    }
    return 0; // Empty star
  };
  
  return (
    <RatingContainer {...props}>
      <StarsContainer onMouseLeave={handleMouseLeave}>
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const filled = getStarFill(index);
          
          return (
            <StarButton
              key={index}
              disabled={disabled}
              readOnly={readOnly}
              size={size}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              aria-label={`Rate ${starValue} out of ${max}`}
              type="button"
            >
              <StarIcon filled={filled} color={color} />
            </StarButton>
          );
        })}
      </StarsContainer>
      {showValue && (
        <ValueDisplay>
          {displayValue.toFixed(precision === 0.5 ? 1 : 0)} / {max}
        </ValueDisplay>
      )}
    </RatingContainer>
  );
};

Rating.displayName = "Rating";
