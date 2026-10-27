import React from 'react';
import styled from 'styled-components';
import DataTable, { Column } from './DataTable';
import { Student } from '../../types';
import { Badge } from '../styled/CommonComponents';

const StudentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StudentDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
`;

const StudentId = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
`;

const ClassInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClassBadge = styled(Badge)`
  background-color: #dbeafe;
  color: #1e40af;
`;

const SectionBadge = styled(Badge)`
  background-color: #fef3c7;
  color: #92400e;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ContactItem = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const ParentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ParentItem = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const getInitials = (student: Student) => {
  // Use firstname and lastname
  if (student.firstname && student.lastname) {
    return (student.firstname[0] + student.lastname[0]).toUpperCase();
  }
  return '??';
};

interface StudentsTableProps {
  students: Student[];
  loading?: boolean;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  onView?: (student: Student) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  loading,
  onEdit,
  onDelete,
  onView,
  pagination
}) => {
  const columns: Column<Student>[] = [
    {
      key: 'student_info',
      title: 'Student',
      width: '250px',
      render: (_, student) => (
        <StudentInfo>
          <StudentAvatar>
            {getInitials(student)}
          </StudentAvatar>
          <StudentDetails>
            <StudentName>
              {student.displayname || `${student.firstname || ''} ${student.lastname || ''}`.trim()}
            </StudentName>
            <StudentId>ID: {student.student_id}</StudentId>
            {student.firstname && student.lastname && (
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {student.firstname} {student.lastname}
              </div>
            )}
          </StudentDetails>
        </StudentInfo>
      )
    },
    {
      key: 'class_info',
      title: 'Class',
      width: '120px',
      render: (_, student) => (
        <ClassInfo>
          <ClassBadge>{student.class}</ClassBadge>
          <SectionBadge>{student.section}</SectionBadge>
        </ClassInfo>
      )
    },
    {
      key: 'roll_number',
      title: 'Roll No.',
      width: '100px',
      render: (_, student) => (
        <div style={{ fontWeight: '500', textAlign: 'center' }}>
          {student.roll_number}
        </div>
      )
    },
    {
      key: 'profile.email_id',
      title: 'Contact',
      width: '200px',
      render: (_, student) => (
        <ContactInfo>
          <ContactItem>{student.profile?.email_id}</ContactItem>
          <ContactItem>{student.profile?.phone_number?.[0]}</ContactItem>
        </ContactInfo>
      )
    },
    {
      key: 'parent_details',
      title: 'Parents',
      width: '200px',
      render: (_, student) => (
        <ParentInfo>
          <ParentItem>Father: {student.parent_details?.father_name}</ParentItem>
          <ParentItem>Mother: {student.parent_details?.mother_name}</ParentItem>
        </ParentInfo>
      )
    },
    {
      key: 'profile.gender',
      title: 'Gender',
      width: '100px',
      render: (_, student) => (
        <Badge variant="info">
          {student.profile?.gender 
            ? student.profile.gender.charAt(0).toUpperCase() + student.profile.gender.slice(1)
            : 'N/A'}
        </Badge>
      )
    },
    {
      key: 'profile.age',
      title: 'Age',
      width: '80px',
      render: (_, student) => (
        <div style={{ textAlign: 'center', fontWeight: '500' }}>
          {student.profile?.age || 'N/A'}
        </div>
      )
    },
    {
      key: 'address.state',
      title: 'Location',
      width: '120px',
      render: (_, student) => (
        <div>
          <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
            {student.address?.state}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {student.address?.pincode}
          </div>
        </div>
      )
    },
    {
      key: 'admission_date',
      title: 'Admitted',
      width: '120px',
      render: (_, student) => (
        <div style={{ fontSize: '0.875rem' }}>
          {new Date(student.admission_date).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      width: '100px',
      render: (_, student) => (
        <Badge variant={student.status ? 'success' : 'danger'}>
          {student.status ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  return (
    <DataTable
      data={students}
      columns={columns}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      pagination={pagination}
      emptyMessage="No students found. Add students to your school to get started."
    />
  );
};

export default StudentsTable;
