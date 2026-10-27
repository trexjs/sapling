import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const TabContainer = styled.div`
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    color: #3b82f6;
  }
`;

const KudosList = styled.div`
  display: grid;
  gap: 1rem;
`;

const KudosCard = styled.div`
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

const KudosHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
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

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const KudosDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ValueTag = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
`;

const KudosMessage = styled.div`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReactionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ReactionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: #f9fafb;
  }
`;

const ReactionCount = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.5rem;
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

type TabType = 'all' | 'sent' | 'received' | 'featured';

const KudosView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [kudos, setKudos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKudos();
  }, [activeTab]);

  const fetchKudos = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      if (activeTab === 'sent') {
        params.user_type = 'sent';
      } else if (activeTab === 'received') {
        params.user_type = 'received';
      } else if (activeTab === 'featured') {
        params.featured_only = true;
      } else {
        params.user_type = 'school';
      }

      const response = await apiService.getKudos(params);
      setKudos(response.data);
    } catch (error) {
      console.error('Error fetching kudos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKudosClick = (kudosId: string) => {
    navigate(`/kudos/${kudosId}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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

  const tabs = [
    { key: 'all' as TabType, label: 'All Kudos', count: 0 },
    { key: 'sent' as TabType, label: 'Sent', count: 0 },
    { key: 'received' as TabType, label: 'Received', count: 0 },
    { key: 'featured' as TabType, label: 'Featured', count: 0 }
  ];

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading kudos...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Kudos</Title>
        <CreateButton onClick={() => navigate('/kudos/create')}>
          Give Kudos
        </CreateButton>
      </Header>

      <TabContainer>
        <TabList>
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </TabContainer>

      {kudos.length === 0 ? (
        <EmptyState>
          No {activeTab} kudos found.
        </EmptyState>
      ) : (
        <KudosList>
          {kudos.map((kudo) => (
            <KudosCard 
              key={kudo._id}
              onClick={() => handleKudosClick(kudo._id)}
            >
              <KudosHeader>
                <Avatar>
                  {getInitials(kudo.recipient_name)}
                </Avatar>
                <UserInfo>
                  <UserName>{kudo.recipient_name}</UserName>
                  <KudosDate>
                    {formatDate(kudo.created_at)} • by {kudo.sender_name}
                  </KudosDate>
                </UserInfo>
                {kudo.is_featured && (
                  <FeaturedBadge>Featured</FeaturedBadge>
                )}
              </KudosHeader>

              {kudo.values && kudo.values.length > 0 && (
                <ValuesContainer>
                  {kudo.values.map((value: string, index: number) => (
                    <ValueTag key={index}>{value}</ValueTag>
                  ))}
                </ValuesContainer>
              )}

              <KudosMessage>
                {kudo.message}
              </KudosMessage>

              {kudo.reactions && kudo.reactions.length > 0 && (
                <ReactionsContainer>
                  {kudo.reactions.slice(0, 3).map((reaction: any, index: number) => (
                    <ReactionButton key={index}>
                      <span>{getReactionEmoji(reaction.reaction_type)}</span>
                    </ReactionButton>
                  ))}
                  {kudo.reactions.length > 3 && (
                    <ReactionCount>
                      +{kudo.reactions.length - 3} more
                    </ReactionCount>
                  )}
                </ReactionsContainer>
              )}
            </KudosCard>
          ))}
        </KudosList>
      )}
    </Container>
  );
};

export default KudosView;
