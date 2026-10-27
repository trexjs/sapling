import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Poll } from '../../types';
import PollResults from './PollResults';
import { useApp } from '../../context/AppContext';

const PollContainer = styled.div`
  // max-width: 800px;
  // margin: 0 auto;
  padding: 2rem;
`;

const PollCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PollHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const CreatorInfo = styled.div`
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

const CreatorDetails = styled.div`
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

const PollQuestion = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const AnalyticsSection = styled.div`
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const AnalyticsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AnalyticsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ViewVotesButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
`;

const VoteStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const PollContent = styled.div`
  padding: 1.5rem;
`;

const OptionList = styled.div`
  margin-bottom: 1.5rem;
`;

const OptionItem = styled.div<{ selected?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  background: ${props => props.selected ? '#eff6ff' : 'white'};
  border-color: ${props => props.selected ? '#3b82f6' : '#e5e7eb'};
  
  &:hover {
    ${props => !props.disabled && `
      border-color: #3b82f6;
      background: #f8fafc;
    `}
  }
`;

const OptionRadio = styled.input`
  margin-right: 0.75rem;
`;

const OptionText = styled.div`
  flex: 1;
  font-weight: 500;
  color: #1f2937;
`;

const OptionPercentage = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  min-width: 60px;
  text-align: right;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  background: #3b82f6;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

const VoteButton = styled.button`
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ExpiredMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 1.125rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d1d5db;
  
  ${props => props.variant === 'danger' ? `
    background: #ef4444;
    color: white;
    border-color: #ef4444;
    
    &:hover {
      background: #dc2626;
    }
  ` : `
    background: white;
    color: #374151;
    
    &:hover {
      background: #f9fafb;
    }
  `}
`;

const PollView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useApp();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPoll();
    }
  }, [id]);

  const fetchPoll = async () => {
    try {
      const response = await apiService.getPollById(id!);
      setPoll(response.data);
      setSelectedOption(response.data.user_vote || '');
    } catch (error) {
      console.error('Error fetching poll:', error);
    } finally {
      setLoading(false);
    }
  };


  const toggleResults = () => {
    setShowResults(!showResults);
  };

  const handleVote = async () => {
    if (!selectedOption || !poll) return;

    setVoting(true);
    try {
      await apiService.votePoll(poll._id, selectedOption);
      await fetchPoll(); // Refresh poll data
      // Show results after voting
      setShowResults(true);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!poll || !window.confirm('Are you sure you want to delete this poll?')) return;

    try {
      await apiService.deletePoll(poll._id);
      navigate('/polls');
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
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

  const getCreatorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!poll) {
    return <div>Poll not found</div>;
  }

  const isExpired = poll.is_expired;
  const canVote = !isExpired && !poll.user_has_voted;
  const isCreator = user?.user_id === poll.creator_id;

  return (
    <PollContainer>
      <PollCard>
        <PollHeader>
          <CreatorInfo>
            <CreatorAvatar>
              {getCreatorInitials(poll.creator_name)}
            </CreatorAvatar>
            <CreatorDetails>
              <CreatorName>{poll.creator_name}</CreatorName>
              <PollDate>
                {new Date(poll.created_at).toLocaleDateString()}
              </PollDate>
            </CreatorDetails>
          </CreatorInfo>
          <PollQuestion>{poll.question}</PollQuestion>
        </PollHeader>

        <AnalyticsSection>
          <AnalyticsHeader>
            <AnalyticsTitle>Analytics</AnalyticsTitle>
            <VoteStats>
              Total votes: {poll.total_votes} - {formatTimeRemaining(poll.expires_at)}
            </VoteStats>
            <ViewVotesButton onClick={toggleResults}>
              {showResults ? 'Hide Results' : 'View Results'}
            </ViewVotesButton>
          </AnalyticsHeader>
        </AnalyticsSection>

        <PollContent>
          {isExpired ? (
            <ExpiredMessage>
              This poll has expired and is no longer accepting votes.
            </ExpiredMessage>
          ) : (
            <>
              <OptionList>
                {poll.options.map((option) => {
                  const voteStats = poll.vote_stats?.[option._id];
                  const percentage = voteStats?.percentage || 0;
                  const isSelected = selectedOption === option._id;

                  return (
                    <OptionItem
                      key={option._id}
                      selected={isSelected}
                      disabled={!canVote}
                      onClick={() => canVote && setSelectedOption(option._id)}
                    >
                      {canVote && (
                        <OptionRadio
                          type="radio"
                          name="poll-option"
                          checked={isSelected}
                          onChange={() => setSelectedOption(option._id)}
                        />
                      )}
                      <OptionText>{option.text}</OptionText>
                      {(poll.user_has_voted || showResults) && (
                        <OptionPercentage>{percentage}%</OptionPercentage>
                      )}
                    </OptionItem>
                  );
                })}
              </OptionList>

              {(poll.user_has_voted || showResults) && (
                <div>
                  {poll.options.map((option) => {
                    const voteStats = poll.vote_stats?.[option._id];
                    const percentage = voteStats?.percentage || 0;
                    return (
                      <div key={option._id} style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>{option.text}</span>
                          <span>{percentage}%</span>
                        </div>
                        <ProgressBar>
                          <ProgressFill width={percentage} />
                        </ProgressBar>
                      </div>
                    );
                  })}
                </div>
              )}

              {canVote && (
                <VoteButton
                  onClick={handleVote}
                  disabled={!selectedOption || voting}
                >
                  {voting ? 'Voting...' : 'Vote'}
                </VoteButton>
              )}

              {poll.user_has_voted && (
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '0.375rem',
                  color: '#0c4a6e',
                  fontWeight: '500',
                  marginTop: '1rem'
                }}>
                  ✓ You have voted on this poll
                </div>
              )}

              {isCreator && (
                <ActionButtons>
                  <ActionButton onClick={() => navigate(`/polls/${poll._id}/edit`)}>
                    Edit Poll
                  </ActionButton>
                  <ActionButton variant="danger" onClick={handleDelete}>
                    Delete
                  </ActionButton>
                </ActionButtons>
              )}
            </>
          )}
        </PollContent>
      </PollCard>

      {showResults && poll && (
        <div style={{ marginTop: '2rem' }}>
          <PollResults pollId={poll._id} poll={poll} />
        </div>
      )}
    </PollContainer>
  );
};

export default PollView;
