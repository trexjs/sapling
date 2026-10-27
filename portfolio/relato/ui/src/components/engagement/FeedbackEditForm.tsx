import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Feedback } from '../../types';
import apiService from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton } from '../styled/CommonComponents';

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

const Form = styled.form`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
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

const FeedbackEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'draft' | 'pending' | 'received' | 'given'>('draft');

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
        const feedbackData = response.data;
        setFeedback(feedbackData);
        setMessage(feedbackData.message);
        setStatus(feedbackData.status);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;

    try {
      setSaving(true);
      await apiService.updateFeedback(feedback._id, {
        message,
        status
      });
      navigate(`/feedback/${feedback._id}`);
    } catch (error) {
      console.error('Error updating feedback:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (feedback) {
      navigate(`/feedback/${feedback._id}`);
    } else {
      navigate('/feedback');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading feedback...</LoadingState>
      </Container>
    );
  }

  if (error || !feedback) {
    return (
      <Container>
        <ErrorState>
          <h2>Feedback not found</h2>
          <p>{error || "The feedback you're looking for doesn't exist or has been removed."}</p>
          <SecondaryButton onClick={() => navigate('/feedback')}>
            Back to Feedback
          </SecondaryButton>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Edit Feedback</Title>
        <ButtonGroup>
          <SecondaryButton onClick={handleCancel}>
            Cancel
          </SecondaryButton>
        </ButtonGroup>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Receiver</Label>
          <Input
            type="text"
            value={feedback.receiver_name}
            disabled
            style={{ background: '#f9fafb', color: '#6b7280' }}
          />
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="received">Received</option>
            <option value="given">Given</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Message</Label>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your feedback message..."
            required
          />
        </FormGroup>

        <ActionButtons>
          <SecondaryButton type="button" onClick={handleCancel}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </PrimaryButton>
        </ActionButtons>
      </Form>
    </Container>
  );
};

export default FeedbackEditForm;
