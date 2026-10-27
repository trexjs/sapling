import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  width?: string | number;
  position?: "left" | "right";
  collapsed?: boolean;
}

const StyledSidebar = styled.aside<SidebarProps>`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${(props) => (props.theme as XloxTheme).colors.background.paper};
  border-right: ${(props) => props.position === "left" ? `1px solid ${(props.theme as XloxTheme).colors.neutral[200]}` : "none"};
  border-left: ${(props) => props.position === "right" ? `1px solid ${(props.theme as XloxTheme).colors.neutral[200]}` : "none"};
  width: ${(props) => {
    if (props.collapsed) return "60px";
    if (typeof props.width === "number") return `${props.width}px`;
    return props.width || "250px";
  }};
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  position: sticky;
  top: 0;
  ${(props) => props.position === "right" && "order: 1;"}
`;

const SidebarHeader = styled.div`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(2)} ${(props.theme as XloxTheme).spacing(2)}`};
  border-bottom: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  font-weight: ${(props) => (props.theme as XloxTheme).typography.h6.fontWeight};
  font-size: ${(props) => (props.theme as XloxTheme).typography.h6.fontSize};
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1)} 0`};
`;

const SidebarFooter = styled.div`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(2)} ${(props.theme as XloxTheme).spacing(2)}`};
  border-top: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
`;

const SidebarItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1.5)};
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1.5)} ${(props.theme as XloxTheme).spacing(2)}`};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  white-space: nowrap;
  
  ${(props) => props.active && `
    background-color: ${(props.theme as XloxTheme).colors.primary[50]};
    color: ${(props.theme as XloxTheme).colors.primary[500]};
    border-right: 3px solid ${(props.theme as XloxTheme).colors.primary[500]};
  `}
  
  &:hover {
    background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[50]};
  }
`;

export const Sidebar: React.FC<SidebarProps> & {
  Header: typeof SidebarHeader;
  Content: typeof SidebarContent;
  Footer: typeof SidebarFooter;
  Item: typeof SidebarItem;
} = ({ children, width = "250px", position = "left", collapsed = false, ...props }) => {
  return (
    <StyledSidebar width={width} position={position} collapsed={collapsed} {...props}>
      {children}
    </StyledSidebar>
  );
};

Sidebar.Header = SidebarHeader;
Sidebar.Content = SidebarContent;
Sidebar.Footer = SidebarFooter;
Sidebar.Item = SidebarItem;

Sidebar.displayName = "Sidebar";
SidebarHeader.displayName = "Sidebar.Header";
SidebarContent.displayName = "Sidebar.Content";
SidebarFooter.displayName = "Sidebar.Footer";
SidebarItem.displayName = "Sidebar.Item";
