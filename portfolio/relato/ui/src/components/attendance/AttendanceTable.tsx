import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../../services/api';
import { Student, AttendanceRecord } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton, Select, Input, FormGroup, Label } from '../styled/CommonComponents';

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const TableHeader = styled.thead`
  background: #f9fafb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  
  &:hover {
    background: #f9fafb;
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableCell = styled.td`
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #111827;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'present': return '#dcfce7';
      case 'absent': return '#fee2e2';
      case 'late': return '#fef3c7';
      case 'excused': return '#ede9fe';
      case 'half_day': return '#cffafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'present': return '#166534';
      case 'absent': return '#991b1b';
      case 'late': return '#92400e';
      case 'excused': return '#6b21a8';
      case 'half_day': return '#155e75';
      default: return '#374151';
    }
  }};
`;

const StudentName = styled.div`
  font-weight: 500;
  color: #111827;
`;

const StudentDetails = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  background: white;
  color: ${props => props.variant === 'edit' ? '#2563eb' : '#dc2626'};
  
  &:hover {
    background: #f9fafb;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

interface AttendanceTableProps {
  schoolId: string;
  teacherId: string;
  selectedDate?: string;
  classFilter?: string;
  sectionFilter?: string;
  onEdit?: (studentId: string, date: string) => void;
  onDelete?: (studentId: string, date: string) => void;
}

interface StudentAttendanceData {
  student_id: string;
  student_name: string;
  status: string;
  remarks: string;
  marked_at: string | null;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  schoolId,
  teacherId,
  selectedDate,
  classFilter,
  sectionFilter,
  onEdit,
  onDelete
}) => {
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAttendanceData();
  }, [schoolId, teacherId, date, classFilter, sectionFilter]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getClassAttendance(schoolId, teacherId, {
        date: date,
        class_name: classFilter,
        section: sectionFilter
      });

      if (response.success) {
        setAttendanceData(response.data.attendance || []);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
  };

  const handleEdit = (studentId: string) => {
    onEdit?.(studentId, date);
  };

  const handleDelete = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        const response = await apiService.deleteAttendanceRecord(schoolId, studentId, date);
        if (response.success) {
          alert('Attendance record deleted successfully!');
          fetchAttendanceData();
          onDelete?.(studentId, date);
        } else {
          alert('Failed to delete attendance record.');
        }
      } catch (error) {
        console.error('Error deleting attendance record:', error);
        alert('Error deleting attendance record.');
      }
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'excused': return 'Excused';
      case 'half_day': return 'Half Day';
      default: return status;
    }
  };

  const formatDateTime = (dateTime: string | null): string => {
    if (!dateTime) return 'Not marked';
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <LoadingState>Loading attendance data...</LoadingState>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <FiltersContainer>
          <FormGroup>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="class">Class</Label>
            <Select
              id="class"
              value={classFilter || ''}
              onChange={(e) => {
                // Handle class filter change
              }}
            >
              <option value="">All Classes</option>
              {/* Add class options here */}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="section">Section</Label>
            <Select
              id="section"
              value={sectionFilter || ''}
              onChange={(e) => {
                // Handle section filter change
              }}
            >
              <option value="">All Sections</option>
              {/* Add section options here */}
            </Select>
          </FormGroup>
          <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
            <SecondaryButton onClick={fetchAttendanceData}>
              Refresh
            </SecondaryButton>
          </div>
        </FiltersContainer>

        {attendanceData.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              No attendance records found
            </div>
            <div>No attendance has been marked for the selected date and filters.</div>
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Student</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Remarks</TableHeaderCell>
                  <TableHeaderCell>Marked At</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {attendanceData.map((record) => (
                  <TableRow key={record.student_id}>
                    <TableCell>
                      <StudentName>{record.student_name}</StudentName>
                      <StudentDetails>ID: {record.student_id}</StudentDetails>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status}>
                        {getStatusText(record.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {record.remarks || '-'}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(record.marked_at)}
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <ActionButton
                          variant="edit"
                          onClick={() => handleEdit(record.student_id)}
                        >
                          Edit
                        </ActionButton>
                        <ActionButton
                          variant="delete"
                          onClick={() => handleDelete(record.student_id)}
                        >
                          Delete
                        </ActionButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
