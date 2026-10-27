import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton, Badge } from '../components/styled/CommonComponents';
import { Teacher } from '../types';
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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
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
  padding: 1rem 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div<{ hasImage?: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.hasImage ? 'transparent' : '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 1rem;
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

const SkillsSection = styled.div`
  margin-top: 2rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SkillTag = styled.span`
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
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

const getInitials = (teacher: Teacher) => {
  if (teacher.firstname && teacher.lastname) {
    return (teacher.firstname[0] + teacher.lastname[0]).toUpperCase();
  }
  return '??';
};

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { teachers, loading } = useApp();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [teacherLoading, setTeacherLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'documents'>('personal');

  useEffect(() => {
    const loadTeacher = async () => {
      if (!id) {
        setTeacherLoading(false);
        return;
      }

      try {
        setTeacherLoading(true);
        setError(null);
        
        // First, try to find the teacher in the already-loaded teachers array
        const foundTeacher = teachers.find(t => t._id === id);
        
        if (foundTeacher) {
          setTeacher(foundTeacher);
          setTeacherLoading(false);
        } else {
          // If not found in local array, fetch from API
          console.log('Teacher not found in local array, fetching from API...');
          const response = await apiService.getTeacherById(id);
          
          if (response.success && response.data) {
            setTeacher(response.data);
          } else {
            setError('Teacher not found');
          }
          setTeacherLoading(false);
        }
      } catch (err) {
        console.error('Error loading teacher:', err);
        setError('Failed to load teacher details');
        setTeacherLoading(false);
      }
    };

    loadTeacher();
  }, [id, teachers]);

  const handleEdit = () => {
    if (teacher) {
      navigate(`/teachers/${teacher._id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/teachers');
  };

  if (loading || teacherLoading) {
    return (
      <DetailContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading teacher details...
        </div>
      </DetailContainer>
    );
  }

  if (error || !teacher) {
    return (
      <DetailContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Teacher not found</h2>
          <p>{error || "The teacher you're looking for doesn't exist or has been removed."}</p>
          <SecondaryButton onClick={handleBack}>
            Back to Teachers
          </SecondaryButton>
        </div>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <HeaderSection>
        <Title>Teacher Details</Title>
        <ButtonGroup>
          <SecondaryButton onClick={handleBack}>
            Back to Teachers
          </SecondaryButton>
          <PrimaryButton onClick={handleEdit}>
            Edit Teacher
          </PrimaryButton>
        </ButtonGroup>
      </HeaderSection>

      <TabContainer>
        <Tab active={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>
          Personal Information
        </Tab>
        <Tab active={activeTab === 'professional'} onClick={() => setActiveTab('professional')}>
          Professional Information
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                  <Avatar hasImage={teacher.profile?.photo && teacher.profile.photo.length > 0}>
                    {teacher.profile?.photo && teacher.profile.photo.length > 0 ? (
                      <img 
                        src={teacher.profile.photo[0]} 
                        alt={teacher.displayname || `${teacher.firstname || ''} ${teacher.lastname || ''}`.trim()}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      getInitials(teacher)
                    )}
                  </Avatar>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                      {teacher.displayname || `${teacher.firstname || ''} ${teacher.lastname || ''}`.trim()}
                    </h2>
                    {teacher.firstname && teacher.lastname && (
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                        {teacher.firstname} {teacher.lastname}
                      </p>
                    )}
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      Teacher ID: {teacher.teacher_id}
                    </p>
                    <Badge variant={teacher.status ? 'success' : 'danger'} style={{ marginTop: '0.5rem' }}>
                      {teacher.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>First Name</InfoLabel>
                    <InfoValue>{teacher.firstname || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Last Name</InfoLabel>
                    <InfoValue>{teacher.lastname || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Display Name</InfoLabel>
                    <InfoValue>{teacher.displayname || 'Not specified'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Teacher ID</InfoLabel>
                    <InfoValue>{teacher.teacher_id}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{teacher.profile?.email_id || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Phone Number</InfoLabel>
                    <InfoValue>{teacher.profile?.phone_number?.[0] || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Gender</InfoLabel>
                    <InfoValue>
                      {teacher.profile?.gender 
                        ? teacher.profile.gender.charAt(0).toUpperCase() + teacher.profile.gender.slice(1)
                        : 'N/A'}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Age</InfoLabel>
                    <InfoValue>{teacher.profile?.age || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Blood Group</InfoLabel>
                    <InfoValue>{teacher.profile?.blood_group || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Joining Date</InfoLabel>
                    <InfoValue>
                      {teacher.joining_date 
                        ? new Date(teacher.joining_date).toLocaleDateString()
                        : 'N/A'
                      }
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
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
                    <InfoLabel>Address</InfoLabel>
                    <InfoValue>{teacher.address?.site || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>City</InfoLabel>
                    <InfoValue>{teacher.address?.city || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>State</InfoLabel>
                    <InfoValue>{teacher.address?.state || 'N/A'}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>Pincode</InfoLabel>
                    <InfoValue>{teacher.address?.pincode || 'N/A'}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'professional' && (
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsSection>
                <h3>Expertise Fields</h3>
                <SkillsGrid>
                  {teacher.profile?.expertised_fields && teacher.profile.expertised_fields.length > 0 ? (
                    teacher.profile.expertised_fields.map((field, index) => (
                      <SkillTag key={index}>{field}</SkillTag>
                    ))
                  ) : (
                    <InfoValue>No expertise fields specified</InfoValue>
                  )}
                </SkillsGrid>
              </SkillsSection>

              <SkillsSection>
                <h3>Experience</h3>
                <SkillsGrid>
                  {teacher.profile?.experience && teacher.profile.experience.length > 0 ? (
                    teacher.profile.experience.map((exp, index) => (
                      <SkillTag key={index}>{exp}</SkillTag>
                    ))
                  ) : (
                    <InfoValue>No experience details specified</InfoValue>
                  )}
                </SkillsGrid>
              </SkillsSection>
            </CardContent>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {teacher.documents && teacher.documents.length > 0 ? (
                <div>
                  {teacher.documents.map((doc, index) => (
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

export default TeacherDetailPage;
