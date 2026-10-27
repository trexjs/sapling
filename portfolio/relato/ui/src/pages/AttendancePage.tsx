import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Card, CardContent, PrimaryButton, SecondaryButton, Select, Input, FormGroup, Label } from '../components/styled/CommonComponents';
import {
  AttendanceForm,
  AttendanceConfig
} from '../components/attendance';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;


const TabContainer = styled.div`
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.isActive ? 'white' : 'transparent'};
  color: ${props => props.isActive ? '#2563eb' : '#6b7280'};
  font-weight: ${props => props.isActive ? '600' : '500'};
  border-bottom: 2px solid ${props => props.isActive ? '#2563eb' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #2563eb;
    background: ${props => props.isActive ? 'white' : '#f9fafb'};
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const AttendancePage: React.FC = () => {
  const { schools, students, teachers, user, fetchSchools, fetchStudents, fetchTeachers } = useApp();
  
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClassSection, setSelectedClassSection] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');
  const hasFetchedData = useRef(false);

  // Use manually selected teacher ID
  const teacherId = selectedTeacher;

  // Fetch schools, students, and teachers on mount (only once)
  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      
      // Only fetch if data doesn't exist
      if (schools.length === 0) {
        fetchSchools().catch(err => console.error('Failed to fetch schools:', err));
      }
      if (students.length === 0) {
        fetchStudents().catch(err => console.error('Failed to fetch students:', err));
      }
      if (teachers.length === 0) {
        fetchTeachers().catch(err => console.error('Failed to fetch teachers:', err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-select user's school if available
  useEffect(() => {
    if (user?.school_id && !selectedSchool) {
      setSelectedSchool(user.school_id);
    }
  }, [user?.school_id, selectedSchool]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId);
    setSelectedClassSection('');
    setSelectedTeacher('');
  };

  const handleClassSectionChange = (value: string) => {
    setSelectedClassSection(value);
  };

  // Parse class and section from combined value
  const getClassAndSection = () => {
    if (!selectedClassSection) return { class: '', section: '' };
    const [classValue, sectionValue] = selectedClassSection.split('-');
    return { class: classValue || '', section: sectionValue || '' };
  };

  const { class: classFilter, section: sectionFilter } = getClassAndSection();

  const handleAttendanceMarked = () => {
    // Refresh data after attendance is marked
    console.log('Attendance marked successfully');
  };

  // Get unique class-section combinations from students
  const availableClassSections = Array.from(new Set(
    students
      .filter(s => !selectedSchool || s.school_id === selectedSchool)
      .filter(s => s.class && s.section)
      .map(s => `${s.class}-${s.section}`)
  )).sort();

  // Get teachers for the selected school
  const availableTeachers = teachers.filter(
    t => !selectedSchool || t.school_id === selectedSchool
  );

  return (
    <div>
      <PageHeader>
        <PageTitle>Attendance Management</PageTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SecondaryButton onClick={() => window.location.reload()}>
            Refresh
          </SecondaryButton>
          <PrimaryButton onClick={() => setActiveTab('mark')}>
            Mark Attendance
          </PrimaryButton>
        </div>
      </PageHeader>

      <Card style={{ marginBottom: '2rem' }}>
        <CardContent>
          <FiltersContainer>
            <FormGroup>
              <Label htmlFor="school">Select School *</Label>
              <Select
                id="school"
                value={selectedSchool}
                onChange={(e) => handleSchoolChange(e.target.value)}
              >
                <option value="">Select School</option>
                {schools.map(school => (
                  <option key={school._id} value={school._id}>
                    {school.school_code} - {school.contact_details?.email_id}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="teacher">Select Teacher *</Label>
              <Select
                id="teacher"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                disabled={!selectedSchool}
              >
                <option value="">Select Teacher</option>
                {availableTeachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.displayname || `${teacher.firstname} ${teacher.lastname}`} - {teacher.teacher_id}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="classSection">Select Class & Section *</Label>
              <Select
                id="classSection"
                value={selectedClassSection}
                onChange={(e) => handleClassSectionChange(e.target.value)}
                disabled={!selectedSchool}
              >
                <option value="">Select Class & Section</option>
                {availableClassSections.map(cs => {
                  const [cls, section] = cs.split('-');
                  return (
                    <option key={cs} value={cs}>
                      {cls} - {section}
                    </option>
                  );
                })}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="date">Select Date *</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </FormGroup>
          </FiltersContainer>
        </CardContent>
      </Card>

      <TabContainer>
        <TabList>
          <Tab isActive={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')}>
            Attendance
          </Tab>
          <Tab isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            Settings
          </Tab>
        </TabList>
      </TabContainer>

      <TabContent>
        {activeTab === 'attendance' && (
          <div>
            {!selectedSchool || !selectedTeacher || !selectedClassSection ? (
              <Card>
                <CardContent>
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Select Required Filters
                    </div>
                    <div>
                      Please select a school, teacher, and class & section to mark attendance
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : !teacherId ? (
              <Card>
                <CardContent>
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Please Log In
                    </div>
                    <div>
                      You need to be logged in to mark attendance. Please log in and try again.
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <AttendanceForm
                schoolId={selectedSchool}
                teacherId={teacherId}
                selectedDate={selectedDate}
                classFilter={classFilter}
                sectionFilter={sectionFilter}
                onAttendanceMarked={handleAttendanceMarked}
              />
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            {!selectedSchool ? (
              <Card>
                <CardContent>
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Select a School
                    </div>
                    <div>
                      Please select a school to configure attendance settings
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <AttendanceConfig
                schoolId={selectedSchool}
                onConfigUpdated={() => console.log('Config updated')}
              />
            )}
          </div>
        )}
      </TabContent>
    </div>
  );
};

export default AttendancePage;
