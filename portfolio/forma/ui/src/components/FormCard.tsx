import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Form } from '../types';
import { FiEdit3, FiTrash2, FiEye, FiBarChart, FiShare2 } from 'react-icons/fi';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const FormDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const StatusBadge = styled.span<{ published: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.published ? '#d4edda' : '#f8d7da'};
  color: ${props => props.published ? '#155724' : '#721c24'};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background-color: ${props => props.variant === 'danger' ? '#dc3545' : '#f8f9fa'};
  color: ${props => props.variant === 'danger' ? 'white' : '#666'};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#c82333' : '#e9ecef'};
  }
`;

const FormStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

interface FormCardProps {
  form: Form;
  onDelete: () => void;
}

const FormCard: React.FC<FormCardProps> = ({ form, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/form/${form._id}`);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/f/${form._id}`);
  };

  const handleResponses = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/form/${form._id}/responses`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this form?')) {
      onDelete();
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/f/${form._id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Form link copied to clipboard!');
  };

  return (
    <Card onClick={handleEdit}>
      <CardHeader>
        <div>
          <FormTitle>{form.title}</FormTitle>
          {form.description && (
            <FormDescription>{form.description}</FormDescription>
          )}
        </div>
        <StatusBadge published={form.settings.isPublished}>
          {form.settings.isPublished ? 'Published' : 'Draft'}
        </StatusBadge>
      </CardHeader>

      <CardFooter>
        <FormStats>
          <StatItem>
            <FiBarChart />
            {form.questions.length} questions
          </StatItem>
        </FormStats>

        <ActionButtons>
          <ActionButton onClick={handleView} title="Preview">
            <FiEye />
          </ActionButton>
          <ActionButton onClick={handleResponses} title="Responses">
            <FiBarChart />
          </ActionButton>
          <ActionButton onClick={handleShare} title="Share">
            <FiShare2 />
          </ActionButton>
          <ActionButton onClick={handleDelete} variant="danger" title="Delete">
            <FiTrash2 />
          </ActionButton>
        </ActionButtons>
      </CardFooter>
    </Card>
  );
};

export default FormCard;
