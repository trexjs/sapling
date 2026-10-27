import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../../services/api';
import { AttendanceRecord } from '../../types';

const CalendarContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthYear = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const NavigationButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    background: #e5e7eb;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  background: #f9fafb;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
`;

const DayCell = styled.div<{ isCurrentMonth: boolean; isToday: boolean; isWorkingDay: boolean; isHoliday: boolean; attendanceStatus?: string }>`
  background: ${props => {
    if (!props.isCurrentMonth) return '#f9fafb';
    if (props.isHoliday) return '#fef3c7';
    if (!props.isWorkingDay) return '#f3f4f6';
    return 'white';
  }};
  padding: 0.75rem 0.5rem;
  text-align: center;
  cursor: ${props => props.isCurrentMonth && props.isWorkingDay && !props.isHoliday ? 'pointer' : 'default'};
  position: relative;
  min-height: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.isCurrentMonth && props.isWorkingDay && !props.isHoliday ? '#f0f9ff' : 'inherit'};
  }
`;

const DayNumber = styled.span<{ isToday: boolean }>`
  font-size: 0.875rem;
  font-weight: ${props => props.isToday ? '700' : '500'};
  color: ${props => {
    if (props.isToday) return '#2563eb';
    return '#111827';
  }};
`;

const AttendanceIndicator = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 0.25rem;
  background: ${props => {
    switch (props.status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'excused': return '#8b5cf6';
      case 'half_day': return '#06b6d4';
      default: return 'transparent';
    }
  }};
`;

const HolidayLabel = styled.div`
  font-size: 0.625rem;
  color: #92400e;
  font-weight: 500;
  margin-top: 0.25rem;
`;

const WeekendLabel = styled.div`
  font-size: 0.625rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.25rem;
`;

interface AttendanceCalendarProps {
  schoolId: string;
  studentId?: string;
  teacherId: string;
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  schoolId,
  studentId,
  teacherId,
  onDateSelect,
  selectedDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord[]>>({});
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchAttendanceConfig();
  }, [schoolId]);

  useEffect(() => {
    if (config) {
      fetchAttendanceData();
    }
  }, [currentDate, config, schoolId, studentId, teacherId]);

  const fetchAttendanceConfig = async () => {
    try {
      const response = await apiService.getAttendanceConfig(schoolId);
      if (response.success) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Error fetching attendance config:', error);
    }
  };

  const fetchAttendanceData = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = monthNames[currentDate.getMonth()];
      
      const response = await apiService.getStudentAttendance(
        { type: 'student', student_id: studentId, year, month },
        { school_id: schoolId, teacher_id: teacherId }
      );
      
      if (response.success) {
        setAttendanceData(response.data.dates || {});
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isWorkingDay = (date: Date): boolean => {
    if (!config) return true;
    return config.isWorkingDay ? config.isWorkingDay(date) : true;
  };

  const isHoliday = (date: Date): boolean => {
    if (!config) return false;
    return config.isHoliday ? config.isHoliday(date) : false;
  };

  const getAttendanceStatus = (day: number): string | undefined => {
    const dayStr = day.toString();
    const records = attendanceData[dayStr];
    if (records && records.length > 0) {
      return records[0].status;
    }
    return undefined;
  };

  const getHolidayName = (day: number): string | undefined => {
    if (!config) return undefined;
    const year = currentDate.getFullYear();
    const month = monthNames[currentDate.getMonth()];
    const holidays = config.getHolidaysForYear ? config.getHolidaysForYear(year) : [];
    const monthHolidays = holidays.filter((h: any) => h.month === month);
    const holiday = monthHolidays.find((h: any) => h.date === day.toString());
    return holiday ? holiday.name : undefined;
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <DayCell key={`empty-${i}`} isCurrentMonth={false} isToday={false} isWorkingDay={false} isHoliday={false} />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isWorking = isWorkingDay(date);
      const isHolidayDay = isHoliday(date);
      const attendanceStatus = getAttendanceStatus(day);
      const holidayName = getHolidayName(day);
      const isSelected = selectedDate === date.toISOString().split('T')[0];

      days.push(
        <DayCell
          key={day}
          isCurrentMonth={true}
          isToday={isToday}
          isWorkingDay={isWorking}
          isHoliday={isHolidayDay}
          attendanceStatus={attendanceStatus}
          onClick={() => {
            if (isWorking && !isHolidayDay && onDateSelect) {
              onDateSelect(date.toISOString().split('T')[0]);
            }
          }}
          style={{
            border: isSelected ? '2px solid #2563eb' : 'none',
            backgroundColor: isSelected ? '#eff6ff' : undefined
          }}
        >
          <DayNumber isToday={isToday}>{day}</DayNumber>
          {attendanceStatus && <AttendanceIndicator status={attendanceStatus} />}
          {isHolidayDay && holidayName && <HolidayLabel>{holidayName}</HolidayLabel>}
          {!isWorking && !isHolidayDay && <WeekendLabel>Weekend</WeekendLabel>}
        </DayCell>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <CalendarContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading calendar...
        </div>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavigationButton onClick={() => navigateMonth('prev')}>
          ← Previous
        </NavigationButton>
        <MonthYear>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </MonthYear>
        <NavigationButton onClick={() => navigateMonth('next')}>
          Next →
        </NavigationButton>
      </CalendarHeader>

      <CalendarGrid>
        {dayNames.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        {renderCalendarDays()}
      </CalendarGrid>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AttendanceIndicator status="present" />
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Present</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AttendanceIndicator status="absent" />
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Absent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AttendanceIndicator status="late" />
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Late</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AttendanceIndicator status="excused" />
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Excused</span>
        </div>
      </div>
    </CalendarContainer>
  );
};

export default AttendanceCalendar;
