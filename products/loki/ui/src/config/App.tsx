import React, { useState } from "react";
import styled from "styled-components";
import { ConfigProvider, useConfig } from "./context/ConfigContext";
import { ConfigList } from "./components/ConfigList";
import { ConfigForm } from "./components/ConfigForm";
import { ConfigViewer } from "./components/ConfigViewer";
import { ConfigFetcher } from "./components/ConfigFetcher";
import { Config, CreateConfigRequest, UpdateConfigRequest } from "./types";

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
`;

const AddButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const Main = styled.main`
  padding: 2rem 0rem;
`;

const ErrorBanner = styled.div`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #666;
`;

const App: React.FC = () => {
  const { configs, loading, error, createConfig, updateConfig, clearError } =
    useConfig();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<Config | undefined>(
    undefined
  );

  const handleCreateConfig = () => {
    setSelectedConfig(undefined);
    setIsFormOpen(true);
  };

  const handleEditConfig = (config: Config) => {
    setSelectedConfig(config);
    setIsFormOpen(true);
  };

  const handleViewConfig = (config: Config) => {
    setSelectedConfig(config);
    setIsViewerOpen(true);
  };

  const handleFormSubmit = async (
    configData: CreateConfigRequest | UpdateConfigRequest
  ) => {
    if (selectedConfig) {
      // Update existing config
      await updateConfig(
        selectedConfig.name,
        configData as UpdateConfigRequest
      );
    } else {
      // Create new config
      await createConfig(configData as CreateConfigRequest);
    }
  };

  const handleCloseModals = () => {
    setIsFormOpen(false);
    setIsViewerOpen(false);
    setSelectedConfig(undefined);
  };

  const handleEditFromViewer = () => {
    setIsViewerOpen(false);
    setIsFormOpen(true);
  };

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Title>Configuration Manager</Title>
          <AddButton onClick={handleCreateConfig}>
            + Create New Config
          </AddButton>
        </HeaderContent>
      </Header>

      <Main>
        {error && (
          <ErrorBanner>
            <strong>Error:</strong> {error}
            <button
              onClick={clearError}
              style={{
                marginLeft: "1rem",
                background: "none",
                border: "none",
                color: "#721c24",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Dismiss
            </button>
          </ErrorBanner>
        )}

        <ConfigFetcher />

        {loading ? (
          <LoadingSpinner>Loading configurations...</LoadingSpinner>
        ) : (
          <ConfigList
            configs={configs}
            onEdit={handleEditConfig}
            onView={handleViewConfig}
          />
        )}

        <ConfigForm
          config={selectedConfig}
          isOpen={isFormOpen}
          onClose={handleCloseModals}
          onSubmit={handleFormSubmit}
        />

        {selectedConfig && (
          <ConfigViewer
            config={selectedConfig}
            isOpen={isViewerOpen}
            onClose={handleCloseModals}
            onEdit={handleEditFromViewer}
          />
        )}
      </Main>
    </AppContainer>
  );
};

export const ConfigApp: React.FC = () => {
  return (
    <ConfigProvider>
      <App />
    </ConfigProvider>
  );
};
