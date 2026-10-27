import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { AppState, AppContextType, User, School, Teacher, Student, AttendanceRecord, LoginCredentials, RegisterData } from '../types';
import apiService from '../services/api';

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start with loading true to prevent immediate redirect
  schools: [],
  teachers: [],
  students: [],
  attendance: [],
};

// Global flags to prevent multiple concurrent API calls
let isFetchingStudents = false;
let isFetchingTeachers = false;
let isFetchingSchools = false;

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_SCHOOLS'; payload: School[] }
  | { type: 'SET_TEACHERS'; payload: Teacher[] }
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'SET_ATTENDANCE'; payload: AttendanceRecord[] }
  | { type: 'ADD_SCHOOL'; payload: School }
  | { type: 'ADD_TEACHER'; payload: Teacher }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_SCHOOL'; payload: School }
  | { type: 'UPDATE_TEACHER'; payload: Teacher }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'REMOVE_SCHOOL'; payload: string }
  | { type: 'REMOVE_TEACHER'; payload: string }
  | { type: 'REMOVE_STUDENT'; payload: string }
  | { type: 'LOGOUT' };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_SCHOOLS':
      return { ...state, schools: action.payload };
    
    case 'SET_TEACHERS':
      return { ...state, teachers: action.payload };
    
    case 'SET_STUDENTS':
      return { ...state, students: action.payload };
    
    case 'SET_ATTENDANCE':
      return { ...state, attendance: action.payload };
    
    case 'ADD_SCHOOL':
      return { ...state, schools: [...state.schools, action.payload] };
    
    case 'ADD_TEACHER':
      return { ...state, teachers: [...state.teachers, action.payload] };
    
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    
    case 'UPDATE_SCHOOL':
      return {
        ...state,
        schools: state.schools.map(school =>
          school._id === action.payload._id ? action.payload : school
        ),
      };
    
    case 'UPDATE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.map(teacher =>
          teacher._id === action.payload._id ? action.payload : teacher
        ),
      };
    
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(student =>
          student._id === action.payload._id ? action.payload : student
        ),
      };
    
    case 'REMOVE_SCHOOL':
      return {
        ...state,
        schools: state.schools.filter(school => school._id !== action.payload),
      };
    
    case 'REMOVE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.filter(teacher => teacher._id !== action.payload),
      };
    
    case 'REMOVE_STUDENT':
      return {
        ...state,
        students: state.students.filter(student => student._id !== action.payload),
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        loading: false,
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

// AppProvider component - stable for Fast Refresh
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing auth token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      console.log('App initialization - checking token:', token ? `Token exists (${token.length} chars)` : 'No token');
      console.log('Full token:', token);
      console.log('All localStorage items:', {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        allKeys: Object.keys(localStorage)
      });
      
      // Test JWT token format
      if (token) {
        try {
          const parts = token.split('.');
          console.log('JWT parts:', parts.length);
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('JWT payload:', payload);
            console.log('Token expires at:', new Date(payload.exp * 1000));
            console.log('Current time:', new Date());
            const isExpired = new Date() > new Date(payload.exp * 1000);
            console.log('Token expired?', isExpired);
            
            // If token is expired, remove it immediately
            if (isExpired) {
              console.log('Token is expired, removing from localStorage');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              dispatch({ type: 'SET_AUTHENTICATED', payload: false });
              dispatch({ type: 'SET_LOADING', payload: false });
              return;
            }
          }
        } catch (e) {
          console.log('JWT decode error:', e);
          // If we can't decode the token, it's invalid
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
      } else {
        // No token, user is not authenticated
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      
      if (token) {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          // First, test if server is accessible using health endpoint
          console.log('Testing server connectivity...');
          const healthCheck = await fetch('http://localhost:5000/api/auth/health');
          console.log('Server health check status:', healthCheck.status);
          
          // Validate token by fetching user profile using API service
          console.log('Making profile request with token:', token.substring(0, 20) + '...');
          try {
            const response = await apiService.getProfile();
            console.log('Token validation successful:', response);
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            dispatch({ type: 'SET_USER', payload: response.data.user });
          } catch (apiError: any) {
            console.log('Token validation failed:', apiError.response?.status, apiError.response?.data);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('accessToken');
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initializeAuth();
  }, []);

  // Auth functions
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Login attempt with credentials:', credentials);
      const response = await apiService.login(credentials);
      console.log('Login API response:', response);
      
      if (response.success) {
        const { user, tokens } = response.data;
        console.log('Login successful - response data:', response.data);
        console.log('User data:', user);
        console.log('Tokens data:', tokens);
        console.log('Access token:', tokens?.access_token);
        console.log('Refresh token:', tokens?.refresh_token);
        
        if (tokens?.access_token) {
          localStorage.setItem('accessToken', tokens.access_token);
          console.log('Stored access token in localStorage');
          console.log('Verification - accessToken in localStorage:', localStorage.getItem('accessToken'));
        } else {
          console.error('No access_token in response!');
        }
        
        if (tokens?.refresh_token) {
          localStorage.setItem('refreshToken', tokens.refresh_token);
          console.log('Stored refresh token in localStorage');
          console.log('Verification - refreshToken in localStorage:', localStorage.getItem('refreshToken'));
        } else {
          console.error('No refresh_token in response!');
        }
        
        // Final verification
        console.log('Final localStorage check:', {
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken'),
          allKeys: Object.keys(localStorage)
        });
        
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      } else {
        console.error('Login failed - response not successful:', response);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.register(data);
      
      if (response.success) {
        // Registration successful, user needs to verify email
        console.log('Registration successful:', response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const logout = useCallback((): void => {
    apiService.logout();
    dispatch({ type: 'LOGOUT' });
    // Reset fetch flags
    isFetchingStudents = false;
    isFetchingTeachers = false;
    isFetchingSchools = false;
  }, []);

  // School functions
  const fetchSchools = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getSchools();
      
      if (response.success) {
        dispatch({ type: 'SET_SCHOOLS', payload: response.data });
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createSchool = async (schoolData: Partial<School>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createSchool(schoolData);
      
      if (response.success) {
        dispatch({ type: 'ADD_SCHOOL', payload: response.data });
      }
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateSchool = async (id: string, schoolData: Partial<School>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.updateSchool(id, schoolData);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_SCHOOL', payload: response.data });
      }
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteSchool = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.deleteSchool(id);
      
      if (response.success) {
        dispatch({ type: 'REMOVE_SCHOOL', payload: id });
      }
    } catch (error) {
      console.error('Error deleting school:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Teacher functions
  const fetchTeachers = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getTeachers();
      
      if (response.success) {
        dispatch({ type: 'SET_TEACHERS', payload: response.data });
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createTeacher = async (teacherData: Partial<Teacher>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createTeacher(teacherData);
      
      if (response.success) {
        dispatch({ type: 'ADD_TEACHER', payload: response.data });
      }
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateTeacher = async (id: string, teacherData: Partial<Teacher>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.updateTeacher(id, teacherData);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_TEACHER', payload: response.data });
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteTeacher = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.deleteTeacher(id);
      
      if (response.success) {
        dispatch({ type: 'REMOVE_TEACHER', payload: id });
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Student functions
  const fetchStudents = useCallback(async (): Promise<void> => {
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getStudents();
      
      if (response.success) {
        dispatch({ type: 'SET_STUDENTS', payload: response.data });
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createStudent = async (studentData: Partial<Student>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createStudent(studentData);
      
      if (response.success) {
        dispatch({ type: 'ADD_STUDENT', payload: response.data });
      }
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.updateStudent(id, studentData);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_STUDENT', payload: response.data });
      }
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteStudent = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.deleteStudent(id);
      
      if (response.success) {
        dispatch({ type: 'REMOVE_STUDENT', payload: id });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Attendance functions
  const fetchAttendance = async (_schoolId: string, _studentId?: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // This would need to be implemented based on the specific attendance API
      // For now, we'll just set empty array
      dispatch({ type: 'SET_ATTENDANCE', payload: [] });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: AppContextType = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    fetchSchools,
    fetchTeachers,
    fetchStudents,
    fetchAttendance,
    createSchool,
    createTeacher,
    createStudent,
    updateSchool,
    updateTeacher,
    updateStudent,
    deleteSchool,
    deleteTeacher,
    deleteStudent,
  }), [
    state,
    login,
    register,
    logout,
    fetchSchools,
    fetchTeachers,
    fetchStudents,
    fetchAttendance,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
// This is a stable hook that should not cause Fast Refresh issues
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
