import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiFolder, 
  FiFile, 
  FiSearch, 
  FiShare2, 
  FiStar, 
  FiTrash2, 
  FiUser,
  FiX
} from 'react-icons/fi';

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 280px;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-right: 1px solid ${({ theme }) => theme.colors.border.light};
  transform: translateX(${({ isOpen }) => isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: ${({ theme }) => theme.zIndex.fixed};
  overflow-y: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: static;
    transform: translateX(0);
    flex-shrink: 0;
  }
`;

const SidebarOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: ${({ theme }) => theme.zIndex.modal};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const SidebarTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Navigation = styled.nav`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary.light + '20'};
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: ${({ theme }) => theme.colors.primary.main};
    }
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const NavText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: inherit;
`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigationItems = [
    {
      section: 'Main',
      items: [
        { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { to: '/files', icon: FiFile, label: 'Files' },
        { to: '/folders', icon: FiFolder, label: 'Folders' },
      ],
    },
    {
      section: 'Tools',
      items: [
        { to: '/search', icon: FiSearch, label: 'Search' },
        { to: '/shared', icon: FiShare2, label: 'Shared' },
        { to: '/starred', icon: FiStar, label: 'Starred' },
        { to: '/bin', icon: FiTrash2, label: 'Bin' },
      ],
    },
    {
      section: 'Account',
      items: [
        { to: '/profile', icon: FiUser, label: 'Profile' },
      ],
    },
  ];

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>Navigation</SidebarTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </SidebarHeader>

        <Navigation>
          {navigationItems.map((section) => (
            <NavSection key={section.section}>
              <SectionTitle>{section.section}</SectionTitle>
              {section.items.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                >
                  <NavIcon>
                    <item.icon size={20} />
                  </NavIcon>
                  <NavText>{item.label}</NavText>
                </NavItem>
              ))}
            </NavSection>
          ))}
        </Navigation>
      </SidebarContainer>
    </>
  );
};
