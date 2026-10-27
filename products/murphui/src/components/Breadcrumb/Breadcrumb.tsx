import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
`;

const BreadcrumbItem = styled.span<{ isLast?: boolean; clickable?: boolean }>`
  color: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.isLast) return theme.colors.text.primary;
    return theme.colors.text.secondary;
  }};
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: color 0.2s ease-in-out;
  
  ${(props) => props.clickable && !props.isLast && `
    &:hover {
      color: ${(props.theme as XloxTheme).colors.primary[500]};
      text-decoration: underline;
    }
  `}
  
  ${(props) => props.isLast && `
    font-weight: ${(props.theme as XloxTheme).typography.subtitle2.fontWeight};
  `}
`;

const Separator = styled.span`
  color: ${(props) => (props.theme as XloxTheme).colors.text.disabled};
  user-select: none;
`;

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = "/",
  ...props
}) => {
  const handleClick = (item: BreadcrumbItem, index: number) => {
    if (index === items.length - 1) return;
    
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.location.href = item.href;
    }
  };
  
  return (
    <BreadcrumbContainer aria-label="Breadcrumb" {...props}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const clickable = !isLast && (!!item.onClick || !!item.href);
        
        return (
          <React.Fragment key={index}>
            <BreadcrumbItem
              isLast={isLast}
              clickable={clickable}
              onClick={() => handleClick(item, index)}
              aria-current={isLast ? "page" : undefined}
            >
              {item.label}
            </BreadcrumbItem>
            {!isLast && <Separator aria-hidden="true">{separator}</Separator>}
          </React.Fragment>
        );
      })}
    </BreadcrumbContainer>
  );
};

Breadcrumb.displayName = "Breadcrumb";
