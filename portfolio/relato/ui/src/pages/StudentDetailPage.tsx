import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton, Badge, Input, FormGroup, Label } from '../components/styled/CommonComponents';
import { Student } from '../types';
import apiService from '../services/api';

const DetailContainer = styled.div`
  padding: 1rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
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
  padding: 1.5rem 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Avatar = styled.div<{ hasImage?: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.hasImage ? 'transparent' : '#10b981'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  background-image: ${props => props.hasImage ? `url(${props.children})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  color: #111827;
  font-size: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const GuardianCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9fafb;
  margin-bottom: 1rem;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const GuardianHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const GuardianAvatar = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const GuardianInfo = styled.div`
  flex: 1;
`;

const GuardianName = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const GuardianRole = styled.p`
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
`;

const GuardianDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`;

const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DocumentIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const DocumentText = styled.div`
  flex: 1;
`;

const getInitials = (student: Student) => {
  // Use firstname and lastname
  if (student.firstname && student.lastname) {
    return (student.firstname[0] + student.lastname[0]).toUpperCase();
  }
  return '??';
};

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, teachers } = useApp();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'documents'>('personal');
  
  // Attendance state
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Helper function to get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t._id === teacherId);
    if (teacher) {
      return teacher.displayname || `${teacher.firstname} ${teacher.lastname}`;
    }
    return teacherId; // Fallback to ID if teacher not found
  };

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // First, try to find the student in the already-loaded students array
        const foundStudent = students.find(s => s._id === id);
        
        if (foundStudent) {
          setStudent(foundStudent);
          setLoading(false);
        } else {
          // If not found in local array, fetch from API
          console.log('Student not found in local array, fetching from API...');
          const response = await apiService.getStudentById(id);
          
          if (response.success && response.data) {
            setStudent(response.data);
          } else {
            setError('Student not found');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading student:', err);
        setError('Failed to load student details');
        setLoading(false);
      }
    };

    loadStudent();
  }, [id, students]);

  const handleEdit = () => {
    if (student) {
      navigate(`/students/${student._id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/students');
  };

  // Fetch attendance records
  const fetchAttendance = async () => {
    if (!student || !student.school_id) return;
    
    setAttendanceLoading(true);
    try {
      const response = await apiService.getStudentAttendance({
        student_id: student._id,
        school_id: student.school_id,
        start_date: startDate,
        end_date: endDate
      });
      
      if (response.success && response.data) {
        setAttendanceRecords(response.data.attendance || []);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendanceRecords([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Fetch attendance when tab changes to academic or dates change
  useEffect(() => {
    if (activeTab === 'academic' && student) {
      fetchAttendance();
    }
  }, [activeTab, student, startDate, endDate]);

  if (loading) {
    return (
      <DetailContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading student details...
        </div>
      </DetailContainer>
    );
  }

  if (error || (!loading && !student)) {
    return (
      <DetailContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Student not found</h2>
          <p>{error || "The student you're looking for doesn't exist or has been removed."}</p>
          <SecondaryButton onClick={handleBack}>
            Back to Students
          </SecondaryButton>
        </div>
      </DetailContainer>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <DetailContainer>
      <HeaderSection>
        <Title>Student Details</Title>
        <ButtonGroup>
          <SecondaryButton onClick={handleBack}>
            Back to Students
          </SecondaryButton>
          <PrimaryButton onClick={handleEdit}>
            Edit Student
          </PrimaryButton>
        </ButtonGroup>
      </HeaderSection>

      <TabContainer>
        <Tab active={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>
          Personal Information
        </Tab>
        <Tab active={activeTab === 'academic'} onClick={() => setActiveTab('academic')}>
          Academic Information
        </Tab>
        <Tab active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
          Documents
        </Tab>
      </TabContainer>

      <TabContent>
        {activeTab === 'personal' && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                  <Avatar hasImage={student.profile?.photo && student.profile.photo.length > 0}>
                    {student.profile?.photo && student.profile.photo.length > 0 ? (
                      <img 
                        src={student.profile.photo[0]} 
                        alt={student.displayname || `${student.firstname || ''} ${student.lastname || ''}`.trim()}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      getInitials(student)
                    )}
                  </Avatar>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                      {student.displayname || `${student.firstname || ''} ${student.lastname || ''}`.trim()}
                    </h2>
                    {student.firstname && student.lastname && (
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                        {student.firstname} {student.lastname}
                      </p>
                    )}
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      Student ID: {student.student_id}
                    </p>
                    <Badge variant={student.status ? 'success' : 'danger'} style={{ marginTop: '0.5rem' }}>
                      {student.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>First Name</InfoLabel>
                    <InfoValue>{student.firstname || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Last Name</InfoLabel>
                    <InfoValue>{student.lastname || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Display Name</InfoLabel>
                    <InfoValue>{student.displayname || 'Not specified'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Student ID</InfoLabel>
                    <InfoValue>{student.student_id}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{student.profile?.email_id || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Phone Number</InfoLabel>
                    <InfoValue>{student.profile?.phone_number?.[0] || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Gender</InfoLabel>
                    <InfoValue>
                      {student.profile?.gender 
                        ? student.profile.gender.charAt(0).toUpperCase() + student.profile.gender.slice(1)
                        : 'N/A'}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Age</InfoLabel>
                    <InfoValue>{student.profile?.age || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Date of Birth</InfoLabel>
                    <InfoValue>
                      {student.profile?.dob 
                        ? new Date(student.profile.dob).toLocaleDateString()
                        : 'N/A'
                      }
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Blood Group</InfoLabel>
                    <InfoValue>{student.profile?.blood_group || 'N/A'}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </CardContent>
            </Card>

            {/* Guardian Information */}
            <Card style={{ marginTop: '2rem' }}>
              <CardHeader>
                <CardTitle>Guardian Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {/* Father Card */}
                  {student.parent_details?.father_name && student.parent_details?.father_phone && (
                    <GuardianCard onClick={() => navigate(`/guardians/${student._id}_father`)}>
                      <GuardianHeader>
                        <GuardianAvatar color="#3b82f6">
                          {student.parent_details.father_name.charAt(0).toUpperCase()}
                        </GuardianAvatar>
                        <GuardianInfo>
                          <GuardianName>{student.parent_details.father_name}</GuardianName>
                          <GuardianRole>Father</GuardianRole>
                        </GuardianInfo>
                      </GuardianHeader>
                      <GuardianDetails>
                        <div>
                          <span style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Phone: </span>
                          <span style={{ color: '#111827' }}>{student.parent_details.father_phone}</span>
                        </div>
                        {student.parent_details.father_email && (
                          <div>
                            <span style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Email: </span>
                            <span style={{ color: '#111827' }}>{student.parent_details.father_email}</span>
                          </div>
                        )}
                        <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', marginTop: '0.5rem' }}>
                          <span style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                            View Details →
                          </span>
                        </div>
                      </GuardianDetails>
                    </GuardianCard>
                  )}

                  {/* Mother Card */}
                  {student.parent_details?.mother_name && student.parent_details?.mother_phone && (
                    <GuardianCard onClick={() => navigate(`/guardians/${student._id}_mother`)}>
                      <GuardianHeader>
                        <GuardianAvatar color="#ec4899">
                          {student.parent_details.mother_name.charAt(0).toUpperCase()}
                        </GuardianAvatar>
                        <GuardianInfo>
                          <GuardianName>{student.parent_details.mother_name}</GuardianName>
                          <GuardianRole>Mother</GuardianRole>
                        </GuardianInfo>
                      </GuardianHeader>
                      <GuardianDetails>
                        <div>
                          <span style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Phone: </span>
                          <span style={{ color: '#111827' }}>{student.parent_details.mother_phone}</span>
                        </div>
                        {student.parent_details.mother_email && (
                          <div>
                            <span style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>Email: </span>
                            <span style={{ color: '#111827' }}>{student.parent_details.mother_email}</span>
                          </div>
                        )}
                        <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', marginTop: '0.5rem' }}>
                          <span style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                            View Details →
                          </span>
                        </div>
                      </GuardianDetails>
                    </GuardianCard>
                  )}

                  {/* No guardians message */}
                  {(!student.parent_details?.father_name || !student.parent_details?.father_phone) &&
                   (!student.parent_details?.mother_name || !student.parent_details?.mother_phone) && (
                    <div style={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#6b7280',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      backgroundColor: '#f9fafb'
                    }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#374151' }}>No Guardian Information</h4>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                        Guardian details are added when registering the student.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card style={{ marginTop: '1rem' }}>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Student Address</InfoLabel>
                    <InfoValue>{student.address?.site || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Landmark</InfoLabel>
                    <InfoValue>{student.address?.landmark || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>State</InfoLabel>
                    <InfoValue>{student.address?.state || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Pincode</InfoLabel>
                    <InfoValue>{student.address?.pincode || 'N/A'}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'academic' && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Class</InfoLabel>
                    <InfoValue>{student.class || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Section</InfoLabel>
                    <InfoValue>{student.section || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Roll Number</InfoLabel>
                    <InfoValue>{student.roll_number || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Class Teacher</InfoLabel>
                    <InfoValue>
                      {student.class_teacher ? (
                        <a 
                          href={`/teachers/${student.class_teacher}`}
                          style={{ color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/teachers/${student.class_teacher}`);
                          }}
                        >
                          View Teacher
                        </a>
                      ) : 'N/A'}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Admission Date</InfoLabel>
                    <InfoValue>
                      {new Date(student.admission_date).toLocaleDateString()}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
              </CardContent>
            </Card>

            {/* Attendance Section */}
            <Card style={{ marginTop: '2rem' }}>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <FormGroup>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </FormGroup>
                  <div style={{ display: 'flex', alignItems: 'end' }}>
                    <SecondaryButton onClick={fetchAttendance} disabled={attendanceLoading}>
                      {attendanceLoading ? 'Loading...' : 'Refresh'}
                    </SecondaryButton>
                  </div>
                </div>

                {attendanceLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Loading attendance records...
                  </div>
                ) : attendanceRecords.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                      No Attendance Records
                    </div>
                    <div>No attendance found for the selected date range.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                      <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <tr>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Date</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Status</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Remarks</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Marked By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceRecords.map((record: any, index: number) => (
                          <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#111827' }}>
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                background: record.status === 'present' ? '#dcfce7' : record.status === 'absent' ? '#fee2e2' : record.status === 'late' ? '#fef3c7' : record.status === 'excused' ? '#ede9fe' : '#cffafe',
                                color: record.status === 'present' ? '#166534' : record.status === 'absent' ? '#991b1b' : record.status === 'late' ? '#92400e' : record.status === 'excused' ? '#6b21a8' : '#155e75'
                              }}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                              {record.remarks || '-'}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                              {record.teacher_id ? getTeacherName(record.teacher_id) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Attendance Summary */}
                {attendanceRecords.length > 0 && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Summary</div>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Days: </span>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#3b82f6' }}>{attendanceRecords.length}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Present: </span>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981' }}>
                          {attendanceRecords.filter(r => r.status === 'present').length}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Absent: </span>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#ef4444' }}>
                          {attendanceRecords.filter(r => r.status === 'absent').length}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Late: </span>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#f59e0b' }}>
                          {attendanceRecords.filter(r => r.status === 'late').length}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Attendance %: </span>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#3b82f6' }}>
                          {((attendanceRecords.filter(r => r.status === 'present').length / attendanceRecords.length) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {student.documents && student.documents.length > 0 ? (
                <div>
                  {student.documents.map((doc, index) => (
                    <DocumentItem key={index}>
                      <DocumentInfo>
                        <DocumentIcon>📄</DocumentIcon>
                        <DocumentText>
                          <div style={{ fontWeight: '500', color: '#111827' }}>{doc.original_name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            Type: {doc.type} | Size: {doc.mime_type}
                          </div>
                        </DocumentText>
                      </DocumentInfo>
                    </DocumentItem>
                  ))}
                </div>
              ) : (
                <InfoValue>No documents uploaded</InfoValue>
              )}
            </CardContent>
          </Card>
        )}
      </TabContent>
    </DetailContainer>
  );
};

export default StudentDetailPage;
