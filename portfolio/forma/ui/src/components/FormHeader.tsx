import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSave, FiEye, FiShare2, FiSettings } from 'react-icons/fi';
import { Form } from '../types';

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormInfo = styled.div`
  flex: 1;
`;

const FormTitle = styled.input`
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #1a1a1a;
  width: 100%;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    background: #f8f9fa;
    padding: 0.5rem;
    border-radius: 6px;
  }
`;

const FormDescription = styled.input`
  font-size: 1rem;
  border: none;
  background: transparent;
  color: #666;
  width: 100%;

  &:focus {
    outline: none;
    background: #f8f9fa;
    padding: 0.5rem;
    border-radius: 6px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'success' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: ${props => 
    props.variant === 'primary' ? '#007bff' : 
    props.variant === 'success' ? '#28a745' : 'white'
  };
  color: ${props => 
    props.variant === 'primary' || props.variant === 'success' ? 'white' : '#666'
  };
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => 
      props.variant === 'primary' ? '#0056b3' : 
      props.variant === 'success' ? '#218838' : '#f8f9fa'
    };
  }
`;

const StatusBadge = styled.span<{ published: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.published ? '#d4edda' : '#f8d7da'};
  color: ${props => props.published ? '#155724' : '#721c24'};
  margin-left: 1rem;
`;

interface FormHeaderProps {
  form: Form;
  onUpdate: (updates: Partial<Form>) => void;
  onPublish: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ form, onUpdate, onPublish }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ description: e.target.value });
  };

  const handlePreview = () => {
    window.open(`/f/${form._id}`, '_blank');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/f/${form._id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Form link copied to clipboard!');
  };

  return (
    <Header>
      <FormInfo>
        <FormTitle
          value={form.title}
          onChange={handleTitleChange}
          placeholder="Form title"
        />
        <FormDescription
          value={form.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Form description (optional)"
        />
      </FormInfo>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StatusBadge published={form.settings.isPublished}>
          {form.settings.isPublished ? 'Published' : 'Draft'}
        </StatusBadge>

        <ActionButtons>
          <Button onClick={handlePreview}>
            <FiEye />
            Preview
          </Button>
          
          <Button onClick={handleShare}>
            <FiShare2 />
            Share
          </Button>
          
          <Button 
            variant={form.settings.isPublished ? 'success' : 'primary'}
            onClick={onPublish}
          >
            <FiSave />
            {form.settings.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </ActionButtons>
      </div>
    </Header>
  );
};

export default FormHeader;
