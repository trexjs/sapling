import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Poll } from '../../types';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2rem;
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
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: #f9fafb;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const DragHandle = styled.div`
  cursor: grab;
  color: #6b7280;
  padding: 0.25rem;
  
  &:hover {
    color: #374151;
  }
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: #dc2626;
  }
`;

const AddButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 1.5rem;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const DurationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DurationInput = styled.input`
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'outline' ? `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
    }
  ` : `
    background: #3b82f6;
    color: white;
    border: none;
    
    &:hover {
      background: #2563eb;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const WarningMessage = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #92400e;
  font-size: 0.875rem;
`;

interface PollOption {
  _id: string;
  text: string;
  order: number;
}

const PollEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([]);
  const [durationDays, setDurationDays] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchPoll();
    }
  }, [id]);

  const fetchPoll = async () => {
    try {
      const response = await apiService.getPollById(id!);
      setPoll(response.data);
      setQuestion(response.data.question);
      setOptions(response.data.options);
      setDurationDays(response.data.duration_days);
    } catch (error) {
      console.error('Error fetching poll:', error);
      setError('Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (options.length < 7) {
      setOptions([...options, { 
        _id: `temp_${Date.now()}`, 
        text: '', 
        order: options.length + 1 
      }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      // Reorder options
      const reorderedOptions = newOptions.map((option, i) => ({
        ...option,
        order: i + 1
      }));
      setOptions(reorderedOptions);
    }
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const moveOption = (fromIndex: number, toIndex: number) => {
    const newOptions = [...options];
    const [movedOption] = newOptions.splice(fromIndex, 1);
    newOptions.splice(toIndex, 0, movedOption);
    
    // Update order
    const reorderedOptions = newOptions.map((option, index) => ({
      ...option,
      order: index + 1
    }));
    
    setOptions(reorderedOptions);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    const validOptions = options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const pollData = {
        question: question.trim(),
        options: validOptions,
        duration_days: durationDays
      };

      await apiService.updatePoll(id!, pollData);
      navigate(`/polls/${id}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update poll');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!poll) {
    return <div>Poll not found</div>;
  }

  const hasVotes = poll.total_votes > 0;

  return (
    <FormContainer>
      <FormTitle>Edit Poll</FormTitle>
      
      {hasVotes && (
        <WarningMessage>
          ⚠️ This poll already has {poll.total_votes} vote(s). Editing may affect the results.
        </WarningMessage>
      )}
      
      <FormGroup>
        <Label>Question *</Label>
        <TextArea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your poll question..."
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Options ({options.length}/7) *</Label>
        {options.map((option, index) => (
          <OptionContainer key={option._id}>
            <DragHandle>⋮⋮</DragHandle>
            <OptionInput
              value={option.text}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            {options.length > 2 && (
              <RemoveButton onClick={() => removeOption(index)}>
                Remove
              </RemoveButton>
            )}
          </OptionContainer>
        ))}
        
        {options.length < 7 && (
          <AddButton onClick={addOption}>
            Add Poll Option
          </AddButton>
        )}
      </FormGroup>

      <FormGroup>
        <Label>Duration (Days)</Label>
        <DurationContainer>
          <DurationInput
            type="number"
            min="1"
            max="30"
            value={durationDays}
            onChange={(e) => setDurationDays(parseInt(e.target.value) || 3)}
          />
          <span>days</span>
        </DurationContainer>
      </FormGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonGroup>
        <Button variant="outline" onClick={() => navigate(`/polls/${id}`)}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Update Poll'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default PollEditForm;
