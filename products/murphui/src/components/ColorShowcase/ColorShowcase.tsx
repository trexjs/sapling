import React from "react";
import styled from "@emotion/styled";
import { colors, type ColorName, type ColorShade } from "../../theme/colors";
import { XloxTheme } from "../../theme/types";

export interface ColorShowcaseProps {
  colorName?: ColorName;
  showAllColors?: boolean;
  className?: string;
}

const ShowcaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.theme as XloxTheme).spacing(3)};
  padding: ${(props) => (props.theme as XloxTheme).spacing(2)};
`;

const ColorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const ColorName = styled.h3`
  margin: 0;
  font-size: ${(props) => (props.theme as XloxTheme).typography.h6.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.h6.fontWeight};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  text-transform: capitalize;
`;

const ColorRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
`;

const ColorSwatch = styled.div<{ color: string; isLight: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => (props.theme as XloxTheme).spacing(2)};
  background-color: ${(props) => props.color};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  border: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  min-height: 80px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const SwatchLabel = styled.span<{ isLight: boolean }>`
  font-size: ${(props) => (props.theme as XloxTheme).typography.caption.fontSize};
  font-weight: 600;
  color: ${(props) => (props.isLight ? "#000" : "#fff")};
  margin-bottom: ${(props) => (props.theme as XloxTheme).spacing(0.5)};
`;

const SwatchValue = styled.span<{ isLight: boolean }>`
  font-size: ${(props) => (props.theme as XloxTheme).typography.caption.fontSize};
  font-family: monospace;
  color: ${(props) => (props.isLight ? "#000" : "#fff")};
  opacity: 0.8;
`;

// Helper to determine if color is light
const isLightColor = (hex: string): boolean => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 128;
};

// Copy to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const ColorShowcase: React.FC<ColorShowcaseProps> = ({
  colorName,
  showAllColors = false,
  ...props
}) => {
  const shades: ColorShade[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  
  const renderColorGroup = (name: ColorName) => {
    const colorGroup = colors[name];
    
    return (
      <ColorGroup key={name}>
        <ColorName>{name}</ColorName>
        <ColorRow>
          {shades.map((shade) => {
            const colorValue = colorGroup[shade];
            const isLight = isLightColor(colorValue);
            
            return (
              <ColorSwatch
                key={shade}
                color={colorValue}
                isLight={isLight}
                onClick={() => copyToClipboard(colorValue)}
                title={`Click to copy ${colorValue}`}
              >
                <SwatchLabel isLight={isLight}>{shade}</SwatchLabel>
                <SwatchValue isLight={isLight}>{colorValue}</SwatchValue>
              </ColorSwatch>
            );
          })}
        </ColorRow>
      </ColorGroup>
    );
  };
  
  return (
    <ShowcaseContainer {...props}>
      {showAllColors ? (
        Object.keys(colors).map((name) => renderColorGroup(name as ColorName))
      ) : colorName ? (
        renderColorGroup(colorName)
      ) : (
        <div>Please specify a colorName or set showAllColors to true</div>
      )}
    </ShowcaseContainer>
  );
};

ColorShowcase.displayName = "ColorShowcase";
