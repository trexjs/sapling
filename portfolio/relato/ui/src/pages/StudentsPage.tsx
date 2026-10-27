import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import StudentsTable from '../components/tables/StudentsTable';
import { PrimaryButton, SecondaryButton } from '../components/styled/CommonComponents';
import { Student } from '../types';

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

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    students, 
    loading, 
    fetchStudents, 
    deleteStudent 
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Only fetch if we don't have data yet
    if ( students.length === 0 && !loading) {
      const loadData = async () => {
        try {
          await fetchStudents();
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };

      loadData();
    }
  }, []); // Empty dependency array - only run once on mount

  const handleEditStudent = (student: Student) => {
    navigate(`/students/${student._id}/edit`);
  };

  const handleDeleteStudent = async (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        await deleteStudent(student._id);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleViewStudent = (student: Student) => {
    navigate(`/students/${student._id}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = students.slice(startIndex, endIndex);

  const pagination = {
    currentPage,
    totalPages,
    totalItems: students.length,
    itemsPerPage,
    onPageChange: setCurrentPage
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>Students Management</PageTitle>
        <ButtonGroup>
          <SecondaryButton onClick={() => fetchStudents()}>
            Refresh
          </SecondaryButton>
          <PrimaryButton onClick={() => navigate('/students/create')}>
            Add Student
          </PrimaryButton>
        </ButtonGroup>
      </PageHeader>

      <StudentsTable
        students={currentStudents}
        loading={loading}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        onView={handleViewStudent}
        pagination={pagination}
      />
    </div>
  );
};

export default StudentsPage;
