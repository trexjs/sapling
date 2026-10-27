import React from 'react';
import styled from 'styled-components';
import { Config } from '../types';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ConfigInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 600;
`;

const DataSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.125rem;
`;

const JsonViewer = styled.pre`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  margin: 0;
  font-size: 0.875rem;
  color: #495057;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  ` : `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  `}
`;

const CopyButton = styled.button`
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 1rem;
  
  &:hover {
    background: #218838;
  }
`;

interface ConfigViewerProps {
  config: Config;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const ConfigViewer: React.FC<ConfigViewerProps> = ({ config, isOpen, onClose, onEdit }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(config.data, null, 2));
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getDataSize = () => {
    const jsonString = JSON.stringify(config.data);
    const bytes = new Blob([jsonString]).size;
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Configuration: {config.name}</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <ConfigInfo>
          <InfoItem>
            <InfoLabel>Version</InfoLabel>
            <InfoValue>v{config.version}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Data Size</InfoLabel>
            <InfoValue>{getDataSize()}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Properties</InfoLabel>
            <InfoValue>{Object.keys(config.data).length} keys</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Created</InfoLabel>
            <InfoValue>{formatDate(config.createdAt)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Last Updated</InfoLabel>
            <InfoValue>{formatDate(config.updatedAt)}</InfoValue>
          </InfoItem>
        </ConfigInfo>

        <DataSection>
          <SectionTitle>Configuration Data</SectionTitle>
          <CopyButton onClick={copyToClipboard}>
            📋 Copy JSON
          </CopyButton>
          <JsonViewer>
            {JSON.stringify(config.data, null, 2)}
          </JsonViewer>
        </DataSection>

        <Actions>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onEdit}>
            Edit Configuration
          </Button>
        </Actions>
      </ModalContent>
    </Modal>
  );
};
