import React from 'react';
import styled from 'styled-components';
import { Config } from '../types';

const Card = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ConfigName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.125rem;
`;

const VersionBadge = styled.span`
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Details = styled.div`
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Label = styled.span`
  color: #666;
  font-weight: 500;
`;

const Value = styled.span`
  color: #333;
`;

const DataPreview = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  max-height: 120px;
  overflow-y: auto;
`;

const DataContent = styled.pre`
  margin: 0;
  font-size: 0.75rem;
  color: #495057;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
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

const CreatedDate = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.5rem;
`;

interface ConfigCardProps {
  config: Config;
  onEdit: () => void;
  onView: () => void;
}

export const ConfigCard: React.FC<ConfigCardProps> = ({ config, onEdit, onView }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDataPreview = () => {
    try {
      const dataStr = JSON.stringify(config.data, null, 2);
      return dataStr.length > 200 ? dataStr.substring(0, 200) + '...' : dataStr;
    } catch {
      return 'Invalid JSON data';
    }
  };

  return (
    <Card>
      <Header>
        <ConfigName>{config.name}</ConfigName>
        <VersionBadge>v{config.version}</VersionBadge>
      </Header>

      <Details>
        <DetailRow>
          <Label>Data Size:</Label>
          <Value>{JSON.stringify(config.data).length} characters</Value>
        </DetailRow>
        <DetailRow>
          <Label>Properties:</Label>
          <Value>{Object.keys(config.data).length} keys</Value>
        </DetailRow>
      </Details>

      <DataPreview>
        <DataContent>{getDataPreview()}</DataContent>
      </DataPreview>

      <Actions>
        <Button variant="primary" onClick={onView}>
          View
        </Button>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      </Actions>

      <CreatedDate>
        Created: {formatDate(config.createdAt)}
      </CreatedDate>
    </Card>
  );
};
