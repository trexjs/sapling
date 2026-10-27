import React from 'react';
import styled from 'styled-components';
import DataTable, { Column } from './DataTable';
import { School } from '../../types';
import { Badge } from '../styled/CommonComponents';

const SchoolLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const SchoolInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SchoolDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const SchoolName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
`;

const SchoolCode = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
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

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StarIcon = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};
  font-size: 0.875rem;
`;

const renderRating = (rating: string) => {
  const numRating = parseFloat(rating);
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarIcon key={i} filled={i <= numRating}>
        ★
      </StarIcon>
    );
  }
  
  return (
    <RatingContainer>
      {stars}
      <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
        ({rating})
      </span>
    </RatingContainer>
  );
};

interface SchoolsTableProps {
  schools: School[];
  loading?: boolean;
  onEdit?: (school: School) => void;
  onDelete?: (school: School) => void;
  onView?: (school: School) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

const SchoolsTable: React.FC<SchoolsTableProps> = ({
  schools,
  loading,
  onEdit,
  onDelete,
  onView,
  pagination
}) => {
  const columns: Column<School>[] = [
    {
      key: 'school_info',
      title: 'School',
      width: '300px',
      render: (_, school) => (
        <SchoolInfo>
          <SchoolLogo 
            src={school.media?.school_logo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0YzRjRGNiIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNiAyMEgyNFYyMkgxNlYyMFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+'} 
            alt={school.school_code}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0YzRjRGNiIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNiAyMEgyNFYyMkgxNlYyMFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+';
            }}
          />
          <SchoolDetails>
            <SchoolName>{school.school_code}</SchoolName>
            <SchoolCode>ID: {school._id.slice(-8)}</SchoolCode>
          </SchoolDetails>
        </SchoolInfo>
      )
    },
    {
      key: 'contact_details',
      title: 'Contact',
      width: '200px',
      render: (_, school) => (
        <ContactInfo>
          <ContactItem>{school.contact_details?.email_id}</ContactItem>
          <ContactItem>{school.contact_details?.phone?.[0]}</ContactItem>
        </ContactInfo>
      )
    },
    {
      key: 'address.state',
      title: 'Location',
      width: '150px',
      render: (_, school) => (
        <div>
          <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
            {school.address?.state}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {school.address?.pincode}
          </div>
        </div>
      )
    },
    {
      key: 'school_type',
      title: 'Type',
      width: '120px',
      render: (_, school) => (
        <Badge variant={school.school_type === 'boarding' ? 'info' : 'success'}>
          {school.school_type === 'boarding' ? 'Boarding' : 'Day School'}
        </Badge>
      )
    },
    {
      key: 'school_rating',
      title: 'Rating',
      width: '120px',
      render: (_, school) => renderRating(school.school_rating || '0')
    },
    {
      key: 'glance_view.facts',
      title: 'Students',
      width: '100px',
      render: (_, school) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '600', fontSize: '1rem' }}>
            {school.glance_view?.facts?.number_of_students || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            students
          </div>
        </div>
      )
    },
    {
      key: 'glance_view.facts',
      title: 'Teachers',
      width: '100px',
      render: (_, school) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '600', fontSize: '1rem' }}>
            {school.glance_view?.facts?.teacher_strength || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            teachers
          </div>
        </div>
      )
    },
    {
      key: 'school_status',
      title: 'Status',
      width: '100px',
      render: (_, school) => (
        <Badge variant={school.school_status ? 'success' : 'danger'}>
          {school.school_status ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      title: 'Created',
      width: '120px',
      render: (_, school) => (
        <div style={{ fontSize: '0.875rem' }}>
          {new Date(school.createdAt).toLocaleDateString()}
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={schools}
      columns={columns}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      pagination={pagination}
      emptyMessage="No schools found. Create your first school to get started."
    />
  );
};

export default SchoolsTable;
