import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Teacher } from '../../types';
import apiService from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton } from '../styled/CommonComponents';

const MappingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;


const TeacherCardDetailed = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const TeacherHeaderDetailed = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TeacherAvatarLarge = styled.div`
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

const TeacherInfoDetailed = styled.div`
  flex: 1;
`;

const TeacherNameLarge = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`;

const TeacherEmailLarge = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const TeacherDetailsGrid = styled.div`
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

const TeacherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const TeacherCard = styled.div<{ selected: boolean }>`
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

const TeacherHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const TeacherAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

const TeacherInfo = styled.div`
  flex: 1;
`;

const TeacherName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const TeacherEmail = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const TeacherDetails = styled.div`
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

interface TeacherMappingTabProps {
  schoolId: string;
  schoolName: string;
  currentTeachers: Teacher[];
  onMappingComplete: (teacherIds: string[]) => void;
}

const TeacherMappingTab: React.FC<TeacherMappingTabProps> = ({
  schoolId,
  schoolName,
  currentTeachers,
  onMappingComplete
}) => {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [mapping, setMapping] = useState(false);
  const [unmapping, setUnmapping] = useState<string | null>(null);

  useEffect(() => {
    loadAllTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [allTeachers, searchTerm]);

  const loadAllTeachers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTeachers();
      if (response.success) {
        setAllTeachers(response.data);
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    if (!searchTerm.trim()) {
      setFilteredTeachers(allTeachers);
      return;
    }

    const filtered = allTeachers.filter(teacher =>
      teacher.firstname?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      teacher.lastname?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      teacher.profile.email_id?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeachers(prev => {
      if (prev.includes(teacherId)) {
        return prev.filter(id => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === filteredTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map(teacher => teacher._id));
    }
  };

  const handleMapTeachers = async () => {
    if (selectedTeachers.length === 0) return;

    try {
      setMapping(true);
      await apiService.mapTeachersToSchool(schoolId, selectedTeachers);
      await onMappingComplete(selectedTeachers);
      setSelectedTeachers([]);
    } catch (error) {
      console.error('Error mapping teachers:', error);
    } finally {
      setMapping(false);
    }
  };

  const handleUnmapTeacher = async (teacherId: string) => {
    try {
      setUnmapping(teacherId);
      await apiService.removeTeacherFromSchool(schoolId, teacherId);
      await onMappingComplete([]); // Refresh the list
    } catch (error) {
      console.error('Error unmapping teacher:', error);
    } finally {
      setUnmapping(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  const isTeacherAlreadyMapped = (teacherId: string) => {
    return currentTeachers.some(teacher => teacher._id === teacherId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <LoadingState>Loading teachers...</LoadingState>
        </CardContent>
      </Card>
    );
  }

  return (
    <MappingContainer>
      {/* Current Teachers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Mapped Teachers ({currentTeachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {currentTeachers.length === 0 ? (
            <EmptyState>
              No teachers are currently mapped to this school.
            </EmptyState>
          ) : (
            <TeacherGrid>
              {currentTeachers.map((teacher) => (
                <TeacherCardDetailed key={teacher._id}>
                  <TeacherHeaderDetailed>
                    <TeacherAvatarLarge>
                      {getInitials(teacher.firstname, teacher.lastname)}
                    </TeacherAvatarLarge>
                    <TeacherInfoDetailed>
                      <TeacherNameLarge>
                        {teacher.firstname} {teacher.lastname}
                      </TeacherNameLarge>
                      <TeacherEmailLarge>{teacher.profile.email_id}</TeacherEmailLarge>
                    </TeacherInfoDetailed>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleUnmapTeacher(teacher._id)}
                      disabled={unmapping === teacher._id}
                    >
                      {unmapping === teacher._id ? 'Removing...' : 'Remove'}
                    </ActionButton>
                  </TeacherHeaderDetailed>
                  
                  <TeacherDetailsGrid>
                    <DetailItem>
                      <DetailLabel>Phone</DetailLabel>
                      <DetailValue>{teacher.profile.phone_number?.join(', ') || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Expertised Fields</DetailLabel>
                      <DetailValue>{teacher.profile.expertised_fields?.join(', ') || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Experience</DetailLabel>
                      <DetailValue>{teacher.profile.experience?.join(', ') || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Gender</DetailLabel>
                      <DetailValue>{teacher.profile.gender || 'N/A'}</DetailValue>
                    </DetailItem>
                  </TeacherDetailsGrid>
                </TeacherCardDetailed>
              ))}
            </TeacherGrid>
          )}
        </CardContent>
      </Card>

      {/* Map New Teachers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Map New Teachers to {schoolName}</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchSection>
            <SearchInput
              type="text"
              placeholder="Search teachers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <SelectionInfo>
              <div>
                {selectedTeachers.length} teacher(s) selected
                {selectedTeachers.length > 0 && (
                  <span style={{ marginLeft: '0.5rem', color: '#3b82f6' }}>
                    ({selectedTeachers.length} of {filteredTeachers.length})
                  </span>
                )}
              </div>
              <SecondaryButton onClick={handleSelectAll}>
                {selectedTeachers.length === filteredTeachers.length ? 'Deselect All' : 'Select All'}
              </SecondaryButton>
            </SelectionInfo>
          </SearchSection>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTeachers.length === 0 ? (
            <EmptyState>
              {searchTerm ? 'No teachers found matching your search.' : 'No teachers available.'}
            </EmptyState>
          ) : (
            <TeacherGrid>
              {filteredTeachers.map((teacher) => {
                const isSelected = selectedTeachers.includes(teacher._id);
                const isAlreadyMapped = isTeacherAlreadyMapped(teacher._id);
                
                return (
                  <TeacherCard
                    key={teacher._id}
                    selected={isSelected}
                    onClick={() => !isAlreadyMapped && handleTeacherSelect(teacher._id)}
                    style={{
                      opacity: isAlreadyMapped ? 0.6 : 1,
                      cursor: isAlreadyMapped ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <TeacherHeader>
                      <TeacherAvatar>
                        {getInitials(teacher.firstname, teacher.lastname)}
                      </TeacherAvatar>
                      <TeacherInfo>
                        <TeacherName>
                          {teacher.firstname} {teacher.lastname}
                        </TeacherName>
                        <TeacherEmail>{teacher.profile.email_id}</TeacherEmail>
                      </TeacherInfo>
                    </TeacherHeader>
                    
                    <TeacherDetails>
                      <div>Phone: {teacher.profile.phone_number?.join(', ') || 'N/A'}</div>
                      <div>Expertised Fields: {teacher.profile.expertised_fields?.join(', ') || 'N/A'}</div>
                      <div>Experience: {teacher.profile.experience?.join(', ') || 'N/A'}</div>
                      {isAlreadyMapped && (
                        <div style={{ color: '#059669', fontWeight: '500' }}>
                          ✓ Already mapped to this school
                        </div>
                      )}
                    </TeacherDetails>
                  </TeacherCard>
                );
              })}
            </TeacherGrid>
          )}
        </CardContent>
      </Card>

      {selectedTeachers.length > 0 && (
        <ActionButtons>
          <SecondaryButton onClick={() => setSelectedTeachers([])}>
            Clear Selection
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleMapTeachers}
            disabled={mapping}
          >
            {mapping ? 'Mapping...' : `Map ${selectedTeachers.length} Teacher(s)`}
          </PrimaryButton>
        </ActionButtons>
      )}
    </MappingContainer>
  );
};

export default TeacherMappingTab;
