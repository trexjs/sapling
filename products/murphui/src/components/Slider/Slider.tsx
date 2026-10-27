import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  marks?: Array<{ value: number; label?: string }>;
  className?: string;
}

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.subtitle2.fontWeight};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ValueDisplay = styled.span`
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
`;

const SliderTrack = styled.div<{ disabled?: boolean }>`
  position: relative;
  width: 100%;
  height: 4px;
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  border-radius: 2px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const SliderFill = styled.div<{ percentage: number }>`
  position: absolute;
  height: 100%;
  background-color: ${(props) => (props.theme as XloxTheme).colors.primary[500]};
  border-radius: 2px;
  width: ${(props) => props.percentage}%;
  transition: width 0.1s ease-out;
`;

const SliderThumb = styled.div<{ percentage: number; disabled?: boolean }>`
  position: absolute;
  top: 50%;
  left: ${(props) => props.percentage}%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: ${(props) => (props.theme as XloxTheme).colors.primary[500]};
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: ${(props) => (props.theme as XloxTheme).shadows[2]};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "grab")};
  transition: transform 0.1s ease-out;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
  
  &:active {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "grabbing")};
    transform: translate(-50%, -50%) scale(1.3);
  }
`;

const MarksContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const Mark = styled.div<{ percentage: number }>`
  position: absolute;
  left: ${(props) => props.percentage}%;
  transform: translateX(-50%);
  text-align: center;
  font-size: ${(props) => (props.theme as XloxTheme).typography.caption.fontSize};
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
`;

export const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  label,
  showValue = false,
  marks,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const updateValue = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    if (controlledValue === undefined) {
      setInternalValue(clampedValue);
    }
    onChange?.(clampedValue);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  
  return (
    <SliderWrapper {...props}>
      {(label || showValue) && (
        <Label>
          {label && <span>{label}</span>}
          {showValue && <ValueDisplay>{value}</ValueDisplay>}
        </Label>
      )}
      <SliderTrack
        ref={trackRef}
        disabled={disabled}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
      >
        <SliderFill percentage={percentage} />
        <SliderThumb percentage={percentage} disabled={disabled} />
      </SliderTrack>
      {marks && marks.length > 0 && (
        <MarksContainer>
          {marks.map((mark) => {
            const markPercentage = ((mark.value - min) / (max - min)) * 100;
            return (
              <Mark key={mark.value} percentage={markPercentage}>
                {mark.label || mark.value}
              </Mark>
            );
          })}
        </MarksContainer>
      )}
    </SliderWrapper>
  );
};

Slider.displayName = "Slider";
