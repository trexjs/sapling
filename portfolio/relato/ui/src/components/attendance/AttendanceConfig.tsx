import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton, Select, Input, FormGroup, Label } from '../styled/CommonComponents';

const ConfigContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimeInput = styled(Input)`
  width: 80px;
  text-align: center;
`;

const PeriodSelect = styled(Select)`
  width: 80px;
`;

const WorkingDaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayCheckbox = styled.label<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 2px solid ${props => props.isSelected ? '#2563eb' : '#e5e7eb'};
  border-radius: 6px;
  cursor: pointer;
  background: ${props => props.isSelected ? '#eff6ff' : 'white'};
  transition: all 0.2s;
  
  &:hover {
    border-color: #2563eb;
  }
`;

const DayName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const DayNumber = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`;

const HolidayList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`;

const HolidayItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const HolidayInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HolidayName = styled.span`
  font-weight: 500;
  color: #111827;
`;

const HolidayDate = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const RemoveButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #dc2626;
  border-radius: 4px;
  background: white;
  color: #dc2626;
  font-size: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background: #fee2e2;
  }
`;

const AddHolidayForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AcademicYearContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Switch = styled.input`
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  appearance: none;
  cursor: pointer;
  
  &:checked {
    background: #2563eb;
  }
  
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
  }
  
  &:checked:before {
    transform: translateX(20px);
  }
`;

interface AttendanceConfigProps {
  schoolId: string;
  onConfigUpdated?: () => void;
}

interface AttendanceConfigData {
  holidays: Map<string, any>;
  frozen_time: {
    hour: number;
    minute: number;
    period: 'AM' | 'PM';
    enabled: boolean;
  };
  working_days: number[];
  academic_year: {
    start_month: number;
    end_month: number;
  };
}

