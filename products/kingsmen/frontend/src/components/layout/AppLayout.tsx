import { Link, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

const Shell = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
`;

const Sidebar = styled.nav`
  background: #0f172a;
  color: #e2e8f0;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SidebarHeader = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? "#38bdf8" : "#cbd5f5")};
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "rgba(56, 189, 248, 0.12)" : "transparent")};
  &:hover {
    background: rgba(148, 163, 184, 0.12);
    color: #f8fafc;
  }
`;

const Content = styled.main`
  background: #f8fafc;
  padding: 32px;
`;

export const AppLayout = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <Shell>
      <Sidebar>
        <SidebarHeader>Kingsman Admin</SidebarHeader>
        <NavLink to="/" $active={activePath === "/"}>
          Dashboard
        </NavLink>
        <NavLink to="/realms" $active={activePath.startsWith("/realms") && !activePath.includes("/users")}>
          Realms
        </NavLink>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </Shell>
  );
};
