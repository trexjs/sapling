import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton } from '../styled/CommonComponents';

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const TableHeader = styled.thead`
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
`;

const TableRow = styled.tr<{ clickable?: boolean }>`
  border-bottom: 1px solid #e5e7eb;
  
  &:hover {
    background: ${props => props.clickable ? '#f0f9ff' : '#f9fafb'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableCell = styled.td<{ clickable?: boolean }>`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #111827;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2563eb;
`;

const StatusSelect = styled.select<{ status: string }>`
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  font-weight: 500;
  cursor: pointer;
  color: ${props => {
    switch (props.status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'excused': return '#8b5cf6';
      case 'half_day': return '#06b6d4';
      default: return '#374151';
    }
  }};
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const RemarksInput = styled.input`
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 100%;
  max-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const BulkActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const BulkActionButton = styled.button<{ variant: string }>`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  background: white;
  transition: all 0.2s;
  color: ${props => {
    switch (props.variant) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'excused': return '#8b5cf6';
      case 'half_day': return '#06b6d4';
      default: return '#374151';
    }
  }};
  
  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'present': return '#dcfce7';
        case 'absent': return '#fee2e2';
        case 'late': return '#fef3c7';
        case 'excused': return '#ede9fe';
        case 'half_day': return '#cffafe';
        default: return '#f9fafb';
      }
    }};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SummaryBar = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryNumber = styled.span<{ color: string }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.color};
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const StudentName = styled.div`
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.125rem;
`;

const StudentDetails = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

interface AttendanceFormProps {
  schoolId: string;
  teacherId: string;
  selectedDate: string;
  classFilter?: string;
  sectionFilter?: string;
  onAttendanceMarked?: () => void;
}

