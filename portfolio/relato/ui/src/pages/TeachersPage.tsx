import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import TeachersTable from '../components/tables/TeachersTable';
import { PrimaryButton, SecondaryButton } from '../components/styled/CommonComponents';
import { Teacher } from '../types';

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

const TeachersPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    teachers, 
    schools, 
    loading, 
    fetchTeachers, 
    fetchSchools, 
    deleteTeacher 
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Only fetch if we don't have data yet
    if ((teachers.length === 0 || schools.length === 0) && !loading) {
      const loadData = async () => {
        try {
          await Promise.all([
            fetchTeachers(),
            fetchSchools()
          ]);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };

      loadData();
    }
  }, []); // Empty dependency array - only run once on mount

  const handleEditTeacher = (teacher: Teacher) => {
    navigate(`/teachers/${teacher._id}/edit`);
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      try {
        await deleteTeacher(teacher.teacher_id);
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  const handleViewTeacher = (teacher: Teacher) => {
    navigate(`/teachers/${teacher._id}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(teachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeachers = teachers.slice(startIndex, endIndex);

  const pagination = {
    currentPage,
    totalPages,
    totalItems: teachers.length,
    itemsPerPage,
    onPageChange: setCurrentPage
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>Teachers Management</PageTitle>
        <ButtonGroup>
          <SecondaryButton onClick={() => fetchTeachers()}>
            Refresh
          </SecondaryButton>
          <PrimaryButton onClick={() => navigate('/teachers/create')}>
            Add Teacher
          </PrimaryButton>
        </ButtonGroup>
      </PageHeader>

      <TeachersTable
        teachers={currentTeachers}
        loading={loading}
        onEdit={handleEditTeacher}
        onDelete={handleDeleteTeacher}
        onView={handleViewTeacher}
        pagination={pagination}
      />
    </div>
  );
};

export default TeachersPage;
