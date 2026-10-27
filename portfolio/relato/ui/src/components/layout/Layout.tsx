import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  --sidebar-width: 280px;

  &.sidebar-collapsed {
    --sidebar-width: 80px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  width: 100%;
  min-height: 0; // Allow flex child to shrink
  background-color: #f9fafb;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MobileOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isOpen ? 'block' : 'none'};

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileSidebar = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 56px; /* Start below header */
  left: 0;
  bottom: 0;
  width: 280px;
  z-index: 1000;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease-in-out;
  background: #1e293b; /* Add background color */
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    width: 260px;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    };
  }, []);

  return (
    <LayoutContainer className={sidebarCollapsed ? 'sidebar-collapsed' : ''}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileOverlay isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobileSidebar isOpen={isMobileMenuOpen}>
        <Sidebar mobile />
      </MobileSidebar>

      <MainContent>
        <Header title={title} onMobileMenuToggle={toggleMobileMenu} />
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
