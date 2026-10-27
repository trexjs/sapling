import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/styled/CommonComponents';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
`;

const RecentActivityContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: #3b82f6;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
`;

const ActivityTime = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    schools, 
    teachers, 
    students, 
    loading,
    user, 
    fetchSchools, 
    fetchTeachers, 
    fetchStudents 
  } = useApp();

  useEffect(() => {
    // Redirect parents to their dashboard
    if (user && user.user_type === 'parent') {
      navigate('/parent-dashboard');
      return;
    }

    // Only fetch data if we don't have any data yet
    if (schools.length === 0 && teachers.length === 0 && students.length === 0 && !loading) {
      const loadData = async () => {
        try {
          await Promise.all([
            fetchSchools(),
            fetchTeachers(),
            fetchStudents()
          ]);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      };

      loadData();
    }
  }, []); // Empty dependency array - only run once on mount

  const stats = [
    {
      title: 'Total Schools',
      value: schools.length,
      color: '#3b82f6'
    },
    {
      title: 'Total Teachers',
      value: teachers.length,
      color: '#10b981'
    },
    {
      title: 'Total Students',
      value: students.length,
      color: '#f59e0b'
    },
    {
      title: 'Active Schools',
      value: schools.filter(school => school.school_status).length,
      color: '#ef4444'
    }
  ];

  const recentSchools = schools.slice(0, 5);
  const recentTeachers = teachers.slice(0, 5);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>
        Dashboard
      </h1>

      <DashboardContainer>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <CardContent>
              <StatNumber style={{ color: stat.color }}>
                {stat.value}
              </StatNumber>
              <StatLabel>{stat.title}</StatLabel>
            </CardContent>
          </StatCard>
        ))}
      </DashboardContainer>

      <RecentActivityContainer>
        <Card>
          <CardHeader>
            <CardTitle>Recent Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityList>
              {recentSchools.length > 0 ? (
                recentSchools.map((school, index) => (
                  <ActivityItem key={index}>
                    <ActivityIcon>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityTitle>{school.school_code}</ActivityTitle>
                      <ActivityTime>
                        Created {new Date(school.createdAt).toLocaleDateString()}
                      </ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No schools found
                </div>
              )}
            </ActivityList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityList>
              {recentTeachers.length > 0 ? (
                recentTeachers.map((teacher, index) => (
                  <ActivityItem key={index}>
                    <ActivityIcon>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityTitle>{teacher.name}</ActivityTitle>
                      <ActivityTime>
                        Joined {new Date(teacher.joining_date).toLocaleDateString()}
                      </ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No teachers found
                </div>
              )}
            </ActivityList>
          </CardContent>
        </Card>
      </RecentActivityContainer>
    </div>
  );
};

export default Dashboard;
