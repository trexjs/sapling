import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';

const SidebarContainer = styled.aside<{ $collapsed: boolean; $mobile?: boolean }>`
  width: ${props => props.$collapsed ? '80px' : '280px'};
  ${props => !props.$mobile && `
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  `}
  color: white;
  height: 100vh;
  ${props => !props.$mobile && `
    position: fixed;
    left: 0;
    top: 0;
  `}
  overflow-y: auto;
  overflow-x: visible;
  z-index: 1000;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  @media (max-width: 768px) {
    ${props => !props.$mobile && 'display: none;'}
  }
`;

const SidebarHeader = styled.div<{ $collapsed: boolean }>`
  padding: ${props => props.$collapsed ? '1.5rem 0.5rem' : '2rem 1.5rem 1.5rem'};
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'space-between'};
  gap: 0.75rem;
`;

const Logo = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
  ${props => props.$collapsed && 'justify-content: center;'}
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
`;

const LogoText = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  opacity: ${props => props.$collapsed ? 0 : 1};
  transition: opacity 0.2s ease;
  white-space: nowrap;
  ${props => props.$collapsed && 'width: 0; overflow: hidden;'}
`;

const LogoTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
`;

const LogoSubtitle = styled.span`
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const ToggleButton = styled.button<{ $collapsed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
  }

  svg {
    width: 18px;
    height: 18px;
    transform: ${props => props.$collapsed ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.3s ease;
  }
`;

const SidebarContent = styled.nav`
  padding: 1.5rem 0 4rem;
`;

const NavSection = styled.div`
  margin-bottom: 1.25rem;
`;

const SectionTitle = styled.h3<{ $collapsed: boolean }>`
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 ${props => props.$collapsed ? '0.5rem' : '1.5rem'};
  margin-bottom: 0.75rem;
  opacity: ${props => props.$collapsed ? 0 : 1};
  transition: opacity 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-align: ${props => props.$collapsed ? 'center' : 'left'};
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li<{ $collapsed: boolean }>`
  margin: 0;
  padding: 0 ${props => props.$collapsed ? '0.5rem' : '1rem'};
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 1rem;
  background: #1e293b;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-right-color: #1e293b;
  }
`;

const NavLinkStyled = styled(NavLink)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem ${props => props.$collapsed ? '0.75rem' : '1rem'};
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  overflow: visible;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: #3b82f6;
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: white;
    transform: ${props => props.$collapsed ? 'none' : 'translateX(4px)'};
    
    svg {
      transform: scale(1.1);
    }

    ${Tooltip} {
      opacity: ${props => props.$collapsed ? 1 : 0};
    }
  }

  &.active {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    
    &::before {
      transform: scaleY(1);
    }
    
    svg {
      color: #3b82f6;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: ${props => props.$collapsed ? '0' : '0.875rem'};
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  span {
    opacity: ${props => props.$collapsed ? 0 : 1};
    width: ${props => props.$collapsed ? '0' : 'auto'};
    overflow: hidden;
    white-space: nowrap;
    transition: opacity 0.2s ease;
  }
`;

const UserSection = styled.div<{ $collapsed: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: ${props => props.$collapsed ? '80px' : '280px'};
  padding: 1.25rem ${props => props.$collapsed ? '0.5rem' : '1.25rem'};
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 1) 100%);
  backdrop-filter: blur(10px);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const UserInfo = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s ease;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const UserAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  margin-right: 0.875rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
`;

const UserDetails = styled.div<{ $collapsed: boolean }>`
  flex: 1;
  min-width: 0;
  opacity: ${props => props.$collapsed ? 0 : 1};
  width: ${props => props.$collapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: opacity 0.2s ease;
`;

const UserName = styled.div`
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: capitalize;
  margin-top: 2px;
`;

const LogoutButton = styled.button<{ $collapsed: boolean }>`
  width: 100%;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.$collapsed ? '0' : '0.5rem'};

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  span {
    opacity: ${props => props.$collapsed ? 0 : 1};
    width: ${props => props.$collapsed ? '0' : 'auto'};
    overflow: hidden;
    white-space: nowrap;
    transition: opacity 0.2s ease;
  }
`;

// Icons (using simple SVG icons)
const HomeIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const SchoolIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const TeacherIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const StudentIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
  </svg>
);

const AttendanceIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const SettingsIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const PollIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const FeedbackIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
  </svg>
);

const KudosIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const OnboardingIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
  </svg>
);

const ParentIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const LogoutIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414 5.414 6l3.293 3.293L13.586 6 15 7.414z" clipRule="evenodd" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const Sidebar: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.profile) return 'U';
    const { first_name, last_name } = user.profile;
    return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase();
  };

  const toggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    
    // Dispatch custom event to notify Layout about sidebar state change
    const event = new CustomEvent('sidebarToggle', {
      detail: { collapsed: newCollapsed }
    });
    window.dispatchEvent(event);
  };

  return (
    <SidebarContainer $collapsed={collapsed} $mobile={mobile}>
      <SidebarHeader $collapsed={collapsed}>
        <Logo $collapsed={collapsed}>
          <LogoIcon>SM</LogoIcon>
          <LogoText $collapsed={collapsed}>
            <LogoTitle>SchoolMS</LogoTitle>
            <LogoSubtitle>Management System</LogoSubtitle>
          </LogoText>
        </Logo>
        {!mobile && !collapsed && (
          <ToggleButton $collapsed={collapsed} onClick={toggleSidebar}>
            <ChevronLeftIcon />
          </ToggleButton>
        )}
      </SidebarHeader>

      {collapsed && (
        <div style={{ padding: '1rem 0.5rem', display: 'flex', justifyContent: 'center' }}>
          <ToggleButton $collapsed={collapsed} onClick={toggleSidebar}>
            <ChevronLeftIcon />
          </ToggleButton>
        </div>
      )}

      <SidebarContent>
        <NavSection>
          <SectionTitle $collapsed={collapsed}>Main</SectionTitle>
          <NavList>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/dashboard" $collapsed={collapsed}>
                <HomeIcon />
                <span>Dashboard</span>
                {collapsed && <Tooltip>Dashboard</Tooltip>}
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </NavSection>

        <NavSection>
          <SectionTitle $collapsed={collapsed}>Management</SectionTitle>
          <NavList>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/schools" $collapsed={collapsed}>
                <SchoolIcon />
                <span>Schools</span>
                {collapsed && <Tooltip>Schools</Tooltip>}
              </NavLinkStyled>
            </NavItem>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/teachers" $collapsed={collapsed}>
                <TeacherIcon />
                <span>Teachers</span>
                {collapsed && <Tooltip>Teachers</Tooltip>}
              </NavLinkStyled>
            </NavItem>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/students" $collapsed={collapsed}>
                <StudentIcon />
                <span>Students</span>
                {collapsed && <Tooltip>Students</Tooltip>}
              </NavLinkStyled>
            </NavItem>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/attendance" $collapsed={collapsed}>
                <AttendanceIcon />
                <span>Attendance</span>
                {collapsed && <Tooltip>Attendance</Tooltip>}
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </NavSection>

        <NavSection>
          <SectionTitle $collapsed={collapsed}>Parents</SectionTitle>
          <NavList>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/parents" $collapsed={collapsed}>
                <ParentIcon />
                <span>All Parents</span>
                {collapsed && <Tooltip>All Parents</Tooltip>}
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </NavSection>

        <NavSection>
          <SectionTitle $collapsed={collapsed}>Engagement</SectionTitle>
          <NavList>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/polls" $collapsed={collapsed}>
                <PollIcon />
                <span>Polls</span>
                {collapsed && <Tooltip>Polls</Tooltip>}
              </NavLinkStyled>
            </NavItem>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/feedback" $collapsed={collapsed}>
                <FeedbackIcon />
                <span>Feedback</span>
                {collapsed && <Tooltip>Feedback</Tooltip>}
              </NavLinkStyled>
            </NavItem>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/kudos" $collapsed={collapsed}>
                <KudosIcon />
                <span>Kudos</span>
                {collapsed && <Tooltip>Kudos</Tooltip>}
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </NavSection>

        <NavSection>
          <SectionTitle $collapsed={collapsed}>System</SectionTitle>
          <NavList>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/onboarding" $collapsed={collapsed}>
                <OnboardingIcon />
                <span>Onboarding</span>
                {collapsed && <Tooltip>Onboarding</Tooltip>}
              </NavLinkStyled>
            </NavItem>
            <NavItem $collapsed={collapsed}>
              <NavLinkStyled to="/settings" $collapsed={collapsed}>
                <SettingsIcon />
                <span>Settings</span>
                {collapsed && <Tooltip>Settings</Tooltip>}
              </NavLinkStyled>
            </NavItem>
          </NavList>
        </NavSection>
      </SidebarContent>

      <UserSection $collapsed={collapsed}>
        <UserInfo $collapsed={collapsed}>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserDetails $collapsed={collapsed}>
            <UserName>
              {user?.profile?.first_name} {user?.profile?.last_name}
            </UserName>
            <UserRole>{user?.user_type}</UserRole>
          </UserDetails>
        </UserInfo>
        <LogoutButton onClick={handleLogout} $collapsed={collapsed}>
          <LogoutIcon />
          <span>Logout</span>
        </LogoutButton>
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar;