interface StudentAttendance {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day';
  remarks: string;
  isSelected: boolean;
  hasExistingRecord?: boolean;
  markedAt?: string;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  schoolId,
  teacherId,
  selectedDate,
  classFilter,
  sectionFilter,
  onAttendanceMarked
}) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [attendanceFetchError, setAttendanceFetchError] = useState<string>('');
  const [hasExistingRecords, setHasExistingRecords] = useState(false);

  const fetchStudentsAndAttendance = useCallback(async () => {
    if (!classFilter || !sectionFilter) {
      setStudents([]);
      return;
    }

    setLoading(true);
    setAttendanceFetchError('');
    try {
      // Fetch students for the class and section
      const studentsResponse = await apiService.getStudents({
        school_id: schoolId,
        status: true
      });

      if (studentsResponse.success) {
        const allStudents = studentsResponse.data || [];
        
        // Filter students by class and section
        const filteredStudents = allStudents.filter(
          (s: any) => s.class === classFilter && s.section === sectionFilter
        );

        // Try to fetch existing attendance for the date
        let existingAttendance: any = {};
        
        if (teacherId) {
          try {
            const attendanceResponse = await apiService.getClassAttendance(schoolId, teacherId, {
              date: selectedDate,
              class_name: classFilter,
              section: sectionFilter
            });
            if (attendanceResponse.success && attendanceResponse.data?.attendance) {
              attendanceResponse.data.attendance.forEach((record: any) => {
                existingAttendance[record.student_id] = record;
              });
              const recordCount = Object.keys(existingAttendance).length;
              console.log(`Loaded ${recordCount} existing attendance records`);
              setHasExistingRecords(recordCount > 0);
              setAttendanceFetchError('');
            } else {
              console.log('No existing attendance found, starting fresh');
              setHasExistingRecords(false);
            }
          } catch (error: any) {
            // Log the error for debugging but don't fail
            const errorMsg = error.response?.data?.message || error.message;
            console.log('Could not fetch existing attendance:', errorMsg);
            console.log('Starting with fresh attendance - all students will default to present');
            setAttendanceFetchError(errorMsg);
          }
        }

        // Map students to attendance format
        const studentsData: StudentAttendance[] = filteredStudents.map((student: any) => {
          const attendance = existingAttendance[student._id];
          return {
            id: student._id,
            name: student.displayname || `${student.firstname || ''} ${student.lastname || ''}`.trim() || student.student_id,
            class: student.class || classFilter,
            section: student.section || sectionFilter,
            rollNumber: student.roll_number || '',
            status: attendance?.status || 'present',
            remarks: attendance?.remarks || '',
            isSelected: false,
            hasExistingRecord: !!attendance,
            markedAt: attendance?.marked_at
          };
        });

        setStudents(studentsData);
        setSelectedStudents([]);
        setSelectAll(false);
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
      // Don't throw - just show empty state
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [schoolId, teacherId, selectedDate, classFilter, sectionFilter]);

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [fetchStudentsAndAttendance]);

  const handleStatusChange = (studentId: string, status: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status: status as any } : student
    ));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, remarks } : student
    ));
  };

  const handleStudentSelect = (studentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const isChecked = e.target.checked;
    
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, isSelected: isChecked } : student
    ));
    
    setSelectedStudents(prev => 
      isChecked 
        ? [...prev, studentId]
        : prev.filter(id => id !== studentId)
    );
    
    // Update select all state
    if (!isChecked) {
      setSelectAll(false);
    } else if (selectedStudents.length + 1 === students.length) {
      setSelectAll(true);
    }
  };
  
  const handleStudentClick = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  const handleBulkAction = (status: string) => {
    setStudents(prev => prev.map(student => 
      selectedStudents.includes(student.id) 
        ? { ...student, status: status as any }
        : student
    ));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    
    if (isChecked) {
      const allIds = students.map(s => s.id);
      setSelectedStudents(allIds);
      setStudents(prev => prev.map(student => ({ ...student, isSelected: true })));
    } else {
      setSelectedStudents([]);
      setStudents(prev => prev.map(student => ({ ...student, isSelected: false })));
    }
  };

  const handleMarkAttendance = async () => {
    setSaving(true);
    try {
      const attendanceData = students.map(student => ({
        id: student.id,
        status: student.status,
        remarks: student.remarks
      }));

      const response = await apiService.markAttendance({
        school_id: schoolId,
        teacher_id: teacherId,
        date: selectedDate,
        students: attendanceData
      });

      if (response.success) {
        alert(response.message || 'Attendance saved successfully!');
        // Refresh the data to show updated status
        fetchStudentsAndAttendance();
        onAttendanceMarked?.();
      } else {
        alert(response.message || 'Failed to save attendance. Please try again.');
      }
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      alert(error.response?.data?.message || 'Error saving attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceSummary = () => {
    const summary = {
      present: students.filter(s => s.status === 'present').length,
      absent: students.filter(s => s.status === 'absent').length,
      late: students.filter(s => s.status === 'late').length,
      excused: students.filter(s => s.status === 'excused').length,
      halfDay: students.filter(s => s.status === 'half_day').length,
      total: students.length
    };
    return summary;
  };

  const summary = getAttendanceSummary();

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading students...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent>
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              No Students Found
            </div>
            <div style={{ marginBottom: '1rem' }}>
              No students found for {classFilter} {sectionFilter}. Please check the class and section selection.
            </div>
            <SecondaryButton onClick={fetchStudentsAndAttendance}>
              Refresh
            </SecondaryButton>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            {hasExistingRecords ? 'Edit' : 'Mark'} Attendance - {classFilter} {sectionFilter} - {new Date(selectedDate).toLocaleDateString()}
            {hasExistingRecords && (
              <span style={{ 
                marginLeft: '1rem', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                color: '#f59e0b',
                backgroundColor: '#fef3c7',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px'
              }}>
                Editing Existing Records
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceFetchError && (
            <div style={{ 
              padding: '0.75rem 1rem', 
              marginBottom: '1rem', 
              backgroundColor: '#fef3c7', 
              border: '1px solid #f59e0b', 
              borderRadius: '6px',
              color: '#92400e',
              fontSize: '0.875rem'
            }}>
              <strong>Note:</strong> Could not load existing attendance ({attendanceFetchError}). Starting fresh - you can still mark and save attendance.
            </div>
          )}
          <SummaryBar>
            <SummaryItem>
              <SummaryLabel>Total:</SummaryLabel>
              <SummaryNumber color="#3b82f6">{summary.total}</SummaryNumber>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Present:</SummaryLabel>
              <SummaryNumber color="#10b981">{summary.present}</SummaryNumber>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Absent:</SummaryLabel>
              <SummaryNumber color="#ef4444">{summary.absent}</SummaryNumber>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Late:</SummaryLabel>
              <SummaryNumber color="#f59e0b">{summary.late}</SummaryNumber>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Excused:</SummaryLabel>
              <SummaryNumber color="#8b5cf6">{summary.excused}</SummaryNumber>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Half Day:</SummaryLabel>
              <SummaryNumber color="#06b6d4">{summary.halfDay}</SummaryNumber>
            </SummaryItem>
          </SummaryBar>

          <ActionsBar>
            <BulkActionsContainer>
              <BulkActionButton 
                variant="present" 
                onClick={() => handleBulkAction('present')}
                disabled={selectedStudents.length === 0}
              >
                Mark Selected Present
              </BulkActionButton>
              <BulkActionButton 
                variant="absent" 
                onClick={() => handleBulkAction('absent')}
                disabled={selectedStudents.length === 0}
              >
                Mark Selected Absent
              </BulkActionButton>
              <BulkActionButton 
                variant="late" 
                onClick={() => handleBulkAction('late')}
                disabled={selectedStudents.length === 0}
              >
                Mark Selected Late
              </BulkActionButton>
            </BulkActionsContainer>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
            </div>
          </ActionsBar>

          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell style={{ width: '50px' }}>
                    <Checkbox 
                      type="checkbox" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </TableHeaderCell>
                  <TableHeaderCell>Student Name</TableHeaderCell>
                  <TableHeaderCell>Roll Number</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Remarks</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {students.map(student => (
                  <TableRow key={student.id} clickable style={{
                    backgroundColor: student.hasExistingRecord ? '#fffbeb' : 'white'
                  }}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        type="checkbox" 
                        checked={student.isSelected}
                        onChange={(e) => handleStudentSelect(student.id, e)}
                      />
                    </TableCell>
                    <TableCell clickable onClick={() => handleStudentClick(student.id)}>
                      <StudentName>
                        {student.name}
                        {student.hasExistingRecord && (
                          <span style={{ 
                            marginLeft: '0.5rem',
                            fontSize: '0.625rem',
                            color: '#f59e0b',
                            fontWeight: '600'
                          }}>
                            ✓ MARKED
                          </span>
                        )}
                      </StudentName>
                      <StudentDetails>{student.class} {student.section}</StudentDetails>
                    </TableCell>
                    <TableCell clickable onClick={() => handleStudentClick(student.id)}>
                      {student.rollNumber || 'N/A'}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <StatusSelect
                        status={student.status}
                        value={student.status}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                        <option value="half_day">Half Day</option>
                      </StatusSelect>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <RemarksInput
                        placeholder="Add remarks..."
                        value={student.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <SecondaryButton onClick={fetchStudentsAndAttendance}>
              Refresh
            </SecondaryButton>
            <PrimaryButton 
              onClick={handleMarkAttendance}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceForm;
