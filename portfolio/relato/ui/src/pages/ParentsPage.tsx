import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Student } from '../types';
import { apiService } from '../services/api';
import { toast } from '../utils/toast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  PrimaryButton 
} from '../components/styled/CommonComponents';

const PageContainer = styled.div`
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
  font-weight: 700;
  color: #111827;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
`;

const Tr = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &.view {
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
    }
  }

  &.delete {
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
    }
  }
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  &.active {
    background: #d1fae5;
    color: #065f46;
  }
  
  &.inactive {
    background: #fee2e2;
    color: #991b1b;
  }
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

interface ParentData {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  studentName: string;
  studentId: string; // Display ID for UI
  studentDbId: string; // MongoDB _id for navigation
  class: string;
  section: string;
}

const ParentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState<ParentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      setLoading(true);
      // Get all students to extract parent information
      const response = await apiService.getStudents();
      if (response.success && response.data) {
        const parentData: ParentData[] = [];
        
        response.data.forEach((student: Student) => {
          if (student.parent_details) {
            // Add father data if exists
            if (student.parent_details.father_name && student.parent_details.father_phone) {
              parentData.push({
                id: `${student._id}_father`,
                name: student.parent_details.father_name,
                relationship: 'Father',
                phone: student.parent_details.father_phone,
                email: student.parent_details.father_email || '',
                studentName: `${student.firstname} ${student.lastname}`,
                studentId: student.student_id || '', // Display ID
                studentDbId: student._id, // MongoDB _id for navigation
                class: student.class || '',
                section: student.section || ''
              });
            }
            
            // Add mother data if exists
            if (student.parent_details.mother_name && student.parent_details.mother_phone) {
              parentData.push({
                id: `${student._id}_mother`,
                name: student.parent_details.mother_name,
                relationship: 'Mother',
                phone: student.parent_details.mother_phone,
                email: student.parent_details.mother_email || '',
                studentName: `${student.firstname} ${student.lastname}`,
                studentId: student.student_id || '', // Display ID
                studentDbId: student._id, // MongoDB _id for navigation
                class: student.class || '',
                section: student.section || ''
              });
            }
          }
        });
        
        setParents(parentData);
      }
    } catch (error: any) {
      toast.error('Failed to fetch parents');
      console.error('Error fetching parents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (parent: ParentData) => {
    // Navigate to student detail page using MongoDB _id
    navigate(`/students/${parent.studentDbId}`);
  };

  const handleViewGuardian = (guardianId: string) => {
    // Navigate to guardian detail page
    navigate(`/guardians/${guardianId}`);
  };

  const handleCreateNew = () => {
    // TODO: Create ParentForm component and add route for /parents/new
    toast.info('Parent creation form coming soon!');
    // navigate('/parents/new');
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
      <Header>
        <Title>Parents / Guardians</Title>
        <PrimaryButton onClick={handleCreateNew}>
          Add New Parent
        </PrimaryButton>
      </Header>

      <Card>
        <CardHeader>
          <CardTitle>All Parents ({parents.length})</CardTitle>
        </CardHeader>
        
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Parent Name</Th>
                <Th>Relationship</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Student</Th>
                <Th>Class</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {parents.length === 0 ? (
                <Tr>
                  <Td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    No parent/guardian information found. Parents are added when students are registered.
                  </Td>
                </Tr>
              ) : (
                parents.map((parent) => (
                  <Tr key={parent.id}>
                    <Td>{parent.name}</Td>
                    <Td>
                      <Badge className={parent.relationship === 'Father' ? 'active' : 'inactive'}>
                        {parent.relationship}
                      </Badge>
                    </Td>
                    <Td>{parent.phone}</Td>
                    <Td>{parent.email || 'N/A'}</Td>
                    <Td>{parent.studentName}</Td>
                    <Td>{parent.class && parent.section ? `${parent.class} - ${parent.section}` : 'N/A'}</Td>
                    <Td>
                      <ActionButton 
                        className="view" 
                        onClick={() => handleViewStudent(parent)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        View Student
                      </ActionButton>
                      <ActionButton 
                        className="view" 
                        onClick={() => handleViewGuardian(parent.id)}
                      >
                        View Guardian
                      </ActionButton>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>
      </Card>
    </PageContainer>
  );
};

export default ParentsPage;
