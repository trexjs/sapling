import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent, LayoutContainer, LayoutBody } from './Layout.styles';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <LayoutContainer>
      <Header onMenuClick={toggleSidebar} />
      <LayoutBody>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <MainContent>
          <Outlet />
        </MainContent>
      </LayoutBody>
    </LayoutContainer>
  );
};