const AttendanceConfig: React.FC<AttendanceConfigProps> = ({
  schoolId,
  onConfigUpdated
}) => {
  const [config, setConfig] = useState<AttendanceConfigData>({
    holidays: new Map(),
    frozen_time: {
      hour: 15,
      minute: 0,
      period: 'PM',
      enabled: true
    },
    working_days: [1, 2, 3, 4, 5],
    academic_year: {
      start_month: 4,
      end_month: 3
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchConfig();
  }, [schoolId]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAttendanceConfig(schoolId);
      if (response.success) {
        // Convert holidays object to Map if it's not already a Map
        const configData = response.data;
        if (configData.holidays && !(configData.holidays instanceof Map)) {
          configData.holidays = new Map(Object.entries(configData.holidays));
        }
        setConfig(configData);
      }
    } catch (error) {
      console.error('Error fetching attendance config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      // Convert Map back to object for API
      const configToSend = {
        ...config,
        holidays: config.holidays instanceof Map ? Object.fromEntries(config.holidays) : config.holidays
      };
      const response = await apiService.updateAttendanceConfig(schoolId, configToSend);
      if (response.success) {
        alert('Attendance configuration updated successfully!');
        onConfigUpdated?.();
      } else {
        alert('Failed to update configuration.');
      }
    } catch (error) {
      console.error('Error updating attendance config:', error);
      alert('Error updating configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleWorkingDayToggle = (dayIndex: number) => {
    setConfig(prev => ({
      ...prev,
      working_days: prev.working_days.includes(dayIndex)
        ? prev.working_days.filter(d => d !== dayIndex)
        : [...prev.working_days, dayIndex]
    }));
  };

  const handleFrozenTimeChange = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      frozen_time: {
        ...prev.frozen_time,
        [field]: value
      }
    }));
  };

  const handleAcademicYearChange = (field: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      academic_year: {
        ...prev.academic_year,
        [field]: value
      }
    }));
  };

  const handleAddHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      const holidays = new Map(config.holidays);
      holidays.set(newHoliday.date, { name: newHoliday.name, date: newHoliday.date });
      setConfig(prev => ({
        ...prev,
        holidays
      }));
      setNewHoliday({ name: '', date: '' });
    }
  };

  const handleRemoveHoliday = (date: string) => {
    const holidays = new Map(config.holidays);
    holidays.delete(date);
    setConfig(prev => ({
      ...prev,
      holidays
    }));
  };

  const formatHolidayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading configuration...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ConfigContainer>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Working Days & Time Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Label>Working Days</Label>
              <WorkingDaysContainer>
                {dayNames.map((day, index) => (
                  <DayCheckbox
                    key={index}
                    isSelected={config.working_days.includes(index)}
                    onClick={() => handleWorkingDayToggle(index)}
                  >
                    <DayName>{day}</DayName>
                    <DayNumber>{index}</DayNumber>
                  </DayCheckbox>
                ))}
              </WorkingDaysContainer>
            </FormGroup>

            <FormGroup>
              <Label>Attendance Frozen Time</Label>
              <ToggleSwitch>
                <Switch
                  type="checkbox"
                  checked={config.frozen_time.enabled}
                  onChange={(e) => handleFrozenTimeChange('enabled', e.target.checked)}
                />
                <span>Enable frozen time</span>
              </ToggleSwitch>
              {config.frozen_time.enabled && (
                <TimeInputContainer style={{ marginTop: '0.5rem' }}>
                  <TimeInput
                    type="number"
                    min="1"
                    max="12"
                    value={config.frozen_time.hour}
                    onChange={(e) => handleFrozenTimeChange('hour', parseInt(e.target.value))}
                  />
                  <span>:</span>
                  <TimeInput
                    type="number"
                    min="0"
                    max="59"
                    value={config.frozen_time.minute}
                    onChange={(e) => handleFrozenTimeChange('minute', parseInt(e.target.value))}
                  />
                  <PeriodSelect
                    value={config.frozen_time.period}
                    onChange={(e) => handleFrozenTimeChange('period', e.target.value)}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </PeriodSelect>
                </TimeInputContainer>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Academic Year</Label>
              <AcademicYearContainer>
                <div>
                  <Label htmlFor="start-month">Start Month</Label>
                  <Select
                    id="start-month"
                    value={config.academic_year.start_month}
                    onChange={(e) => handleAcademicYearChange('start_month', parseInt(e.target.value))}
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="end-month">End Month</Label>
                  <Select
                    id="end-month"
                    value={config.academic_year.end_month}
                    onChange={(e) => handleAcademicYearChange('end_month', parseInt(e.target.value))}
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </Select>
                </div>
              </AcademicYearContainer>
            </FormGroup>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Holidays Management</CardTitle>
          </CardHeader>
          <CardContent>
            <AddHolidayForm>
              <Input
                placeholder="Holiday name"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="date"
                value={newHoliday.date}
                onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
              />
              <PrimaryButton onClick={handleAddHoliday}>
                Add
              </PrimaryButton>
            </AddHolidayForm>

            <HolidayList>
              {Array.from(config.holidays.entries()).map(([date, holiday]) => (
                <HolidayItem key={date}>
                  <HolidayInfo>
                    <HolidayName>{holiday.name}</HolidayName>
                    <HolidayDate>{formatHolidayDate(date)}</HolidayDate>
                  </HolidayInfo>
                  <RemoveButton onClick={() => handleRemoveHoliday(date)}>
                    Remove
                  </RemoveButton>
                </HolidayItem>
              ))}
              {config.holidays.size === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No holidays configured
                </div>
              )}
            </HolidayList>
          </CardContent>
        </Card>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <SecondaryButton onClick={fetchConfig}>
            Reset
          </SecondaryButton>
          <PrimaryButton onClick={handleSaveConfig} disabled={saving}>
            {saving ? 'Saving...' : 'Save Configuration'}
          </PrimaryButton>
        </div>
      </div>
    </ConfigContainer>
  );
};

export default AttendanceConfig;
