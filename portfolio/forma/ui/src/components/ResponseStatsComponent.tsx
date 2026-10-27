import React from 'react';
import styled from 'styled-components';
import { FiBarChart, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { ResponseStats } from '../types';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StatIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.color};
  color: white;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

interface ResponseStatsComponentProps {
  stats: ResponseStats | null;
}

const ResponseStatsComponent: React.FC<ResponseStatsComponentProps> = ({ stats }) => {
  if (!stats) {
    return (
      <StatsContainer>
        <Title>Response Statistics</Title>
        <div>Loading stats...</div>
      </StatsContainer>
    );
  }

  return (
    <StatsContainer>
      <Title>Response Statistics</Title>
      
      <StatCard>
        <StatIcon color="#007bff">
          <FiBarChart />
        </StatIcon>
        <StatInfo>
          <StatValue>{stats.totalResponses}</StatValue>
          <StatLabel>Total Responses</StatLabel>
        </StatInfo>
      </StatCard>

      <StatCard>
        <StatIcon color="#28a745">
          <FiUsers />
        </StatIcon>
        <StatInfo>
          <StatValue>{stats.uniqueResponses}</StatValue>
          <StatLabel>Unique Responses</StatLabel>
        </StatInfo>
      </StatCard>

      {stats.totalResponses > 0 && (
        <StatCard>
          <StatIcon color="#ffc107">
            <FiTrendingUp />
          </StatIcon>
          <StatInfo>
            <StatValue>
              {Math.round((stats.uniqueResponses / stats.totalResponses) * 100)}%
            </StatValue>
            <StatLabel>Completion Rate</StatLabel>
          </StatInfo>
        </StatCard>
      )}
    </StatsContainer>
  );
};

export default ResponseStatsComponent;
