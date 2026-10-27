import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { School, Teacher, Student } from '../types';
import apiService from '../services/api';
import SchoolDetailsTab from '../components/school/SchoolDetailsTab';
import TeacherMappingTab from '../components/school/TeacherMappingTab';
import StudentMappingTab from '../components/school/StudentMappingTab';

const Container = styled.div`
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

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    border: none;
    
    &:hover {
      background: #2563eb;
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
    }
  `}
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

const TabContent = styled.div`
  min-height: 400px;
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

type TabType = 'details' | 'teachers' | 'students';

const SchoolDetailPageNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [school, setSchool] = useState<School | null>(null);
  const [schoolTeachers, setSchoolTeachers] = useState<Teacher[]>([]);
  const [schoolStudents, setSchoolStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSchoolData();
    }
  }, [id]);

  const loadSchoolData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load school details
      const schoolResponse = await apiService.getSchoolById(id!);
      if (schoolResponse.success && schoolResponse.data) {
        setSchool(schoolResponse.data);
      } else {
        setError('School not found');
        return;
      }

      // Load teachers for this school
      const teachersResponse = await apiService.getSchoolTeachers(id!);
      if (teachersResponse.success) {
        setSchoolTeachers(teachersResponse.data);
      }

      // Load students for this school
      const studentsResponse = await apiService.getSchoolStudents(id!);
      if (studentsResponse.success) {
        setSchoolStudents(studentsResponse.data);
      }

    } catch (err) {
      console.error('Error loading school data:', err);
      setError('Failed to load school data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (school) {
      navigate(`/schools/${school._id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/schools');
  };

  const handleTeacherMapping = async (_teacherIds: string[]) => {
    try {
      // Refresh teachers list
      await loadSchoolData();
    } catch (error) {
      console.error('Error mapping teachers:', error);
    }
  };

  const handleStudentMapping = async (_studentIds: string[]) => {
    try {
      // Refresh students list
      await loadSchoolData();
    } catch (error) {
      console.error('Error mapping students:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading school details...</LoadingState>
      </Container>
    );
  }

  if (error || !school) {
    return (
      <Container>
        <ErrorState>
          <h2>School not found</h2>
          <p>{error || "The school you're looking for doesn't exist or has been removed."}</p>
          <Button onClick={handleBack}>
            Back to Schools
          </Button>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{school.school_code} - School Details</Title>
        <ButtonGroup>
          <Button onClick={handleBack}>
            Back to Schools
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Edit School
          </Button>
        </ButtonGroup>
      </Header>

      <TabContainer>
        <TabList>
          <Tab
            active={activeTab === 'details'}
            onClick={() => setActiveTab('details')}
          >
            Details
          </Tab>
          <Tab
            active={activeTab === 'teachers'}
            onClick={() => setActiveTab('teachers')}
          >
            Teachers ({schoolTeachers.length})
          </Tab>
          <Tab
            active={activeTab === 'students'}
            onClick={() => setActiveTab('students')}
          >
            Students ({schoolStudents.length})
          </Tab>
        </TabList>
      </TabContainer>

      <TabContent>
        {activeTab === 'details' && (
          <SchoolDetailsTab school={school} />
        )}
        
        {activeTab === 'teachers' && (
          <TeacherMappingTab
            schoolId={school._id}
            schoolName={school.school_code}
            currentTeachers={schoolTeachers}
            onMappingComplete={handleTeacherMapping}
          />
        )}
        
        {activeTab === 'students' && (
          <StudentMappingTab
            schoolId={school._id}
            schoolName={school.school_code}
            currentStudents={schoolStudents}
            onMappingComplete={handleStudentMapping}
          />
        )}
      </TabContent>
    </Container>
  );
};

export default SchoolDetailPageNew;
