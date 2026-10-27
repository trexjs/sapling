import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import SchoolsTable from '../components/tables/SchoolsTable';
import { PrimaryButton, SecondaryButton } from '../components/styled/CommonComponents';
import { School } from '../types';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SchoolsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    schools, 
    loading, 
    fetchSchools, 
    createSchool, 
    updateSchool, 
    deleteSchool 
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Only fetch if we don't have schools data yet
    if (schools.length === 0 && !loading) {
      fetchSchools();
    }
  }, []); // Empty dependency array - only run once on mount

  const handleCreateSchool = async (schoolData: Partial<School>) => {
    try {
      await createSchool(schoolData);
    } catch (error) {
      console.error('Error creating school:', error);
    }
  };

  const handleEditSchool = (school: School) => {
    navigate(`/schools/${school._id}/edit`);
  };

  const handleDeleteSchool = async (school: School) => {
    if (window.confirm(`Are you sure you want to delete ${school.school_code}?`)) {
      try {
        await deleteSchool(school._id);
      } catch (error) {
        console.error('Error deleting school:', error);
      }
    }
  };

  const handleViewSchool = (school: School) => {
    navigate(`/schools/${school._id}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(schools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchools = schools.slice(startIndex, endIndex);

  const pagination = {
    currentPage,
    totalPages,
    totalItems: schools.length,
    itemsPerPage,
    onPageChange: setCurrentPage
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>Schools Management</PageTitle>
        <ButtonGroup>
          <SecondaryButton onClick={() => fetchSchools()}>
            Refresh
          </SecondaryButton>
          <PrimaryButton onClick={() => navigate('/schools/create')}>
            Add School
          </PrimaryButton>
        </ButtonGroup>
      </PageHeader>

      <SchoolsTable
        schools={currentSchools}
        loading={loading}
        onEdit={handleEditSchool}
        onDelete={handleDeleteSchool}
        onView={handleViewSchool}
        pagination={pagination}
      />
    </div>
  );
};

export default SchoolsPage;
