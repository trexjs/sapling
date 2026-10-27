import React from 'react';
import styled from 'styled-components';
import { Config } from '../types';
import { ConfigCard } from './ConfigCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #333;
  margin: 0;
`;

const Count = styled.span`
  background: #007bff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
`;

interface ConfigListProps {
  configs: Config[];
  onEdit: (config: Config) => void;
  onView: (config: Config) => void;
}

export const ConfigList: React.FC<ConfigListProps> = ({ configs, onEdit, onView }) => {
  return (
    <Container>
      <Header>
        <Title>Configuration Buckets</Title>
        <Count>{configs.length} configs</Count>
      </Header>
      
      {configs.length === 0 ? (
        <EmptyState>
          <h3>No configurations found</h3>
          <p>Create your first configuration bucket to get started.</p>
        </EmptyState>
      ) : (
        <Grid>
          {configs.map((config) => (
            <ConfigCard
              key={config._id}
              config={config}
              onEdit={() => onEdit(config)}
              onView={() => onView(config)}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
};
