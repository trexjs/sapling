import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent, Select, Input, FormGroup, Label } from '../styled/CommonComponents';

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled(Card)<{ color: string }>`
  border-left: 4px solid ${props => props.color};
`;

const SummaryNumber = styled.div<{ color: string }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
`;

const SummaryPercentage = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const BarChart = styled.div`
  display: flex;
  align-items: end;
  gap: 0.5rem;
  height: 200px;
  padding: 1rem 0;
`;

const Bar = styled.div<{ height: number; color: string; label: string }>`
  flex: 1;
  background: ${props => props.color};
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
  min-height: 20px;
  
  &::after {
    content: '${props => props.label}';
    position: absolute;
    bottom: -1.5rem;
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }
`;

const BarValue = styled.div`
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const StudentListContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`;

const StudentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StudentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StudentName = styled.span`
  font-weight: 500;
  color: #111827;
`;

const StudentDetails = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const AttendanceStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 0.25rem;
`;

const AttendancePercentage = styled.div<{ percentage: number }>`
  font-weight: 600;
  color: ${props => {
    if (props.percentage >= 90) return '#10b981';
    if (props.percentage >= 75) return '#f59e0b';
    return '#ef4444';
  }};
`;

const AttendanceDetails = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

interface AttendanceSummaryProps {
  schoolId: string;
  studentId?: string;
  teacherId: string;
}

