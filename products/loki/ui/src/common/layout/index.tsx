import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

// 1. The Container uses Flexbox
const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

// 2. Give the Sidebar a fixed width and height
const SidebarStyled = styled.aside`
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  height: 100vh;
  position: sticky;
  top: 0;
`;

// 3. The Main Content should grow to fill the space
const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  padding: 10px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;

  &.active {
    background-color: #e3f2fd;
    color: #1976d2;
    font-weight: bold;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const Sidebar: React.FC = () => {
  return (
    <SidebarStyled>
      <h3 style={{ margin: "10px" }}>Platform</h3>
      <nav>
        <StyledNavLink to="/config">Config App</StyledNavLink>
        <StyledNavLink to="/dcs">DCS System</StyledNavLink>
        <StyledNavLink to="/cms">CMS Editor</StyledNavLink>
      </nav>
    </SidebarStyled>
  );
};

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AppContainer>
      <Sidebar />
      <MainContent>{children}</MainContent>
    </AppContainer>
  );
};
