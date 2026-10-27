import React from 'react';
import styled from 'styled-components';
import { DCSFlag } from '../types';
import { FlagCard } from './FlagCard';

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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

interface FlagListProps {
  flags: DCSFlag[];
  onEdit: (flag: DCSFlag) => void;
  onMap: (flag: DCSFlag) => void;
}

export const FlagList: React.FC<FlagListProps> = ({ flags, onEdit, onMap }) => {
  return (
    <Container>
      <Header>
        <Title>DCS Flags</Title>
        <Count>{flags.length} flags</Count>
      </Header>
      
      {flags.length === 0 ? (
        <EmptyState>
          <h3>No flags found</h3>
          <p>Create your first DCS flag to get started.</p>
        </EmptyState>
      ) : (
        <Grid>
          {flags.map((flag) => (
            <FlagCard
              key={flag._id}
              flag={flag}
              onEdit={() => onEdit(flag)}
              onMap={() => onMap(flag)}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
};
