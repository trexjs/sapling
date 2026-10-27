import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface AvatarProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  size?: "small" | "medium" | "large" | number;
  variant?: "circular" | "rounded" | "square";
  className?: string;
}

const getSize = (size: AvatarProps["size"]): string => {
  if (typeof size === "number") return `${size}px`;
  
  const sizes = {
    small: "32px",
    medium: "40px",
    large: "56px",
  };
  
  return sizes[size || "medium"];
};

const getBorderRadius = (variant: AvatarProps["variant"], theme: XloxTheme): string => {
  switch (variant) {
    case "square":
      return "0";
    case "rounded":
      return `${theme.shape.borderRadius}px`;
    default:
      return "50%";
  }
};

const StyledAvatar = styled.div<AvatarProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${(props) => getSize(props.size)};
  height: ${(props) => getSize(props.size)};
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => {
    const size = getSize(props.size);
    const numSize = parseInt(size);
    return `${numSize * 0.5}px`;
  }};
  line-height: 1;
  border-radius: ${(props) => getBorderRadius(props.variant, props.theme as XloxTheme)};
  overflow: hidden;
  user-select: none;
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[300]};
  color: ${(props) => (props.theme as XloxTheme).colors.neutral[700]};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  text-align: center;
  color: transparent;
`;

const AvatarFallback = styled.div`
  width: 75%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  children,
  size = "medium",
  variant = "circular",
  ...props
}) => {
  const [imgError, setImgError] = React.useState(false);
  
  const handleImageError = () => {
    setImgError(true);
  };
  
  const renderContent = () => {
    if (src && !imgError) {
      return <AvatarImage src={src} alt={alt} onError={handleImageError} />;
    }
    
    if (children) {
      return children;
    }
    
    return (
      <AvatarFallback>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </AvatarFallback>
    );
  };
  
  return (
    <StyledAvatar size={size} variant={variant} {...props}>
      {renderContent()}
    </StyledAvatar>
  );
};

Avatar.displayName = "Avatar";
