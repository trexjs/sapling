# Attendance Module

This module provides comprehensive attendance management functionality for the school management system.

## Components

### 1. AttendanceCalendar
- Interactive calendar view for attendance tracking
- Visual indicators for different attendance statuses
- Holiday and weekend highlighting
- Date selection for marking attendance

### 2. AttendanceForm
- Bulk attendance marking interface
- Individual student status management
- Remarks and notes functionality
- Real-time attendance summary
- Bulk actions (mark all present/absent/late)

### 3. AttendanceTable
- Tabular view of attendance records
- Date-based filtering
- Class and section filtering
- Edit and delete functionality
- Export capabilities

### 4. AttendanceConfig
- Working days configuration
- Holiday management
- Attendance frozen time settings
- Academic year configuration
- Time-based restrictions

### 5. AttendanceSummary
- Comprehensive attendance analytics
- Student performance metrics
- Monthly/yearly breakdowns
- Visual charts and graphs
- Ranking system

## Features

### Core Functionality
- ✅ Mark attendance for individual students or entire classes
- ✅ Multiple attendance statuses (Present, Absent, Late, Excused, Half Day)
- ✅ Bulk attendance operations
- ✅ Real-time attendance tracking
- ✅ Historical attendance records

### Configuration
- ✅ Working days setup
- ✅ Holiday calendar management
- ✅ Attendance frozen time (prevents late modifications)
- ✅ Academic year configuration
- ✅ Class and section filtering

### Analytics & Reporting
- ✅ Attendance percentage calculations
- ✅ Monthly and yearly summaries
- ✅ Student performance rankings
- ✅ Visual data representation
- ✅ Export functionality

### User Experience
- ✅ Responsive design for all devices
- ✅ Intuitive tabbed interface
- ✅ Calendar and form view modes
- ✅ Real-time updates
- ✅ Error handling and validation

## API Integration

The module integrates with the following backend APIs:

- `GET /attendance/config/:schoolId` - Get attendance configuration
- `PUT /attendance/config/:schoolId` - Update attendance configuration
- `GET /attendance/student` - Get student attendance records
- `POST /attendance/mark` - Mark attendance for students
- `GET /attendance/summary/:schoolId/:studentId` - Get attendance summary
- `GET /attendance/class/:schoolId/:teacherId` - Get class attendance
- `PUT /attendance/record/:schoolId/:studentId/:date` - Update attendance record
- `DELETE /attendance/record/:schoolId/:studentId/:date` - Delete attendance record

## Usage

1. **Select School**: Choose the school for attendance management
2. **Choose Date**: Select the date for attendance operations
3. **Mark Attendance**: Use the form view to mark attendance for students
4. **View Records**: Check historical attendance data
5. **Generate Summary**: View analytics and reports
6. **Configure Settings**: Set up working days, holidays, and restrictions

## Dependencies

- React 18+
- TypeScript
- Styled Components
- Axios for API calls
- Date manipulation utilities

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