interface SummaryData {
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  half_day_days: number;
  attendance_percentage: number;
  monthly_breakdown: Array<{
    month: string;
    present: number;
    absent: number;
    late: number;
    excused: number;
    half_day: number;
  }>;
  student_rankings: Array<{
    student_id: string;
    student_name: string;
    attendance_percentage: number;
    present_days: number;
    total_days: number;
  }>;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  schoolId,
  studentId,
  teacherId
}) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');

  useEffect(() => {
    if (studentId) {
      fetchSummary();
    }
  }, [schoolId, studentId, teacherId, year, month]);

  const fetchSummary = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const response = await apiService.getAttendanceSummary(schoolId, studentId, {
        year,
        month: month || undefined
      });

      if (response.success) {
        setSummaryData(response.data);
      }
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (percentage: number): string => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const getAttendanceStatus = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Poor';
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading attendance summary...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summaryData) {
    return (
      <Card>
        <CardContent>
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Select a student to view attendance summary
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(
    summaryData.present_days,
    summaryData.absent_days,
    summaryData.late_days,
    summaryData.excused_days,
    summaryData.half_day_days
  );

  return (
    <div>
      <FiltersContainer>
        <FormGroup>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min="2020"
            max="2030"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="month">Month (Optional)</Label>
          <Select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            <option value="JAN">January</option>
            <option value="FEB">February</option>
            <option value="MAR">March</option>
            <option value="APR">April</option>
            <option value="MAY">May</option>
            <option value="JUN">June</option>
            <option value="JUL">July</option>
            <option value="AUG">August</option>
            <option value="SEP">September</option>
            <option value="OCT">October</option>
            <option value="NOV">November</option>
            <option value="DEC">December</option>
          </Select>
        </FormGroup>
      </FiltersContainer>

      <SummaryContainer>
        <SummaryCard color="#10b981">
          <CardContent>
            <SummaryNumber color="#10b981">{summaryData.present_days}</SummaryNumber>
            <SummaryLabel>Present Days</SummaryLabel>
            <SummaryPercentage>
              {((summaryData.present_days / summaryData.total_days) * 100).toFixed(1)}%
            </SummaryPercentage>
          </CardContent>
        </SummaryCard>

        <SummaryCard color="#ef4444">
          <CardContent>
            <SummaryNumber color="#ef4444">{summaryData.absent_days}</SummaryNumber>
            <SummaryLabel>Absent Days</SummaryLabel>
            <SummaryPercentage>
              {((summaryData.absent_days / summaryData.total_days) * 100).toFixed(1)}%
            </SummaryPercentage>
          </CardContent>
        </SummaryCard>

        <SummaryCard color="#f59e0b">
          <CardContent>
            <SummaryNumber color="#f59e0b">{summaryData.late_days}</SummaryNumber>
            <SummaryLabel>Late Days</SummaryLabel>
            <SummaryPercentage>
              {((summaryData.late_days / summaryData.total_days) * 100).toFixed(1)}%
            </SummaryPercentage>
          </CardContent>
        </SummaryCard>

        <SummaryCard color="#8b5cf6">
          <CardContent>
            <SummaryNumber color="#8b5cf6">{summaryData.excused_days}</SummaryNumber>
            <SummaryLabel>Excused Days</SummaryLabel>
            <SummaryPercentage>
              {((summaryData.excused_days / summaryData.total_days) * 100).toFixed(1)}%
            </SummaryPercentage>
          </CardContent>
        </SummaryCard>

        <SummaryCard color="#06b6d4">
          <CardContent>
            <SummaryNumber color="#06b6d4">{summaryData.half_day_days}</SummaryNumber>
            <SummaryLabel>Half Days</SummaryLabel>
            <SummaryPercentage>
              {((summaryData.half_day_days / summaryData.total_days) * 100).toFixed(1)}%
            </SummaryPercentage>
          </CardContent>
        </SummaryCard>

        <SummaryCard color={getAttendanceColor(summaryData.attendance_percentage)}>
          <CardContent>
            <SummaryNumber color={getAttendanceColor(summaryData.attendance_percentage)}>
              {summaryData.attendance_percentage.toFixed(1)}%
            </SummaryNumber>
            <SummaryLabel>Overall Attendance</SummaryLabel>
            <SummaryPercentage>
              {getAttendanceStatus(summaryData.attendance_percentage)}
            </SummaryPercentage>
          </CardContent>
        </SummaryCard>
      </SummaryContainer>

      <ChartContainer>
        <ChartTitle>Attendance Breakdown</ChartTitle>
        <BarChart>
          <Bar
            height={(summaryData.present_days / maxValue) * 100}
            color="#10b981"
            label="Present"
          >
            <BarValue>{summaryData.present_days}</BarValue>
          </Bar>
          <Bar
            height={(summaryData.absent_days / maxValue) * 100}
            color="#ef4444"
            label="Absent"
          >
            <BarValue>{summaryData.absent_days}</BarValue>
          </Bar>
          <Bar
            height={(summaryData.late_days / maxValue) * 100}
            color="#f59e0b"
            label="Late"
          >
            <BarValue>{summaryData.late_days}</BarValue>
          </Bar>
          <Bar
            height={(summaryData.excused_days / maxValue) * 100}
            color="#8b5cf6"
            label="Excused"
          >
            <BarValue>{summaryData.excused_days}</BarValue>
          </Bar>
          <Bar
            height={(summaryData.half_day_days / maxValue) * 100}
            color="#06b6d4"
            label="Half Day"
          >
            <BarValue>{summaryData.half_day_days}</BarValue>
          </Bar>
        </BarChart>
      </ChartContainer>

      {summaryData.student_rankings && summaryData.student_rankings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Student Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentListContainer>
              {summaryData.student_rankings.map((student, index) => (
                <StudentItem key={student.student_id}>
                  <StudentInfo>
                    <StudentName>
                      #{index + 1} {student.student_name}
                    </StudentName>
                    <StudentDetails>
                      ID: {student.student_id}
                    </StudentDetails>
                  </StudentInfo>
                  <AttendanceStats>
                    <AttendancePercentage percentage={student.attendance_percentage}>
                      {student.attendance_percentage.toFixed(1)}%
                    </AttendancePercentage>
                    <AttendanceDetails>
                      {student.present_days}/{student.total_days} days
                    </AttendanceDetails>
                  </AttendanceStats>
                </StudentItem>
              ))}
            </StudentListContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceSummary;
