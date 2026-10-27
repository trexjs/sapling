import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../services/api';
import { toast } from '../utils/toast';
import { Card, CardHeader, CardTitle } from '../components/styled/CommonComponents';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const ChildrenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ChildCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const ChildHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ChildAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ChildInfo = styled.div`
  flex: 1;
`;

const ChildName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const ChildDetails = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin: 2rem auto;
  display: block;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Get parent profile
      const profile = await apiService.getProfile();
      
      // Find parent by user email
      const parentsResponse = await apiService.getParents();
      const parent = parentsResponse.data?.find((p: any) => p.email === user.email);
      
      if (parent) {
        setParentData(parent);
        
        // Get children details
        const childrenResponse = await apiService.getParentChildren(parent._id);
        if (childrenResponse.success && childrenResponse.data) {
          setChildren(childrenResponse.data);
        }
      }
    } catch (error: any) {
      console.error('Error fetching parent data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleChildClick = (child: any) => {
    // Navigate to student detail page
    navigate(`/students/${child.student_id._id}`);
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <WelcomeSection>
        <WelcomeTitle>
          Welcome, {parentData?.firstname} {parentData?.lastname}
        </WelcomeTitle>
        <WelcomeText>
          View and manage your children's academic information
        </WelcomeText>
      </WelcomeSection>

      {children.length === 0 ? (
        <Card>
          <EmptyState>
            <h3>No Children Found</h3>
            <p>No students are currently associated with your account.</p>
            <p>Please contact the school administration for assistance.</p>
          </EmptyState>
        </Card>
      ) : (
        <ChildrenGrid>
          {children.map((child) => {
            const student = child.student_id;
            return (
              <ChildCard key={child._id} onClick={() => handleChildClick(child)}>
                <ChildHeader>
                  <ChildAvatar>
                    {getInitials(student.firstname, student.lastname)}
                  </ChildAvatar>
                  <ChildInfo>
                    <ChildName>
                      {student.firstname} {student.lastname}
                    </ChildName>
                    <ChildDetails>
                      {child.relationship.charAt(0).toUpperCase() + child.relationship.slice(1)}
                    </ChildDetails>
                  </ChildInfo>
                </ChildHeader>

                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Student ID</InfoLabel>
                    <InfoValue>{student.student_id || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Class</InfoLabel>
                    <InfoValue>
                      {student.class && student.section 
                        ? `${student.class} - ${student.section}`
                        : student.class || 'N/A'}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{student.profile?.email_id || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Status</InfoLabel>
                    <InfoValue>
                      {student.status ? (
                        <span style={{ color: '#10b981' }}>Active</span>
                      ) : (
                        <span style={{ color: '#ef4444' }}>Inactive</span>
                      )}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
              </ChildCard>
            );
          })}
        </ChildrenGrid>
      )}
    </PageContainer>
  );
};

export default ParentDashboard;
