import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Student } from '../../types';
import apiService from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton } from '../styled/CommonComponents';

const MappingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;


const StudentCardDetailed = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const StudentHeaderDetailed = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StudentAvatarLarge = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
`;

const StudentInfoDetailed = styled.div`
  flex: 1;
`;

const StudentNameLarge = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`;

const StudentEmailLarge = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const StudentDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  color: #1f2937;
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'primary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.variant === 'danger' ? `
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
    
    &:hover {
      background: #fee2e2;
    }
  ` : `
    background: #eff6ff;
    color: #3b82f6;
    border: 1px solid #bfdbfe;
    
    &:hover {
      background: #dbeafe;
    }
  `}
`;


const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchInput = styled.input`
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

const StudentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const StudentCard = styled.div<{ selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.selected ? '#eff6ff' : 'white'};
  
  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
`;

const StudentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const StudentAvatar = styled.div`
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

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const StudentEmail = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StudentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const SelectionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

interface StudentMappingTabProps {
  schoolId: string;
  schoolName: string;
  currentStudents: Student[];
  onMappingComplete: (studentIds: string[]) => void;
}

const StudentMappingTab: React.FC<StudentMappingTabProps> = ({
  schoolId,
  schoolName,
  currentStudents,
  onMappingComplete
}) => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [mapping, setMapping] = useState(false);
  const [unmapping, setUnmapping] = useState<string | null>(null);

  useEffect(() => {
    loadAllStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [allStudents, searchTerm]);

  const loadAllStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudents();
      if (response.success) {
        setAllStudents(response.data);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm.trim()) {
      setFilteredStudents(allStudents);
      return;
    }

    const filtered = allStudents.filter(student =>
      student.firstname?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      student.lastname?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      student.profile.email_id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      student.roll_number?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student._id));
    }
  };

  const handleMapStudents = async () => {
    if (selectedStudents.length === 0) return;

    try {
      setMapping(true);
      await apiService.mapStudentsToSchool(schoolId, selectedStudents);
      await onMappingComplete(selectedStudents);
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error mapping students:', error);
    } finally {
      setMapping(false);
    }
  };

  const handleUnmapStudent = async (studentId: string) => {
    try {
      setUnmapping(studentId);
      await apiService.removeStudentFromSchool(schoolId, studentId);
      await onMappingComplete([]); // Refresh the list
    } catch (error) {
      console.error('Error unmapping student:', error);
    } finally {
      setUnmapping(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`?.toUpperCase();
  };

  const isStudentAlreadyMapped = (studentId: string) => {
    return currentStudents.some(student => student._id === studentId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <LoadingState>Loading students...</LoadingState>
        </CardContent>
      </Card>
    );
  }

  return (
    <MappingContainer>
      {/* Current Students Section */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Mapped Students ({currentStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStudents.length === 0 ? (
            <EmptyState>
              No students are currently mapped to this school.
            </EmptyState>
          ) : (
            <StudentGrid>
              {currentStudents.map((student) => (
                <StudentCardDetailed key={student._id}>
                  <StudentHeaderDetailed>
                    <StudentAvatarLarge>
                      {getInitials(student.firstname, student.lastname)}
                    </StudentAvatarLarge>
                    <StudentInfoDetailed>
                      <StudentNameLarge>
                        {student.firstname} {student.lastname}
                      </StudentNameLarge>
                      <StudentEmailLarge>{student.profile.email_id}</StudentEmailLarge>
                    </StudentInfoDetailed>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleUnmapStudent(student._id)}
                      disabled={unmapping === student._id}
                    >
                      {unmapping === student._id ? 'Removing...' : 'Remove'}
                    </ActionButton>
                  </StudentHeaderDetailed>
                  
                  <StudentDetailsGrid>
                    <DetailItem>
                      <DetailLabel>Roll Number</DetailLabel>
                      <DetailValue>{student.roll_number || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Class</DetailLabel>
                      <DetailValue>{student.class || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Section</DetailLabel>
                      <DetailValue>{student.section || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Phone</DetailLabel>
                      <DetailValue>{student.profile.phone_number?.join(', ') || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Date of Birth</DetailLabel>
                      <DetailValue>
                        {student.profile.dob 
                          ? new Date(student.profile.dob).toLocaleDateString()
                          : 'N/A'
                        }
                      </DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Guardian Name</DetailLabel>
                      <DetailValue>{student.guardian_details?.name || 'N/A'}</DetailValue>
                    </DetailItem>
                  </StudentDetailsGrid>
                </StudentCardDetailed>
              ))}
            </StudentGrid>
          )}
        </CardContent>
      </Card>

      {/* Map New Students Section */}
      <Card>
        <CardHeader>
          <CardTitle>Map New Students to {schoolName}</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchSection>
            <SearchInput
              type="text"
              placeholder="Search students by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <SelectionInfo>
              <div>
                {selectedStudents.length} student(s) selected
                {selectedStudents.length > 0 && (
                  <span style={{ marginLeft: '0.5rem', color: '#3b82f6' }}>
                    ({selectedStudents.length} of {filteredStudents.length})
                  </span>
                )}
              </div>
              <SecondaryButton onClick={handleSelectAll}>
                {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
              </SecondaryButton>
            </SelectionInfo>
          </SearchSection>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Students</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <EmptyState>
              {searchTerm ? 'No students found matching your search.' : 'No students available.'}
            </EmptyState>
          ) : (
            <StudentGrid>
              {filteredStudents.map((student) => {
                const isSelected = selectedStudents.includes(student._id);
                const isAlreadyMapped = isStudentAlreadyMapped(student._id);
                
                return (
                  <StudentCard
                    key={student._id}
                    selected={isSelected}
                    onClick={() => !isAlreadyMapped && handleStudentSelect(student._id)}
                    style={{
                      opacity: isAlreadyMapped ? 0.6 : 1,
                      cursor: isAlreadyMapped ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <StudentHeader>
                      <StudentAvatar>
                        {getInitials(student.firstname, student.lastname)}
                      </StudentAvatar>
                      <StudentInfo>
                        <StudentName>
                          {student.firstname} {student.lastname}
                        </StudentName>
                        <StudentEmail>{student.profile.email_id}</StudentEmail>
                      </StudentInfo>
                    </StudentHeader>
                    
                    <StudentDetails>
                      <div>Roll Number: {student.roll_number || 'N/A'}</div>
                      <div>Class: {student.class || 'N/A'}</div>
                      <div>Section: {student.section || 'N/A'}</div>
                      <div>Phone: {student.profile.phone_number?.join(', ') || 'N/A'}</div>
                      {isAlreadyMapped && (
                        <div style={{ color: '#059669', fontWeight: '500' }}>
                          ✓ Already mapped to this school
                        </div>
                      )}
                    </StudentDetails>
                  </StudentCard>
                );
              })}
            </StudentGrid>
          )}
        </CardContent>
      </Card>

      {selectedStudents.length > 0 && (
        <ActionButtons>
          <SecondaryButton onClick={() => setSelectedStudents([])}>
            Clear Selection
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleMapStudents}
            disabled={mapping}
          >
            {mapping ? 'Mapping...' : `Map ${selectedStudents.length} Student(s)`}
          </PrimaryButton>
        </ActionButtons>
      )}
    </MappingContainer>
  );
};

export default StudentMappingTab;
