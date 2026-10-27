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

const FeedbackCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

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
      const response = await apiService.searchStudents(searchQuery);
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

  const handleSubmit = async (status: 'draft' | 'submit') => {
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
      const feedbackData = {
        receiver_id: selectedStudent._id,
        message: message.trim(),
        status: status === 'draft' ? 'draft' : 'pending'
      };

      await apiService.createFeedback(feedbackData);
      navigate('/feedback');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Create Feedback</FormTitle>
      
      <FormGroup>
        <Label>Select Student *</Label>
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a student..."
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
        <Label>Personalized Message *</Label>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your feedback message here..."
          required
        />
      </FormGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonGroup>
        <Button variant="outline" onClick={() => navigate('/feedback')}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSubmit('draft')}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          onClick={() => handleSubmit('submit')}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default FeedbackCreateForm;
