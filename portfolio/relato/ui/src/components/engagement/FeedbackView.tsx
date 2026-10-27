import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Feedback } from '../../types';

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

const FeedbackList = styled.div`
  display: grid;
  gap: 1rem;
`;

const FeedbackCard = styled.div`
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

const FeedbackHeader = styled.div`
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

const FeedbackDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'received':
        return 'background: #dcfce7; color: #166534;';
      case 'given':
        return 'background: #dbeafe; color: #1e40af;';
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'draft':
        return 'background: #f3f4f6; color: #374151;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const FeedbackMessage = styled.div`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
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
  ` : `
    background: white;
    color: #374151;
    
    &:hover {
      background: #f9fafb;
    }
  `}
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

const StatusSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

type TabType = 'received' | 'given' | 'pending' | 'draft';

const FeedbackView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, [activeTab]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiService.getFeedbacks({
        status: activeTab,
        user_type: 'school' // Use school-level access to show all feedbacks in the school
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await apiService.updateFeedbackStatus(id, status as any);
      await fetchFeedbacks();
    } catch (error) {
      console.error('Error updating feedback status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleFeedbackClick = (feedbackId: string) => {
    navigate(`/feedback/${feedbackId}`);
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

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ['draft', 'pending', 'received', 'given'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  const tabs = [
    { key: 'received' as TabType, label: 'Received', count: 0 },
    { key: 'given' as TabType, label: 'Given', count: 0 },
    { key: 'pending' as TabType, label: 'Pending Requests', count: 0 },
    { key: 'draft' as TabType, label: 'Draft', count: 0 }
  ];

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading feedbacks...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Feedback</Title>
        <CreateButton onClick={() => window.location.href = '/feedback/create'}>
          Create Feedback
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

      {feedbacks.length === 0 ? (
        <EmptyState>
          No {activeTab} feedbacks found.
        </EmptyState>
      ) : (
        <FeedbackList>
          {feedbacks.map((feedback) => (
            <FeedbackCard 
              key={feedback._id}
              onClick={() => handleFeedbackClick(feedback._id)}
            >
              <FeedbackHeader>
                <Avatar>
                  {getInitials(
                    activeTab === 'received' 
                      ? feedback.sender_name 
                      : feedback.receiver_name
                  )}
                </Avatar>
                <UserInfo>
                  <UserName>
                    {activeTab === 'received' 
                      ? feedback.sender_name 
                      : feedback.receiver_name
                    }
                  </UserName>
                  <FeedbackDate>
                    {formatDate(feedback.created_at)}
                  </FeedbackDate>
                </UserInfo>
                <StatusBadge status={feedback.status}>
                  {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                </StatusBadge>
              </FeedbackHeader>

              <FeedbackMessage>
                {feedback.message}
              </FeedbackMessage>

              <ActionButtons>
                {activeTab === 'received' && (
                  <StatusSelect
                    value={feedback.status}
                    onChange={(e) => updateFeedbackStatus(feedback._id, e.target.value)}
                    disabled={updating === feedback._id}
                  >
                    {getStatusOptions(feedback.status).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </StatusSelect>
                )}
              </ActionButtons>
            </FeedbackCard>
          ))}
        </FeedbackList>
      )}
    </Container>
  );
};

export default FeedbackView;
