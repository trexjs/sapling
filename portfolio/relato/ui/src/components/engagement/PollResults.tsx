import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../../services/api';
import { PollAnalytics } from '../../types';

const ResultsContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ResultsHeader = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
`;

const ResultsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
`;

const ResultsContent = styled.div`
  padding: 1.5rem;
`;

const OptionResults = styled.div`
  margin-bottom: 1.5rem;
`;

const OptionResult = styled.div`
  margin-bottom: 1rem;
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const OptionText = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const OptionStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number; color?: string }>`
  height: 100%;
  background: ${props => props.color || '#3b82f6'};
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

const VoteDetails = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const VoteDetailsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const VoteList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const VoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const VoterInfo = styled.div`
  font-size: 0.875rem;
  color: #374151;
`;

const VoteTime = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
`;

const TimeInfo = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatusBadge = styled.span<{ expired: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.expired ? '#fef3c7' : '#dcfce7'};
  color: ${props => props.expired ? '#92400e' : '#166534'};
`;

interface PollResultsProps {
  pollId: string;
  poll: any;
}

const PollResults: React.FC<PollResultsProps> = ({ pollId, poll }) => {
  const [analytics, setAnalytics] = useState<PollAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [pollId]);

  const fetchAnalytics = async () => {
    try {
      const response = await apiService.getPollAnalytics(pollId);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load poll results');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h left`;
    } else {
      return `${hours}h left`;
    }
  };

  const getProgressColor = (index: number) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <ResultsContainer>
        <LoadingState>Loading results...</LoadingState>
      </ResultsContainer>
    );
  }

  if (error) {
    return (
      <ResultsContainer>
        <ErrorState>{error}</ErrorState>
      </ResultsContainer>
    );
  }

  if (!analytics) {
    return (
      <ResultsContainer>
        <ErrorState>No analytics data available</ErrorState>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultsTitle>Poll Results & Analytics</ResultsTitle>
        
        <StatsGrid>
          <StatCard>
            <StatLabel>Total Votes</StatLabel>
            <StatValue>{analytics.total_votes}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatLabel>Status</StatLabel>
            <StatValue>
              <StatusBadge expired={analytics.is_expired}>
                {analytics.is_expired ? 'Expired' : 'Active'}
              </StatusBadge>
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatLabel>Created</StatLabel>
            <StatValue style={{ fontSize: '0.875rem' }}>
              {formatDate(analytics.created_at)}
            </StatValue>
          </StatCard>
          
          <StatCard>
            <StatLabel>Expires</StatLabel>
            <StatValue style={{ fontSize: '0.875rem' }}>
              {formatDate(analytics.expires_at)}
            </StatValue>
          </StatCard>
        </StatsGrid>

        <TimeInfo>
          <span>Time Remaining: {formatTimeRemaining(analytics.expires_at)}</span>
        </TimeInfo>
      </ResultsHeader>

      <ResultsContent>
        <OptionResults>
          {poll.options.map((option: any, index: number) => {
            const voteStats = analytics.vote_stats[option._id];
            const percentage = voteStats?.percentage || 0;
            const count = voteStats?.count || 0;
            
            return (
              <OptionResult key={option._id}>
                <OptionHeader>
                  <OptionText>{option.text}</OptionText>
                  <OptionStats>
                    <span>{count} votes</span>
                    <span>{percentage}%</span>
                  </OptionStats>
                </OptionHeader>
                <ProgressBar>
                  <ProgressFill 
                    width={percentage} 
                    color={getProgressColor(index)}
                  />
                </ProgressBar>
              </OptionResult>
            );
          })}
        </OptionResults>

        {poll.votes && poll.votes.length > 0 && (
          <VoteDetails>
            <VoteDetailsTitle>Vote Details</VoteDetailsTitle>
            <VoteList>
              {poll.votes.map((vote: any, index: number) => {
                const option = poll.options.find((opt: any) => opt._id === vote.option_id);
                return (
                  <VoteItem key={index}>
                    <VoterInfo>
                      User {vote.user_id.slice(-4)} voted for "{option?.text || 'Unknown'}"
                    </VoterInfo>
                    <VoteTime>
                      {formatDate(vote.voted_at)}
                    </VoteTime>
                  </VoteItem>
                );
              })}
            </VoteList>
          </VoteDetails>
        )}
      </ResultsContent>
    </ResultsContainer>
  );
};

export default PollResults;
