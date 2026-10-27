import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Feedback } from '../types';
import apiService from '../services/api';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton, Badge } from '../components/styled/CommonComponents';

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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const FeedbackCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FeedbackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
`;

const SenderInfo = styled.div`
  flex: 1;
`;

const SenderName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
`;

const SenderEmail = styled.p`
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
`;

const FeedbackDate = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
`;

const StatusBadge = styled(Badge)<{ status: string }>`
  ${props => {
    switch (props.status) {
      case 'received':
        return `
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        `;
      case 'given':
        return `
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        `;
      case 'pending':
        return `
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        `;
      case 'draft':
        return `
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        `;
    }
  }}
`;

const MessageSection = styled.div`
  margin-bottom: 2rem;
`;

const MessageLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
`;

const MessageContent = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #1f2937;
  white-space: pre-wrap;
`;

const ReceiverSection = styled.div`
  margin-bottom: 2rem;
`;

const ReceiverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
`;

const ReceiverAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ReceiverDetails = styled.div`
  flex: 1;
`;

const ReceiverName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const ReceiverEmail = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
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

const FeedbackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadFeedback();
    }
  }, [id]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getFeedbackById(id!);
      if (response.success && response.data) {
        setFeedback(response.data);
      } else {
        setError('Feedback not found');
      }
    } catch (err) {
      console.error('Error loading feedback:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/feedback');
  };

  const handleEdit = () => {
    if (feedback) {
      navigate(`/feedback/${feedback._id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!feedback || !window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      setDeleting(true);
      await apiService.deleteFeedback(feedback._id);
      navigate('/feedback');
    } catch (error) {
      console.error('Error deleting feedback:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!feedback) return;

    try {
      setUpdating(true);
      await apiService.updateFeedbackStatus(feedback._id, newStatus);
      await loadFeedback(); // Refresh the feedback data
    } catch (error) {
      console.error('Error updating feedback status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
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

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading feedback details...</LoadingState>
      </Container>
    );
  }

  if (error || !feedback) {
    return (
      <Container>
        <ErrorState>
          <h2>Feedback not found</h2>
          <p>{error || "The feedback you're looking for doesn't exist or has been removed."}</p>
          <SecondaryButton onClick={handleBack}>
            Back to Feedback
          </SecondaryButton>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Feedback Details</Title>
        <ButtonGroup>
          <SecondaryButton onClick={handleBack}>
            Back to Feedback
          </SecondaryButton>
          <PrimaryButton onClick={handleEdit}>
            Edit Feedback
          </PrimaryButton>
        </ButtonGroup>
      </Header>

      <FeedbackCard>
        <FeedbackHeader>
          <Avatar>
            {getInitials(feedback.sender_name, '')}
          </Avatar>
          <SenderInfo>
            <SenderName>{feedback.sender_name}</SenderName>
            <SenderEmail>{feedback.sender_email}</SenderEmail>
            <FeedbackDate>{formatDate(feedback.created_at)}</FeedbackDate>
          </SenderInfo>
          <StatusBadge status={feedback.status}>
            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
          </StatusBadge>
        </FeedbackHeader>

        <MessageSection>
          <MessageLabel>Message</MessageLabel>
          <MessageContent>{feedback.message}</MessageContent>
        </MessageSection>

        <ReceiverSection>
          <MessageLabel>Sent To</MessageLabel>
          <ReceiverInfo>
            <ReceiverAvatar>
              {getInitials(feedback.receiver_name, '')}
            </ReceiverAvatar>
            <ReceiverDetails>
              <ReceiverName>{feedback.receiver_name}</ReceiverName>
              <ReceiverEmail>{feedback.receiver_email}</ReceiverEmail>
            </ReceiverDetails>
          </ReceiverInfo>
        </ReceiverSection>

        <ActionButtons>
          <SecondaryButton onClick={handleBack}>
            Back to Feedback
          </SecondaryButton>
          
          {feedback.status === 'draft' && (
            <PrimaryButton onClick={() => handleStatusUpdate('pending')} disabled={updating}>
              {updating ? 'Updating...' : 'Submit for Review'}
            </PrimaryButton>
          )}
          
          {feedback.status === 'pending' && (
            <PrimaryButton onClick={() => handleStatusUpdate('received')} disabled={updating}>
              {updating ? 'Updating...' : 'Mark as Received'}
            </PrimaryButton>
          )}
          
          <SecondaryButton onClick={handleEdit}>
            Edit Feedback
          </SecondaryButton>
          
          <SecondaryButton 
            onClick={handleDelete}
            disabled={deleting}
            style={{ 
              background: '#fef2f2', 
              color: '#dc2626', 
              border: '1px solid #fecaca' 
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </SecondaryButton>
        </ActionButtons>
      </FeedbackCard>
    </Container>
  );
};

export default FeedbackDetailPage;
