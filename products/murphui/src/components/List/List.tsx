import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  dense?: boolean;
  disablePadding?: boolean;
}

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  children: React.ReactNode;
  button?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const StyledList = styled.ul<{ disablePadding?: boolean }>`
  list-style: none;
  margin: 0;
  padding: ${(props) => (props.disablePadding ? 0 : `${(props.theme as XloxTheme).spacing(1)} 0`)};
`;

const StyledListItem = styled.li<{ button?: boolean; selected?: boolean; disabled?: boolean; dense?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.dense) {
      return `${theme.spacing(0.5)} ${theme.spacing(2)}`;
    }
    return `${theme.spacing(1)} ${theme.spacing(2)}`;
  }};
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body1.fontSize};
  color: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.disabled) return theme.colors.text.disabled;
    return theme.colors.text.primary;
  }};
  background-color: ${(props) => {
    const theme = props.theme as XloxTheme;
    if (props.selected) return theme.colors.primary[50];
    return "transparent";
  }};
  cursor: ${(props) => {
    if (props.disabled) return "not-allowed";
    if (props.button) return "pointer";
    return "default";
  }};
  transition: background-color 0.2s ease-in-out;
  
  ${(props) => props.button && !props.disabled && `
    &:hover {
      background-color: ${(props.theme as XloxTheme).colors.neutral[50]};
    }
  `}
`;

export const List: React.FC<ListProps> = ({
  children,
  dense = false,
  disablePadding = false,
  ...props
}) => {
  return (
    <StyledList disablePadding={disablePadding} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { dense } as any);
        }
        return child;
      })}
    </StyledList>
  );
};

export const ListItem: React.FC<ListItemProps> = ({
  children,
  button = false,
  selected = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };
  
  return (
    <StyledListItem
      button={button}
      selected={selected}
      disabled={disabled}
      onClick={handleClick}
      role={button ? "button" : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </StyledListItem>
  );
};

List.displayName = "List";
ListItem.displayName = "ListItem";
