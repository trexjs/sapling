import React, { useState } from "react";
import styled from "styled-components";
import { DCSProvider, useDCS } from "./context/DCSContext";
import { FlagList } from "./components/FlagList";
import { FlagForm } from "./components/FlagForm";
import { AccountMappingModal } from "./components/AccountMappingModal";
import { StatusChecker } from "./components/StatusChecker";
import {
  DCSFlag,
  CreateOrUpdateFlagRequest,
  MapFlagToAccountRequest,
} from "./types";
import "./index.css";

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
  const { flags, loading, error, createOrUpdateFlag, mapFlagToAccount } =
    useDCS();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMappingOpen, setIsMappingOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<DCSFlag | undefined>(
    undefined
  );

  const handleCreateFlag = () => {
    setSelectedFlag(undefined);
    setIsFormOpen(true);
  };

  const handleEditFlag = (flag: DCSFlag) => {
    setSelectedFlag(flag);
    setIsFormOpen(true);
  };

  const handleMapFlag = (flag: DCSFlag) => {
    setSelectedFlag(flag);
    setIsMappingOpen(true);
  };

  const handleFormSubmit = async (flagData: CreateOrUpdateFlagRequest) => {
    await createOrUpdateFlag(flagData);
  };

  const handleMappingSubmit = async (mappingData: MapFlagToAccountRequest) => {
    await mapFlagToAccount(mappingData);
  };

  const handleCloseModals = () => {
    setIsFormOpen(false);
    setIsMappingOpen(false);
    setSelectedFlag(undefined);
  };

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Title>DCS Flag Manager</Title>
          <AddButton onClick={handleCreateFlag}>+ Create New Flag</AddButton>
        </HeaderContent>
      </Header>

      <Main>
        {error && (
          <ErrorBanner>
            <strong>Error:</strong> {error}
          </ErrorBanner>
        )}

        <StatusChecker />

        {loading ? (
          <LoadingSpinner>Loading flags...</LoadingSpinner>
        ) : (
          <FlagList
            flags={flags}
            onEdit={handleEditFlag}
            onMap={handleMapFlag}
          />
        )}

        <FlagForm
          flag={selectedFlag}
          isOpen={isFormOpen}
          onClose={handleCloseModals}
          onSubmit={handleFormSubmit}
        />

        {selectedFlag && (
          <AccountMappingModal
            flag={selectedFlag}
            isOpen={isMappingOpen}
            onClose={handleCloseModals}
            onSubmit={handleMappingSubmit}
          />
        )}
      </Main>
    </AppContainer>
  );
};

export const DCSApp: React.FC = () => {
  return (
    <DCSProvider>
      <App />
    </DCSProvider>
  );
};
