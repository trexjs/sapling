import React from 'react';
import styled from 'styled-components';
import DataTable, { Column } from './DataTable';
import { Teacher } from '../../types';
import { Badge } from '../styled/CommonComponents';

const TeacherAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const TeacherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TeacherDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TeacherName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
`;

const TeacherId = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
`;

const ExpertiseContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const ExpertiseTag = styled.span`
  background-color: #e0e7ff;
  color: #3730a3;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
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

const ExperienceContainer = styled.div`
  max-width: 200px;
`;

const ExperienceItem = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const getInitials = (teacher: Teacher) => {
  // Use firstname and lastname
  if (teacher.firstname && teacher.lastname) {
    return (teacher.firstname[0] + teacher.lastname[0]).toUpperCase();
  }
  return '??';
};

interface TeachersTableProps {
  teachers: Teacher[];
  loading?: boolean;
  onEdit?: (teacher: Teacher) => void;
  onDelete?: (teacher: Teacher) => void;
  onView?: (teacher: Teacher) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

const TeachersTable: React.FC<TeachersTableProps> = ({
  teachers,
  loading,
  onEdit,
  onDelete,
  onView,
  pagination
}) => {
  const columns: Column<Teacher>[] = [
    {
      key: 'teacher_info',
      title: 'Teacher',
      width: '250px',
      render: (_, teacher) => (
        <TeacherInfo>
          <TeacherAvatar>
            {getInitials(teacher)}
          </TeacherAvatar>
          <TeacherDetails>
            <TeacherName>
              {teacher.displayname || `${teacher.firstname || ''} ${teacher.lastname || ''}`.trim()}
            </TeacherName>
            <TeacherId>ID: {teacher.teacher_id}</TeacherId>
            {teacher.firstname && teacher.lastname && (
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {teacher.firstname} {teacher.lastname}
              </div>
            )}
          </TeacherDetails>
        </TeacherInfo>
      )
    },
    {
      key: 'profile.email_id',
      title: 'Contact',
      width: '200px',
      render: (_, teacher) => (
        <ContactInfo>
          <ContactItem>{teacher.profile?.email_id}</ContactItem>
          <ContactItem>{teacher.profile?.phone_number?.[0]}</ContactItem>
        </ContactInfo>
      )
    },
    {
      key: 'profile.expertised_fields',
      title: 'Expertise',
      width: '200px',
      render: (_, teacher) => (
        <ExpertiseContainer>
          {teacher.profile?.expertised_fields?.slice(0, 2).map((field, index) => (
            <ExpertiseTag key={index}>{field}</ExpertiseTag>
          ))}
          {teacher.profile?.expertised_fields?.length > 2 && (
            <ExpertiseTag>+{teacher.profile.expertised_fields.length - 2}</ExpertiseTag>
          )}
        </ExpertiseContainer>
      )
    },
    {
      key: 'profile.experience',
      title: 'Experience',
      width: '200px',
      render: (_, teacher) => (
        <ExperienceContainer>
          {teacher.profile?.experience?.slice(0, 2).map((exp, index) => (
            <ExperienceItem key={index}>{exp}</ExperienceItem>
          ))}
          {teacher.profile?.experience?.length > 2 && (
            <ExperienceItem>+{teacher.profile.experience.length - 2} more</ExperienceItem>
          )}
        </ExperienceContainer>
      )
    },
    {
      key: 'profile.gender',
      title: 'Gender',
      width: '100px',
      render: (_, teacher) => (
        <Badge variant="info">
          {teacher.profile?.gender 
            ? teacher.profile.gender.charAt(0).toUpperCase() + teacher.profile.gender.slice(1)
            : 'N/A'}
        </Badge>
      )
    },
    {
      key: 'profile.age',
      title: 'Age',
      width: '80px',
      render: (_, teacher) => (
        <div style={{ textAlign: 'center', fontWeight: '500' }}>
          {teacher.profile?.age || 'N/A'}
        </div>
      )
    },
    {
      key: 'address.state',
      title: 'Location',
      width: '120px',
      render: (_, teacher) => (
        <div>
          <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
            {teacher.address?.state}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {teacher.address?.pincode}
          </div>
        </div>
      )
    },
    {
      key: 'joining_date',
      title: 'Joined',
      width: '120px',
      render: (_, teacher) => (
        <div style={{ fontSize: '0.875rem' }}>
          {new Date(teacher.joining_date).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      width: '100px',
      render: (_, teacher) => (
        <Badge variant={teacher.status ? 'success' : 'danger'}>
          {teacher.status ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  return (
    <DataTable
      data={teachers}
      columns={columns}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      pagination={pagination}
      emptyMessage="No teachers found. Add teachers to your school to get started."
    />
  );
};

export default TeachersTable;
