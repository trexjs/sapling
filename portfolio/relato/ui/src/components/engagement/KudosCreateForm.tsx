import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

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

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
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

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

const SearchResultItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SelectedStudent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
`;

const StudentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const StudentClass = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: #dc2626;
  }
`;

const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ValueTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #374151;
`;

const ValueRemoveButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  font-size: 0.75rem;
  
  &:hover {
    color: #ef4444;
  }
`;

const ValueInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const AddValueButton = styled.button`
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

const ReactionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ReactionButton = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 1px solid ${props => props.selected ? '#3b82f6' : '#d1d5db'};
  border-radius: 0.375rem;
  background: ${props => props.selected ? '#eff6ff' : 'white'};
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: ${props => props.selected ? '#eff6ff' : '#f9fafb'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    if (props.variant === 'outline') {
      return `
        background: white;
        color: #374151;
        border: 1px solid #d1d5db;
        
        &:hover {
          background: #f9fafb;
        }
      `;
    } else if (props.variant === 'secondary') {
      return `
        background: #3b82f6;
        color: white;
        border: 1px solid #3b82f6;
        
        &:hover {
          background: #2563eb;
        }
      `;
    } else {
      return `
        background: #3b82f6;
        color: white;
        border: none;
        
        &:hover {
          background: #2563eb;
        }
      `;
    }
  }}
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const LoadingMessage = styled.div`
  padding: 0.75rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

interface Student {
  _id: string;
  name: string;
  displayname: string;
  photo: string;
}

const KudosCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [message, setMessage] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState('');
  const [reactions, setReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const predefinedValues = [
    'Problem Solver', 'Collaborator', 'Team Player', 'Leader', 
    'Innovator', 'Mentor', 'Helper', 'Creative', 'Dedicated', 'Reliable'
  ];

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
    if (searchQuery.length >= 2) {
      searchStudents();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchStudents = async () => {
    setSearching(true);
    try {
      const response = await apiService.searchStudentsForKudos(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching students:', error);
    } finally {
      setSearching(false);
    }
  };

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeStudent = () => {
    setSelectedStudent(null);
  };

  const getStudentInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const addValue = (value: string) => {
    if (value.trim() && !values.includes(value.trim())) {
      setValues([...values, value.trim()]);
    }
  };

  const removeValue = (valueToRemove: string) => {
    setValues(values.filter(v => v !== valueToRemove));
  };

  const addPredefinedValue = (value: string) => {
    if (!values.includes(value)) {
      setValues([...values, value]);
    }
  };

  const toggleReaction = (reactionType: string) => {
    if (reactions.includes(reactionType)) {
      setReactions(reactions.filter(r => r !== reactionType));
    } else {
      setReactions([...reactions, reactionType]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const kudosData = {
        recipient_id: selectedStudent._id,
        message: message.trim(),
        values: values,
        reactions: reactions,
        visibility: 'school' as const
      };

      await apiService.createKudos(kudosData);
      navigate('/kudos');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create kudos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Give Kudos</FormTitle>
      
      <FormGroup>
        <Label>Search Employee *</Label>
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an employee..."
            disabled={!!selectedStudent}
          />
          
          {searchResults.length > 0 && !selectedStudent && (
            <SearchResults>
              {searchResults.map((student) => (
                <SearchResultItem
                  key={student._id}
                  onClick={() => selectStudent(student)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StudentAvatar>
                    {getStudentInitials(student.name)}
                  </StudentAvatar>
                  <div>
                    <div style={{ fontWeight: '500' }}>{student.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {student.displayname}
                    </div>
                  </div>
                  </div>
                </SearchResultItem>
              ))}
            </SearchResults>
          )}
          
          {searching && (
            <SearchResults>
              <LoadingMessage>Searching...</LoadingMessage>
            </SearchResults>
          )}
        </SearchContainer>
        
        {selectedStudent && (
          <SelectedStudent>
            <StudentAvatar>
              {getStudentInitials(selectedStudent.name)}
            </StudentAvatar>
            <StudentInfo>
              <StudentName>{selectedStudent.name}</StudentName>
              <StudentClass>{selectedStudent.displayname}</StudentClass>
            </StudentInfo>
            <RemoveButton onClick={removeStudent}>
              Remove
            </RemoveButton>
          </SelectedStudent>
        )}
      </FormGroup>

      <FormGroup>
        <Label>Recognize Values</Label>
        <ValuesContainer>
          {values.map((value) => (
            <ValueTag key={value}>
              {value}
              <ValueRemoveButton onClick={() => removeValue(value)}>
                ×
              </ValueRemoveButton>
            </ValueTag>
          ))}
        </ValuesContainer>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <ValueInput
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Add a value..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addValue(newValue);
                setNewValue('');
              }
            }}
          />
          <AddValueButton onClick={() => {
            addValue(newValue);
            setNewValue('');
          }}>
            Add
          </AddValueButton>
        </div>
        
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Quick add:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {predefinedValues.map((value) => (
              <button
                key={value}
                onClick={() => addPredefinedValue(value)}
                disabled={values.includes(value)}
                style={{
                  padding: '0.25rem 0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  background: values.includes(value) ? '#f3f4f6' : 'white',
                  color: values.includes(value) ? '#6b7280' : '#374151',
                  cursor: values.includes(value) ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </FormGroup>

      <FormGroup>
        <Label>Your Message *</Label>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your appreciation message here..."
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Add Reactions</Label>
        <ReactionsContainer>
          {reactionTypes.map((reaction) => (
            <ReactionButton
              key={reaction.type}
              selected={reactions.includes(reaction.type)}
              onClick={() => toggleReaction(reaction.type)}
            >
              <span>{reaction.emoji}</span>
              <span>{reaction.label}</span>
            </ReactionButton>
          ))}
        </ReactionsContainer>
      </FormGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonGroup>
        <Button variant="outline" onClick={() => navigate('/kudos')}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Give Kudos'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default KudosCreateForm;
