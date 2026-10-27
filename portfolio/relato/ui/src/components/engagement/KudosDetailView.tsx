import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
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
  ` : props.variant === 'secondary' ? `
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    
    &:hover {
      background: #2563eb;
    }
  ` : `
    background: white;
    color: #374151;
    
    &:hover {
      background: #f9fafb;
    }
  `}
`;

const KudosCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const KudosHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
`;

const KudosMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const FeaturedBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
`;

const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ValueTag = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
`;

const KudosMessage = styled.div`
  color: #374151;
  line-height: 1.6;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
`;

const ReactionsSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const ReactionsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const ReactionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ReactionButton = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.selected ? '#3b82f6' : '#d1d5db'};
  border-radius: 0.375rem;
  background: ${props => props.selected ? '#eff6ff' : 'white'};
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: ${props => props.selected ? '#eff6ff' : '#f9fafb'};
  }
`;

const ReactionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ReactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #374151;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #ef4444;
`;

const KudosDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [kudos, setKudos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reacting, setReacting] = useState(false);

  const reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'celebrate', emoji: '🎉', label: 'Celebrate' },
    { type: 'rocket', emoji: '🚀', label: 'Rocket' },
    { type: 'thumbs_up', emoji: '👍', label: 'Thumbs Up' },
    { type: 'clap', emoji: '👏', label: 'Clap' },
    { type: 'fire', emoji: '🔥', label: 'Fire' },
    { type: 'star', emoji: '⭐', label: 'Star' }
  ];

  useEffect(() => {
    if (id) {
      fetchKudos();
    }
  }, [id]);

  const fetchKudos = async () => {
    setLoading(true);
    try {
      const response = await apiService.getKudosById(id!);
      setKudos(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch kudos');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType: string) => {
    if (!kudos || reacting) return;

    setReacting(true);
    try {
      // Check if user already reacted with this type
      const userReaction = kudos.reactions?.find((r: any) => r.reaction_type === reactionType);
      
      if (userReaction) {
        await apiService.removeReaction(kudos._id);
      } else {
        await apiService.addReaction(kudos._id, reactionType);
      }
      
      await fetchKudos(); // Refresh the kudos data
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setReacting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/kudos/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!kudos || !window.confirm('Are you sure you want to delete this kudos?')) return;

    try {
      await apiService.deleteKudos(kudos._id);
      navigate('/kudos');
    } catch (error) {
      console.error('Error deleting kudos:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReactionEmoji = (type: string) => {
    const reactions: { [key: string]: string } = {
      like: '👍',
      love: '❤️',
      celebrate: '🎉',
      rocket: '🚀',
      thumbs_up: '👍',
      clap: '👏',
      fire: '🔥',
      star: '⭐'
    };
    return reactions[type] || '👍';
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading kudos...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>{error}</ErrorState>
      </Container>
    );
  }

  if (!kudos) {
    return (
      <Container>
        <ErrorState>Kudos not found</ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/kudos')}>
          ← Back to Kudos
        </BackButton>
        <ActionButtons>
          <ActionButton onClick={handleEdit}>
            Edit
          </ActionButton>
          <ActionButton variant="danger" onClick={handleDelete}>
            Delete
          </ActionButton>
        </ActionButtons>
      </Header>

      <KudosCard>
        <KudosHeader>
          <Avatar>
            {getInitials(kudos.recipient_name)}
          </Avatar>
          <UserInfo>
            <UserName>{kudos.recipient_name}</UserName>
            <KudosMeta>
              {formatDate(kudos.created_at)} • by {kudos.sender_name}
            </KudosMeta>
          </UserInfo>
          {kudos.is_featured && (
            <FeaturedBadge>Featured</FeaturedBadge>
          )}
        </KudosHeader>

        {kudos.values && kudos.values.length > 0 && (
          <ValuesContainer>
            {kudos.values.map((value: string, index: number) => (
              <ValueTag key={index}>{value}</ValueTag>
            ))}
          </ValuesContainer>
        )}

        <KudosMessage>
          {kudos.message}
        </KudosMessage>

        <ReactionsSection>
          <ReactionsTitle>Add Reactions</ReactionsTitle>
          <ReactionsContainer>
            {reactionTypes.map((reaction) => (
              <ReactionButton
                key={reaction.type}
                selected={kudos.reactions?.some((r: any) => r.reaction_type === reaction.type) || false}
                onClick={() => handleReaction(reaction.type)}
                disabled={reacting}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.label}</span>
              </ReactionButton>
            ))}
          </ReactionsContainer>

          {kudos.reactions && kudos.reactions.length > 0 && (
            <>
              <ReactionsTitle>Reactions ({kudos.reactions.length})</ReactionsTitle>
              <ReactionList>
                {kudos.reactions.map((reaction: any, index: number) => (
                  <ReactionItem key={index}>
                    <span>{getReactionEmoji(reaction.reaction_type)}</span>
                    <span>{reaction.user_name}</span>
                  </ReactionItem>
                ))}
              </ReactionList>
            </>
          )}
        </ReactionsSection>
      </KudosCard>
    </Container>
  );
};

export default KudosDetailView;
