import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  position?: "fixed" | "sticky" | "static";
  elevation?: 0 | 1 | 2 | 3 | 4;
  color?: "default" | "primary" | "transparent";
}

const StyledNavbar = styled.nav<NavbarProps>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(2)} ${(props.theme as XloxTheme).spacing(3)}`};
  position: ${(props) => props.position || "static"};
  top: ${(props) => (props.position === "fixed" || props.position === "sticky" ? 0 : "auto")};
  left: 0;
  right: 0;
  z-index: 1100;
  transition: all 0.3s ease-in-out;
  
  ${(props) => {
    const theme = props.theme as XloxTheme;
    const elevation = props.elevation ?? 2;
    
    switch (props.color) {
      case "primary":
        return `
          background-color: ${theme.colors.primary[500]};
          color: white;
          box-shadow: ${theme.shadows[elevation]};
        `;
      case "transparent":
        return `
          background-color: transparent;
          color: ${theme.colors.text.primary};
        `;
      default:
        return `
          background-color: ${theme.colors.background.paper};
          color: ${theme.colors.text.primary};
          box-shadow: ${theme.shadows[elevation]};
        `;
    }
  }}
`;

const NavbarBrand = styled.div`
  display: flex;
  align-items: center;
  font-size: ${(props) => (props.theme as XloxTheme).typography.h6.fontSize};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.h6.fontWeight};
  margin-right: ${(props) => (props.theme as XloxTheme).spacing(3)};
`;

const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: ${(props) => (props.theme as XloxTheme).spacing(2)};
`;

const NavbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1)};
  margin-left: auto;
`;

export const Navbar: React.FC<NavbarProps> & {
  Brand: typeof NavbarBrand;
  Content: typeof NavbarContent;
  Actions: typeof NavbarActions;
} = ({ children, position = "static", elevation = 2, color = "default", ...props }) => {
  return (
    <StyledNavbar position={position} elevation={elevation} color={color} {...props}>
      {children}
    </StyledNavbar>
  );
};

Navbar.Brand = NavbarBrand;
Navbar.Content = NavbarContent;
Navbar.Actions = NavbarActions;

Navbar.displayName = "Navbar";
NavbarBrand.displayName = "Navbar.Brand";
NavbarContent.displayName = "Navbar.Content";
NavbarActions.displayName = "Navbar.Actions";
