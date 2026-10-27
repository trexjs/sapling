import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Poll } from '../types';

const Container = styled.div`
  // max-width: 1200px;
  // margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CreateButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
`;

const PollsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const PollCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const PollHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const CreatorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const CreatorInfo = styled.div`
  flex: 1;
`;

const CreatorName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const PollDate = styled.div`
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

const PollQuestion = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const PollStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
`;

const VoteCount = styled.span`
  font-weight: 500;
`;

const TimeRemaining = styled.span`
  font-weight: 500;
`;

const PollOptions = styled.div`
  margin: 1rem 0;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const OptionText = styled.div`
  flex: 1;
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
`;

const OptionVotes = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 60px;
  text-align: right;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const PollsPage: React.FC = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'active' | 'expired'>('active');

  useEffect(() => {
    fetchPolls();
  }, [activeFilter]);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPolls({
        status: activeFilter,
        page: 1,
        limit: 20
      });
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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


  if (loading) {
    return (
      <Container>
        <LoadingState>Loading polls...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Polls</Title>
        <CreateButton onClick={() => navigate('/polls/create')}>
          Create Poll
        </CreateButton>
      </Header>

      <FilterContainer>
        <FilterButton
          active={activeFilter === 'active'}
          onClick={() => setActiveFilter('active')}
        >
          Active Polls
        </FilterButton>
        <FilterButton
          active={activeFilter === 'expired'}
          onClick={() => setActiveFilter('expired')}
        >
          Expired Polls
        </FilterButton>
      </FilterContainer>

      {polls.length === 0 ? (
        <EmptyState>
          No {activeFilter} polls found.
        </EmptyState>
      ) : (
        <PollsGrid>
          {polls.map((poll) => {
            const isExpired = poll.is_expired || false;
            const hasUserVoted = poll.user_has_voted || false;
            const voteStats = poll.vote_stats || {};

            return (
              <PollCard 
                key={poll._id}
                onClick={() => navigate(`/polls/${poll._id}`)}
              >
                <PollHeader>
                  <CreatorAvatar>
                    {getInitials(poll.creator_name)}
                  </CreatorAvatar>
                  <CreatorInfo>
                    <CreatorName>{poll.creator_name}</CreatorName>
                    <PollDate>{formatDate(poll.created_at)}</PollDate>
                  </CreatorInfo>
                  <StatusBadge expired={isExpired}>
                    {isExpired ? 'Expired' : 'Active'}
                  </StatusBadge>
                </PollHeader>

                <PollQuestion>{poll.question}</PollQuestion>

                <PollOptions>
                  {poll.options.map((option) => {
                    const optionVotes = voteStats[option._id]?.count || 0;
                    const optionPercentage = voteStats[option._id]?.percentage || 0;

                    return (
                      <OptionItem key={option._id}>
                        <OptionText>{option.text}</OptionText>
                        {hasUserVoted && (
                          <OptionVotes>
                            {optionVotes} votes ({optionPercentage}%)
                          </OptionVotes>
                        )}
                      </OptionItem>
                    );
                  })}
                </PollOptions>

                {hasUserVoted && (
                  <div style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    background: '#f0f9ff',
                    border: '1px solid #0ea5e9',
                    borderRadius: '0.375rem',
                    color: '#0c4a6e',
                    fontWeight: '500',
                    marginTop: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    ✓ You have voted on this poll
                  </div>
                )}

                <PollStats>
                  <VoteCount>{poll.total_votes} votes</VoteCount>
                  <TimeRemaining>
                    {formatTimeRemaining(poll.expires_at)}
                  </TimeRemaining>
                </PollStats>
              </PollCard>
            );
          })}
        </PollsGrid>
      )}
    </Container>
  );
};

export default PollsPage;
