# School Management System - Frontend

A comprehensive React-based frontend for the School Management System built with Vite, TypeScript, and styled-components.

## Features

- **Authentication System**: Login and registration with JWT token management
- **Dashboard**: Overview of schools, teachers, and students with statistics
- **School Management**: CRUD operations for schools with stepper onboarding forms
- **Teacher Management**: Complete teacher onboarding and management system
- **Student Management**: Student records and management (basic implementation)
- **Attendance System**: Attendance tracking and reporting (UI ready for API integration)
- **Responsive Design**: Mobile-friendly layout with sidebar navigation
- **Modern UI**: Clean, professional interface using styled-components

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router DOM** for client-side routing
- **Styled Components** for CSS-in-JS styling
- **Axios** for API communication
- **Context API** for state management

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── forms/          # Form components and steppers
│   ├── layout/         # Layout components (sidebar, header)
│   ├── styled/         # Styled components and global styles
│   └── tables/         # Data table components
├── context/            # React Context for state management
├── pages/              # Page components
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on http://localhost:5000

### Installation

1. Navigate to the loki directory:
   ```bash
   cd loki
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application is fully integrated with the backend APIs:

### Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/logout` - User logout

### School Management APIs
- `GET /api/schools` - Get all schools
- `POST /api/schools` - Create new school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school
- `GET /api/schools/search` - Search schools

### Teacher Management APIs
- `GET /api/teacher` - Get all teachers
- `POST /api/teacher/onboard` - Onboard new teacher
- `PUT /api/teacher/:id` - Update teacher
- `PATCH /api/teacher/disable/:teacher_id` - Disable teacher
- `GET /api/teacher/search` - Search teachers

### Student Management APIs
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance APIs
- `GET /api/attendance/config/:school_id` - Get attendance config
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/student` - Get student attendance
- `GET /api/attendance/summary/:school_id/:student_id` - Get attendance summary

## Key Features

### 1. Authentication System
- Secure login/logout functionality
- JWT token management with automatic refresh
- Protected routes
- User registration with email verification

### 2. School Management
- Complete CRUD operations
- Stepper-based onboarding form
- School statistics and overview
- Search and filtering capabilities

### 3. Teacher Management
- Multi-step teacher onboarding process
- Teacher profile management
- Expertise and experience tracking
- School assignment

### 4. Data Tables
- Responsive data tables with pagination
- Sortable columns
- Action buttons (view, edit, delete)
- Loading states and empty states

### 5. Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile devices
- Responsive grid layouts
- Touch-friendly interface

## Styling

The application uses styled-components for styling with:
- Consistent design system
- Responsive breakpoints
- Dark/light theme support (ready for implementation)
- Meaningful component names for debugging

## State Management

Uses React Context API for state management:
- Global application state
- User authentication state
- Data caching for schools, teachers, students
- Loading states and error handling

## Development Guidelines

### Component Naming
- Use PascalCase for component names
- Use descriptive names that indicate purpose
- Styled components follow the pattern: `ComponentNameStyled`

### File Organization
- Group related components in folders
- Use index files for clean imports
- Separate concerns (UI, logic, types)

### TypeScript
- Define interfaces for all data structures
- Use strict typing throughout the application
- Export types from centralized type files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Write meaningful commit messages
5. Test on multiple browsers

## License

This project is part of the School Management System.
